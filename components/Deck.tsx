import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Animated, PanResponder, StyleProp, StyleSheet, TextStyle, View, ViewStyle, Text, Pressable, Platform } from "react-native"
import Svg, { Path } from "react-native-svg"
import { Card } from "../index"
import { Image } from "expo-image"
import FlipCard from "./Flipcard"

interface DeckProps {
    cards: (string | { [key: string]: Card; })[]
    cardName: string;
    containerStyle: StyleProp<ViewStyle>,
    stackSize: number,
    imageWidth: number,
    imageHeight: number,
    captions: React.ReactElement[],
    captionStyles?: StyleProp<TextStyle>
    captionContainerStyle?: StyleProp<ViewStyle>
}

/**
 * To prevent blip rerendering of top card after transition animationg, call resetPos AFTER currentIndex changes
 * visible flash is primarily caused by resetting pan and cardOpacity before the new currentCard has rendered.
 * When hovering over a card and scrolling, card can transitions Y unintentionally. DON'T FREAK OUT, it's an emulator bug.
 * @param param0 
 * @returns
 */
const ImageDeck: React.FC<DeckProps> = ({ cards, cardName, containerStyle, stackSize = 3, imageWidth = 220, imageHeight = 300, captions, captionStyles, captionContainerStyle }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const pan = useRef<Animated.ValueXY>(new Animated.ValueXY()).current
    const cardOpacity = useRef(new Animated.Value(1)).current; //optional
    const [swipeThreshold, setSwipeThreshold] = useState<number>(0)
    const swipeOutDuration: number = 300
    const [swipeDirection, setSwipeDirection] = useState<string | null>()
    const [showFront, setShowFront] = useState<boolean>(true)

    useEffect(() => {
        setCurrentIndex(0)
    }, [cards])

    useEffect(() => {
        setSwipeThreshold(imageWidth * .3)
    }, [imageWidth])

    const resetPos = useCallback(() => {
        pan.setValue({ x: 0, y: 0 })
        cardOpacity.setValue(1)
        setSwipeDirection(null)
    }, [])

    const moveCard = useCallback((direction: string, velocity: { vx: number, vy: number }) => {
        let xDestination = 0
        let yDestination = 0

        //switch statement instead of if because it requires breaks
        switch (direction) {
            case 'right':
                // positive X
                setSwipeDirection('horizontal')
                xDestination = imageWidth * 1.5
                yDestination = velocity ? velocity.vy * .5 : 0
                break
            case 'left':
                //negative X
                setSwipeDirection('horizontal')
                xDestination = -imageWidth * 1.5
                yDestination = velocity ? velocity.vy * .5 : 0
                break
            case 'top':
                //negative Y
                setSwipeDirection('vertical')
                yDestination = -imageWidth * 1.5
                break
            case 'bottom':
                // positive Y
                setSwipeDirection('vertical')
                yDestination = imageWidth * 1.5
                break
        }

        //Fade while swiping animation
        Animated.parallel([
            //swipe
            Animated.timing(pan, {
                toValue: { x: xDestination, y: yDestination },
                duration: swipeOutDuration,
                useNativeDriver: true
            }),
            Animated.timing(cardOpacity, {
                toValue: 0,
                duration: swipeOutDuration,
                useNativeDriver: true
            })
        ]).start(() => {
            //execute after Animation start
            /**
             * Set next card in stack.
             * if currentIndex + stacksize = cards.length, that means last index to keep stack size.
             * if next card is last card, reset to first card at end of animation.
             */
            if (currentIndex + 1 === cards.length) {
                setCurrentIndex(0)
            } else {
                setCurrentIndex(prevIndex => prevIndex + 1 === cards.length ? 0 : prevIndex + 1)
            }

            // resetPos();
        })
    }, [cards.length, imageWidth, pan, cardOpacity, swipeOutDuration])

    /**
     * useLayoutEffect is BLOCKING: Nothing else can happen while this runs,
     * good for making changes BEFORE the user sees the screen,
     * as opposed to useEffect which is non-blocking
     */
    useLayoutEffect(() => {
        resetPos()
    }, [currentIndex, resetPos])

    const throwCard = (direction: string) => {
        moveCard(direction, { vx: 1, vy: -0.5 })
    }

    const renderCardContent = (card: string | { [key: string]: Card; }) => {
        if (typeof card === 'string') {
            return <Image source={{ uri: card }} alt={`${cardName}`} style={styles.card_image} />
        }

        return (
            <View testID="flipcard_container" style={styles.card_image}>
                <FlipCard
                    front={{ uri: card[0].image_uri }}
                    back={{ uri: card[1].image_uri }}
                    onFlip={() => setShowFront(!showFront)}
                    buttonStyle={styles.flip_button}
                    altBack={cardName.split('//')[1]}
                    altFront={cardName.split('//')[0]}
                />
            </View>
        )
    }

       /**
 * dx/y - accumulated distance of the gesture since the touch started
 * vx/y - velocity of gesture.
 * moveX/Y - the latest screen coordinates of the recently-moved touch
 * Left swipes means -x values, means index goes up.
 * Right swipes means +x values, means index goes down.
 */
    const panResponder = PanResponder.create({
        /**
         * onStartShouldSetPanResponderCapture asks whether a parent component wants to claim touch responder status during the capture phase when a touch first starts.
         * Setting it to false will allow child touches (like a Press that triggers card flip animation) to execute (parent won't capture).
         */
        onStartShouldSetPanResponderCapture: () => false,
        // onStartShouldSetPanResponder: () => !lastCard,
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            // Activate for omnidirectionaal swipe threshold
            const { dx, dy } = gestureState
            return Math.abs(dx) > 5 || Math.abs(dy) > 5;
        },
        onPanResponderGrant: () => {
            // stop any current animations
            pan.extractOffset()
        },
        onPanResponderMove: (event, gestureState) => {
            const { dx, dy, moveX, moveY } = gestureState
            //update pos
            pan.setValue({ x: dx, y: dy })
            /**
             * animate based on swipe distance
             * Pythagorean theorem to measure true (missing) diagonal distance of swipe.
             *  |\
             * y| \ distance
             *  ---x
             */
            const distance = Math.sqrt((dx * dx) + (dy * dy))
            const newOpacity = Math.max(0.4 /* min opacity*/, 1 - (distance / imageWidth))
            cardOpacity.setValue(newOpacity);

        },
        onPanResponderRelease: (_, gestureState) => {
            const { dx, dy, vx, vy } = gestureState;

            const distance = Math.sqrt((dx * dx) + (dy * dy))
            const swiped = distance > swipeThreshold

            if (swiped) {
                //Determine direction
                let direction = null;
                if (Math.abs(dx) > Math.abs(dy)) {
                    direction = dx > 0 ? 'right' : 'left'
                } else {
                    direction = dy > 0 ? 'bottom' : 'top'
                }
                moveCard(direction, { vx, vy })
            } else {
                // Spring image to center if not swiping
                // Lower tension = less bounce
                // Higher friction = less bounce
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    friction: 5,
                    tension: 60,
                    useNativeDriver: true
                }).start()

                Animated.spring(cardOpacity, {
                    toValue: 1,
                    friction: 5,
                    tension: 60,
                    useNativeDriver: true
                }).start()
            }
            // flatten the offset back into the value, to clear any accumulated offsets, 
            // preventing values stuck from scrolling while swiping, making card look skewed
            pan.flattenOffset()
        }
    })

    const renderDeckCards = () => cards.map((card, index) => {
        const isCurrentCard = index === currentIndex
        const stackIndex = index - currentIndex

        if (stackIndex < 0 || stackIndex > stackSize) {
            return null
        }

        return (
            <Animated.View
                key={`deckcard_${index}`}
                testID="animated_image_container"
                {...(isCurrentCard ? panResponder.panHandlers : {})}
                style={[isCurrentCard ? styles.image_wrapper : styles.background_card, {
                    transform: isCurrentCard ? [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        swipeDirection === 'vertical'
                            ? { rotate: pan.y.interpolate({ inputRange: [-100, 0, 100], outputRange: ['-400deg', '0deg', '400deg'], extrapolate: 'clamp' }) }
                            : { rotate: pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-400deg', '0deg', '400deg'], extrapolate: 'clamp' }) }
                    ] : [
                         //background card offset of 7 px
                        { translateY: -(stackIndex * 7) },
                        { translateX: stackIndex * 7 }
                    ],
                    // opacity: isCurrentCard ? cardOpacity : 0.9,
                    width: imageWidth,
                    zIndex: isCurrentCard ? stackSize + 1 : stackSize - stackIndex,
                }]}
            >
                {renderCardContent(card)}
            </Animated.View>
        )
    })

    return (
        <View style={styles.deck_container}>
            {cards.length > 1 &&
                <Pressable onPress={() => throwCard('left')}
                    style={[styles.arrows, {
                        left: 0,
                    }]}>
                    <Svg viewBox="0 0 24 24" width={60} height={60}>
                        <Path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                            fill={'#e0e0e0'} />
                    </Svg>
                </Pressable>
            }
            <View style={containerStyle}>

                {renderDeckCards()}

                {
                    captions && captions[currentIndex]
                }
            </View >
            {
                cards.length > 1 &&
                <Pressable onPress={() => throwCard('right')}
                    style={[styles.arrows,
                    { right: 0 }
                    ]}>
                    <Svg viewBox="0 0 24 24" width={60} height={60}>
                        <Path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                            fill={'#e0e0e0'} />
                    </Svg>
                </Pressable>
            }
        </View >
    )
}
/*
make a stack effect, like each image offset X and Y by index+5px, and shadowing
*/
const styles = StyleSheet.create({
    deck_container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image_wrapper: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    background_card: {
        backgroundColor: '#e0e0e0',
        // opacity: 0.9,
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    arrows: {
        width: 60,
        height: 60,
        position: 'absolute',
        top: '50%',
    },
    card_image: {
        resizeMode: 'cover',
        // contentFit: 'cover',
        position: 'absolute',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
        borderColor: 'black', borderWidth: 1,
        // ...imageStyle.image_dimensions
        height: 300,
        width: 220,
    },
    flip_button: {
        borderColor: 'white',
        borderRadius: 50,
        borderWidth: 1,
        maxWidth: 80,
        maxHeight: 78,
        width: '22%',
        height: '15%',
        zIndex: 10,
        backgroundColor: 'black',
        bottom: '-10%',
        position: 'absolute'
    },
})

export default ImageDeck