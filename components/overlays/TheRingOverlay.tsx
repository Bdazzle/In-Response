
import React, { useContext, useEffect, useState } from "react"
import { Image, View, StyleSheet, Pressable, ImageSourcePropType } from "react-native"
import { OptionsContext } from "../../OptionsContext"
import FlipCard from "../counters/Flipcard"
import { GameContext } from "../../GameContext"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../navigation"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

interface RingProps {
    imageSource: {
        front: ImageSourcePropType,
        back: ImageSourcePropType
    }
}

const TheRing: React.FC<RingProps> = ({ imageSource }) => {
    const { globalPlayerData, dispatchGlobalPlayerData } = useContext(GameContext)
    const { deviceType } = useContext(OptionsContext)
    const [level, setLevel] = useState<number>(0)
    const route = useRoute<RouteProp<RootStackParamList, 'Card'>>()
    const [showLevels, setShowLevels] = useState<boolean>(true)
    const flipVal = useSharedValue(0)

    const levelChange = (num: number) => {
        level === num ? setLevel(num - 1) : setLevel(num)
        dispatchGlobalPlayerData({
            playerID: route.params.playerID as number,
            field: 'the ring',
            value: level
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
        <View testID="ring_overlay_container"
            style={styles().ring_container}
        >
            <FlipCard front={imageSource.front} back={imageSource.back} onFlip={flipCard} />
            {showLevels &&
                <View testID='ring_overlay_wrapper'
                    style={deviceType === 'tablet' ?
                        styles().tablet_ring_overlay_wrapper :
                        styles().ring_overlay_wrapper}
                >
                    <Pressable testID="level1"
                        onPress={() => levelChange(1)}
                        style={[level >= 1 ? styles().visible_level : styles().hidden_level,
                        styles(deviceType).level1]}
                    >
                        <Animated.View
                            style={[frontAnimatedStyle, styles().levelImageWrapper]}
                        >
                            <Image
                                source={require('../../assets/cards/ring_overlay/level1.png')}
                                style={styles().levelImage}
                            />
                        </Animated.View>
                    </Pressable>

                    <Pressable testID="level2"
                        onPress={() => levelChange(2)}
                        style={[level >= 2 ? styles().visible_level : styles().hidden_level,
                        styles(deviceType).level2]}
                    >
                        <Animated.View
                            style={[frontAnimatedStyle, styles().levelImageWrapper]}
                        >
                            <Image
                                source={require('../../assets/cards/ring_overlay/level2.png')}
                                style={styles().levelImage}
                            />
                        </Animated.View>
                    </Pressable>

                    <Pressable testID="level3"
                        onPress={() => levelChange(3)}
                        style={[level >= 3 ? styles().visible_level : styles().hidden_level,
                        styles(deviceType).level3]}
                    >
                        <Animated.View
                            style={[frontAnimatedStyle, styles().levelImageWrapper]}
                        >
                            <Image
                                source={require('../../assets/cards/ring_overlay/level3.png')}
                                style={styles().levelImage}
                            />
                        </Animated.View>
                    </Pressable>

                    <Pressable testID="level4"
                        onPress={() => levelChange(4)}
                        style={[level === 4 ? styles().visible_level : styles().hidden_level,
                        styles(deviceType).level4]}
                    >
                        <Animated.View
                            style={[frontAnimatedStyle, styles().levelImageWrapper]}
                        >
                            <Image
                                source={require('../../assets/cards/ring_overlay/level4.png')}
                                style={styles().levelImage}
                            />
                        </Animated.View>
                    </Pressable>
                </View>
            }
        </View>
    )
}

const styles = (deviceType?: string) => StyleSheet.create({
    ring_container: {
        height: '75%',
        maxWidth: 690,//the width contained card image on tablet
        width: '100%',
        justifyContent: 'center',
    },
    tablet_ring_container: {
        aspectRatio: .75
    },
    tablet_ring_overlay_wrapper: {
        position: 'absolute',
        left: '9%',
        width: '82%',
        height: '51%',
        bottom: '6%',
        alignItems: 'center',
    },
    ring_overlay_wrapper: {
        position: 'absolute',
        left: '8%',
        width: '84%',
        height: '51%',
        bottom: '8%',
        alignItems: 'center',
    },
    visible_level: {
        color: 'black',
        justifyContent: 'center',
        width: '100%'
    },
    hidden_level: {
        opacity: 0,
        width: '100%',
    },
    level1: {
        height: deviceType === 'tablet' ? '19%' : '17%',
    },
    level2: {
        height: deviceType === 'tablet' ? '20%' : '19%',
    },
    level3: {
        height: deviceType === 'tablet' ? '26%' : '24%',
    },
    level4: {
        height: deviceType === 'tablet' ? '24%' : '21%',
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

export default TheRing