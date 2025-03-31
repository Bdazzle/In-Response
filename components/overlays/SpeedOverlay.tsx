import { useContext, useEffect, useState } from "react"
import { GameContext } from "../../GameContext"
import { useRoute, RouteProp } from "@react-navigation/native"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { RootStackParamList } from "../../navigation"
import { ImageSourcePropType, Pressable, StyleSheet, View, Image } from "react-native"
import FlipCard from "../Flipcard"
import { OptionsContext, OptionsContextProps } from "../../OptionsContext"

let phoneStyles : any, tabletStyles : any;

/*
instead of having 2 StyleSheet.create() functions execute on any device for tablet/phone styles,
this should only execute creation of one stylesheet dependent on devicetype
*/
const getPhoneStyles = () =>{
    if(!phoneStyles) {
        phoneStyles = {
            overlay_container: {
                position: 'absolute',
                top: '18%',
                zIndex: 1,
            },
            speed_overlay_wrapper: {
                left: '30%',
                width: '40%',
                height: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            },
            level1: {
                height: '100%'
            },
            level2: {
                height: '90%',
                top: '-10%',
            },
            level3: {
                height: '100%',
                top: '-29%',
            },
        }
    }
    return phoneStyles
}

const getTabletStyles = () =>{
    if(!tabletStyles){
        tabletStyles = {
            overlay_container: {
                position: 'absolute',
                top: '12%',
                zIndex: 1,
            },
            speed_overlay_wrapper: {
                left: '33%',
                width: '33.5%',
                height: '44%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            },
            level1: {
                top:'13%',
                height: '100%',
                width: '100%',
            },
            level2: {
                left:'1.5%',
                height: '100%',
                top: '-6%',
            },
            level3: {
                left:'1.5%',
                height: '100%',
                top: '-21%',
            },
        }
    }
    return tabletStyles
}

const universalStyles = (devicetype : string) =>{
    const deviceStyles = devicetype === 'phone' ? getPhoneStyles() : getTabletStyles();

    const styles = StyleSheet.create({
        speed_container: {
            height: '100%',
            maxWidth: 690,//the width contained card image on tablet
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        levelImageWrapper: {
            height: '37%',
            width: '100%',
            backfaceVisibility: 'hidden',
        },
        visible_level_pressable: {
            height: '100%',
            width: '100%',
        },
        hidden_level: {
            opacity: 0.01,
            height: '100%',
            width: '100%',
        },
        levelImage: {
            height: '100%',
            width: '100%',
        },
        ...deviceStyles
    })

    return styles
}

interface SpeedProps {
    imageSource: {
        front: ImageSourcePropType,
        back: ImageSourcePropType
    }
}

const SpeedOverlay: React.FC<SpeedProps> = ({ imageSource }) => {
    const { globalPlayerData, dispatchGlobalPlayerData } = useContext(GameContext)
    const { deviceType } = useContext<OptionsContextProps>(OptionsContext)
    const [level, setLevel] = useState<number | null>()
    const route = useRoute<RouteProp<RootStackParamList, 'Card'>>()
    const [showLevels, setShowLevels] = useState<boolean>(true)
    const flipVal = useSharedValue(0)
    const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number }>()
    const styles = universalStyles(deviceType)

    const levelChange = (num: number) => {
        // for clicking on same level to make level go down, deselect level if highlighted
        const newlevel = level === num ? num - 1 : num
        setLevel(newlevel)
        dispatchGlobalPlayerData({
            playerID: route.params.playerID as number,
            field: 'speed',
            value: newlevel as number
        })
    }

    useEffect(() => {
        if (globalPlayerData[route.params.playerID as number].speed) {
            setLevel(globalPlayerData[route.params.playerID as number].speed)
        }
        if(globalPlayerData[route.params.playerID as number].speed === 4){
            setShowLevels(false)
            flipVal.value = 1
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
        if(level === 3){
            levelChange(4)
        }
    }

    return (
        <View testID="speed_container"
            style={styles.speed_container}
        >
            <FlipCard
                front={imageSource.front}
                back={imageSource.back}
                onFlip={flipCard}
                altBack={'Max Speed'}
                altFront={`Speed levels 1 through 3`}
                onLayout={setImageDimensions}
                initialFlipVal={globalPlayerData[route.params.playerID as number].speed === 4 ? 1 : 0}
            />
            {showLevels &&
                <View nativeID="overlay_container"
                    style={[frontAnimatedStyle, styles.overlay_container, {
                        width: imageDimensions?.width,
                        height: imageDimensions?.height,
                    }]}>
                        <View testID='speed_overlay_wrapper'
                            style={[styles.speed_overlay_wrapper]}
                        >

                            <Animated.View
                                style={[frontAnimatedStyle, styles.levelImageWrapper]}
                            >
                                <Pressable testID="level1"
                                    focusable={true}
                                    accessibilityRole="button"
                                    onPress={() => levelChange(1)}
                                    style={[level! >= 1 ? styles.visible_level_pressable : styles.hidden_level,
                                    styles.level1]}
                                    accessibilityLabel={level! >= 1 ? "active speed level 1" : 'speed level 1'}
                                    accessibilityState={level! >= 1 ? {checked: true} : {checked: false}}
                                >
                                    <Image
                                        source={require('../../assets/cards/speed_overlay/lvl_1.png')}
                                        style={styles.levelImage}
                                    />
                                </Pressable>
                            </Animated.View>

                            <Animated.View
                                style={[frontAnimatedStyle, styles.levelImageWrapper]}
                            >
                                <Pressable testID="level2"
                                    focusable={true}
                                    accessibilityRole="button"
                                    onPress={() => levelChange(2)}
                                    style={[level! >= 2 ? styles.visible_level_pressable : styles.hidden_level,
                                    styles.level2]}
                                    accessibilityLabel={level! >= 2 ? "active speed level 2" : 'speed level 2'}
                                    accessibilityState={level! >= 2 ? {checked: true} : {checked: false}}
                                >
                                    <Image
                                        source={require('../../assets/cards/speed_overlay/lvl_2.png')}
                                        style={styles.levelImage}
                                    />
                                </Pressable>
                            </Animated.View>

                            <Animated.View 
                                style={[frontAnimatedStyle, styles.levelImageWrapper]}
                            >
                                <Pressable testID="level3"
                                    focusable={true}
                                    accessibilityRole="button"
                                    onPress={() => levelChange(3)}
                                    style={[level! >= 3 ? styles.visible_level_pressable : styles.hidden_level,
                                    styles.level3]}
                                    accessibilityLabel={level! >= 3 ? "active speed level 3" : 'speed level 3'}
                                    accessibilityState={level! >= 3 ? {checked: true} : {checked: false}}
                                >
                                    <Image
                                        source={require('../../assets/cards/speed_overlay/lvl_3.png')}
                                        style={styles.levelImage}
                                    />
                                </Pressable>
                            </Animated.View>

                        </View>
                </View>
            }
        </View>
    )
}

export default SpeedOverlay