
import React, { useContext, useEffect, useState } from "react"
import { Image, View, StyleSheet, Pressable, ImageSourcePropType } from "react-native"
import FlipCard from "../counters/Flipcard"
import { GameContext, GameContextProps } from "../../GameContext"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../navigation"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { OptionsContext, OptionsContextProps } from "../../OptionsContext"

let phoneStyles : any, tabletStyles : any;

const getPhoneStyles = () =>{
    if(!phoneStyles) {
        phoneStyles = StyleSheet.create({
            ring_container: {
                height: '100%',
                maxWidth: 690,//the width contained card image on tablet
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            },
            tablet_ring_container: {
                aspectRatio: .75
            },
            ring_overlay_wrapper: {
                left: '7.5%',
                width:'85%',
                height: '52.5%',
            },
            visible_level: {
                color: 'black',
                justifyContent: 'center',
                width: '100%',
            },
            hidden_level: {
                opacity: 0.01,
                width: '100%',
            },
            level1: {
                height:'17%',
            },
            level2: {
                height:'20%',
            },
            level3: {
                height:'25%',
            },
            level4: {
                height:'23%',
            },
            levelImageWrapper: {
                height: '100%',
                width: '100%',
                backfaceVisibility: 'hidden'
            },
            levelImage: {
                height: '100%',
                width: '100%',
            }
        })
    }
    return phoneStyles
}

const getTabletStyles = () =>{
    if(!tabletStyles){
        tabletStyles = StyleSheet.create({
            ring_container: {
                height: '100%',
                maxWidth: 690,//the width contained card image on tablet
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            },
            tablet_ring_container: {
                aspectRatio: .75
            },
            ring_overlay_wrapper: {
                height: '52.5%',
                left: '14.5%',
                width:'71%',
            },
            visible_level: {
                color: 'black',
                justifyContent: 'center',
                width: '100%',
            },
            hidden_level: {
                opacity: 0.01,
                width: '100%',
            },
            level1: {
                height:'15.5%'
            },
            level2: {
                height:'17%'
            },
            level3: {
                height:'21%'
            },
            level4: {
                height:'19%',
            },
            levelImageWrapper: {
                height: '100%',
                width: '100%',
                backfaceVisibility: 'hidden'
            },
            levelImage: {
                height: '100%',
                width: '100%',
            }
        })
    }
    return tabletStyles
}
/*
instead of having 2 StyleSheet.create() functions execute on any device for tablet/phone styles,
this should only execute creation of one stylesheet dependent on devicetype
*/

interface RingProps {
    imageSource: {
        front: ImageSourcePropType,
        back: ImageSourcePropType
    }
}

const ringRules = `The Ring tempts you. As the ring tempts you, you get an emblem named The Ring if you don't have one. 
Then your emblem gains its next ability and you choose a creature you control to become or remain your ring-bearer.
The Ring can tempt you even if you don't control a creature.
the ring gains its abilities in order from top to bottom. Once it gains an ability, it has that ability for the rest of the game.
Each time the ring tempts you, you must choose a creature if you control one.
Each player can have only one emblem named the ring and only one ring-bearer at a time.`

