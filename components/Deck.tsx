import { useCallback, useEffect, useRef, useState } from "react"
import { Animated, PanResponder, StyleProp, StyleSheet, TextStyle, View, ViewStyle, Text, Pressable } from "react-native"
import Svg, { Path } from "react-native-svg"

interface DeckProps {
    cards: React.ReactElement[],
    containerStyle: StyleProp<ViewStyle>,
    stackSize: number,
    imageWidth: number,
    imageHeight: number,
    captions?: string[],
    captionStyles?: StyleProp<TextStyle>
    captionContainerStyle?: StyleProp<ViewStyle>
}

/**
 * @param param0 
 * @returns
 */
const ImageDeck: React.FC<DeckProps> = ({ cards, containerStyle, stackSize = 3, imageWidth = 220, imageHeight = 300, captions, captionStyles, captionContainerStyle }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const pan = useRef<Animated.ValueXY>(new Animated.ValueXY()).current
    const cardOpacity = useRef(new Animated.Value(1)).current; //optional
    const currentCard: React.ReactElement = cards[currentIndex]
    const [swipeThreshold, setSwipeThreshold] = useState<number>(0)
    const swipeOutDuration: number = 300
    const [swipeDirection, setSwipeDirection] = useState<string | null>()
    const lastCard: boolean = currentIndex >= cards.length - 1

    useEffect(() =>{
        setCurrentIndex(0)
    },[cards])

    useEffect(() => {
        setSwipeThreshold(imageWidth * .3)
    }, [imageWidth])

    const resetPos = useCallback(() => {
        pan.setValue({ x: 0, y: 0 });
        cardOpacity.setValue(1);
        setSwipeDirection(null)
    }, [])

    const moveCard = useCallback((direction: string, velocity: { vx: number, vy: number }) => {

        let xDestination = 0;
        let yDestination = 0;

        //switch statement instead of if because it requires breaks
        switch (direction) {
            case 'right':
                // positive X
                setSwipeDirection('horizontal')
                xDestination = imageWidth * 1.5
                yDestination = velocity ? velocity.vy * .5 : 0
                break;
            case 'left':
                //negative X
                setSwipeDirection('horizontal')
                xDestination = -imageWidth * 1.5
                yDestination = velocity ? velocity.vy * .5 : 0
                break;
            case 'top':
                //negative Y
                setSwipeDirection('vertical')
                xDestination = 0
                yDestination = -imageWidth * 1.5
                break;
            case 'bottom':
                // positive Y
                setSwipeDirection('vertical')
                xDestination = 0
                yDestination = imageWidth * 1.5
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
                setCurrentIndex(prevIndex => prevIndex + 1)
            }

            resetPos();
        })
    }, [currentCard, resetPos])

    /**
     * dx/y - accumulated distance of the gesture since the touch started
     * vx/y - velocity of gesture.
     * moveX/Y - the latest screen coordinates of the recently-moved touch
     * Left swipes means -x values, means index goes up.
     * Right swipes means +x values, means index goes down.
     */
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponder: () => !lastCard,
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

    const throwCard = (direction: string) => {
        moveCard(direction, { vx: 1, vy: -0.5 })
    }


    /**
     * Background cards are a changing array instead of a static component, 
     * so create using a function instead of FC
     */
    const renderBGcards = () => {
        const bgcards: React.ReactElement[] = []
        //next card + however many borders I want to be seen
        const remainingCards = cards.slice(currentIndex + 1, currentIndex + 1 + stackSize)

        remainingCards.forEach((card, i) => {
            //offsets for bg card positioning
            const translateY = (i + 1) * 7
            const translateX = (i + 1) * 7

            bgcards.push(
                <Animated.View key={`bgcard_${i}`}
                    style={[styles.background_card,
                    {
                        transform: [
                            { translateY: -translateY },
                            { translateX: translateX }
                        ],
                        zIndex: -i,
                        backgroundColor: 'green'
                    }
                    ]}
                >
                    {card}
                </Animated.View>
            )
        })
        return bgcards
    }

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
                {
                    renderBGcards()
                }
                <Animated.View {...panResponder.panHandlers}
                    style={[styles.image_wrapper, {
                        transform: [
                            { translateX: pan.x },
                            { translateY: pan.y },
                            swipeDirection === 'vertical' ?
                                {
                                    rotate: pan.y.interpolate({
                                        inputRange: [-100, 0, 100],
                                        outputRange: ['-400deg', '0deg', '400deg'],
                                        extrapolate: 'clamp'
                                    })
                                }
                                :
                                {
                                    rotate: pan.x.interpolate({
                                        inputRange: [-200, 0, 200],
                                        outputRange: ['-400deg', '0deg', '400deg'],
                                        extrapolate: 'clamp'
                                    })
                                }
                        ],
                        width: imageWidth
                    }]}
                >
                    {currentCard}

                </Animated.View>
                {captions &&
                    <View style={captionContainerStyle || styles.text_wrapper}>
                        <Text style={captionStyles || styles.captionText}>
                            {captions[currentIndex]}
                        </Text>
                    </View>
                }
            </View>
            {cards.length > 1 &&
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
        </View>
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
        opacity: 0.9,
    },
    arrows: {
        width: 60,
        height: 60,
        position: 'absolute',
        top: '50%',
    },
    text_wrapper: {
        width: '100%',
        position: 'relative',
        // alignItems:'flex-start'
        // borderColor: 'green', borderWidth: 2,
    },
    captionText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Beleren',
        textAlign: 'center',
        // borderColor: 'green', borderWidth: 2,
    }
})

export default ImageDeck