const TheRing: React.FC<RingProps> = ({ imageSource }) => {
    const { globalPlayerData, dispatchGlobalPlayerData } = useContext<GameContextProps>(GameContext)
    const { deviceType } = useContext<OptionsContextProps>(OptionsContext)
    const [level, setLevel] = useState<number | null>()
    const route = useRoute<RouteProp<RootStackParamList, 'Card'>>()
    const [showLevels, setShowLevels] = useState<boolean>(true)
    const flipVal = useSharedValue(0)
    const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number }>()
    const styles = deviceType === 'phone' ? getPhoneStyles() :  getTabletStyles()

    const levelChange = (num: number) => {
        // for clicking on same level to make level go down, deselect level if highlighted
        const newlevel = level === num ? num - 1 : num 
        setLevel(newlevel)
        dispatchGlobalPlayerData({
            playerID: route.params.playerID as number,
            field: 'the ring',
            value: newlevel as number
        })
    }

    useEffect(() => {
        if (globalPlayerData[route.params.playerID as number].theRing) {
            setLevel(globalPlayerData[route.params.playerID as number].theRing as number)
        }
    }, [])

    const frontAnimatedStyle = useAnimatedStyle(() => {
        /*Front card spins from 0 - 180 degrees*/
        const frontSpin = interpolate(flipVal.value, [0, 1], [0, 180])
        return {
            transform: [
                {
                    rotateY: withTiming(`${frontSpin}deg`, { duration: 200 })
                }
            ],
        }
    })

    const flipCard = () => {
        flipVal.value = flipVal.value ? 0 : 1
        setShowLevels(!showLevels)
    }

    return (
        <View testID="ring_container"
            style={styles.ring_container}
        >
            <FlipCard
                front={imageSource.front}
                back={imageSource.back}
                onFlip={flipCard}
                altBack={ringRules}
                altFront={`the Ring abilities`}
                onLayout={setImageDimensions}
            />
            {showLevels &&
                <View nativeID="overlay_container"
                    style={{
                        width: imageDimensions?.width,
                        height: imageDimensions?.height,
                        position:'absolute',
                        justifyContent:'flex-end',
                        
                    }}>
                    <View testID='ring_overlay_wrapper'
                        style={styles.ring_overlay_wrapper}
                    >
                        <Pressable testID="level1"
                            focusable={true}
                            accessibilityRole="button"
                            onPress={() => levelChange(1)}
                            style={[level! >= 1 ? styles.visible_level : styles.hidden_level,
                            styles.level1]}
                            accessibilityLabel={level! >= 1 ? "active level 1" : 'level 1'}
                            accessibilityHint="Your Ring-bearer is legendary and can't be blocked by creatures with greater power"
                        >
                            <Animated.View
                                style={[frontAnimatedStyle, styles.levelImageWrapper]}
                            >
                                <Image
                                    source={require('../../assets/cards/ring_overlay/level1.png')}
                                    style={styles.levelImage}
                                    alt={"Your Ring-bearer is legendary and can't be blocked by creatures with greater power"}
                                />
                            </Animated.View>
                        </Pressable>

                        <Pressable testID="level2"
                            focusable={true}
                            accessibilityRole="button"
                            onPress={() => levelChange(2)}
                            style={[level! >= 2 ? styles.visible_level : styles.hidden_level,
                            styles.level2]}
                            accessibilityLabel={level! >= 2 ? 'active level 2' : 'level 2'}
                            accessibilityHint="Whenever your ring-bearer attacks, draw a card, then discard a card."
                        >
                            <Animated.View
                                style={[frontAnimatedStyle, styles.levelImageWrapper]}
                            >
                                <Image
                                    source={require('../../assets/cards/ring_overlay/level2.png')}
                                    style={styles.levelImage}
                                    alt={"Whenever your ring-bearer attacks, draw a card, then discard a card."}
                                />
                            </Animated.View>
                        </Pressable>

                        <Pressable testID="level3"
                            focusable={true}
                            accessibilityRole="button"
                            onPress={() => levelChange(3)}
                            style={[level! >= 3 ? styles.visible_level : styles.hidden_level,
                            styles.level3]}
                            accessibilityLabel={level! >= 3 ? 'active level 3' : 'level 3'}
                            accessibilityHint="whenever your ring-bearer becomes blocked by a creature, that creature's controller sacrifices it at end of combat"
                        >
                            <Animated.View
                                style={[frontAnimatedStyle, styles.levelImageWrapper]}
                            >
                                <Image
                                    source={require('../../assets/cards/ring_overlay/level3.png')}
                                    style={styles.levelImage}
                                    alt={"whenever your ring-bearer becomes blocked by a creature, that creature's controller sacrifices it at end of combat"}
                                />
                            </Animated.View>
                        </Pressable>

                        <Pressable testID="level4"
                            focusable={true}
                            accessibilityRole="button"
                            onPress={() => levelChange(4)}
                            style={[level === 4 ? styles.visible_level : styles.hidden_level,
                            styles.level4]}
                            accessibilityLabel={level! >= 4 ? 'active level 4' : 'level 4'}
                            accessibilityHint="whenever your ring-bearer deals combat damage to a player, each opponent loses 3 life."
                        >
                            <Animated.View
                                style={[frontAnimatedStyle, styles.levelImageWrapper]}
                            >
                                <Image
                                    source={require('../../assets/cards/ring_overlay/level4.png')}
                                    style={styles.levelImage}
                                    alt={"whenever your ring-bearer deals combat damage to a player, each opponent loses 3 life."}
                                />
                            </Animated.View>
                        </Pressable>
                    </View>
                </View>
            }
        </View>
    )
}

export default TheRing