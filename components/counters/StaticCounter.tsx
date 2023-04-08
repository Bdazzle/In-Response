import React, { useContext, useEffect, useState } from 'react';
import { LayoutChangeEvent, View, StyleSheet, Pressable } from 'react-native';
import Animated, { Easing, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GameContext, GameContextProps } from '../../GameContext';
import Svg, { Path } from 'react-native-svg'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import { CounterCardProps, DungeonData } from '../..';

interface StaticCounterProps {
    colorTheme: {
        primary: string,
        secondary: string
    },
    playerName: string,
    playerID: number,
    dungeonCompleted: boolean,
}

const staticCounterList = ['dungeon', 'blessing', 'initiative', 'monarch']

const StaticCounterContainer: React.FC<StaticCounterProps> = ({ dungeonCompleted, playerName, playerID, colorTheme }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { currentMonarch, setCurrentMonarch, currentInitiative, setCurrentInitiative, globalPlayerData, dispatchGlobalPlayerData } = useContext(GameContext) as GameContextProps
    const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number }>()

    const scales: { [key: string]: SharedValue<number> } = {
        blessing: useSharedValue(.5),
        monarch: useSharedValue(.5),
        initiative: useSharedValue(.5)
    }

    const getImageDimensions = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout
        setImageDimensions({ width: width, height: height })
    }

    const blessingScaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(
                        scales.blessing.value
                        , {
                            duration: 30,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        })
                }
            ]
        }
    })

    const initiativeScaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(
                        scales.initiative.value
                        , {
                            duration: 30,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        }),
                }
            ],
        }
    })

    const monarchScaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(
                        scales.monarch.value
                        , {
                            duration: 30,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        })
                }
            ]
        }
    })

    const activateCitysBlessing = () => {
        dispatchGlobalPlayerData({
            playerID: playerID,
            field: `city's blessing`,
            value: !globalPlayerData[playerID].citysBlessing
        })
    }

    /*
    scale change has to be taken out of onPress function so that it triggers when reset button is pressed
    */
    useEffect(() => {
        scales.blessing.value = globalPlayerData[playerID].citysBlessing === true ? 1 : .5
    }, [globalPlayerData[playerID].citysBlessing])

    const activeInitiative = () => {
        currentInitiative !== playerName ? setCurrentInitiative(playerName) : setCurrentInitiative('')
    }

    const activateMonarch = () => {
        currentMonarch !== playerName ? setCurrentMonarch(playerName) : setCurrentMonarch('')
    }

    useEffect(() => {
        scales.initiative.value = currentInitiative === playerName ? 1 : .5;
        scales.monarch.value = currentMonarch === playerName ? 1 : .5;
    }, [currentInitiative, currentMonarch])

    const showDungeon = () => {
        navigation.navigate('Dungeon', {
            playerID: playerID,
            currentDungeon: globalPlayerData[playerID as number].dungeonData?.currentDungeon,
            dungeonCoords: globalPlayerData[playerID as number].dungeonData?.dungeonCoords,
        } as DungeonData)
    }

    /*
    if card is small, make card big (and centered)
    if card is big, make card small
    */
    const cardLongPress = (counterType: string) => {
        navigation.navigate("Card", {
            playerID: playerID as number,
            card: counterType
        } as CounterCardProps)
    }

    return (
        <View testID='static_counter_container' style={styles.static_counter_container}>

            {/* Dungeon */}
            <Pressable style={dungeonCompleted ? styles.dungeon_complete_touch : styles.dungeon_icon_touch}
                onPress={() => showDungeon()}
                testID="dungeon"
            >
                {
                    dungeonCompleted &&
                    <Svg viewBox='-2 -10 15 30' width={32} height={32} >
                        <Path d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27   c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0   L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                            fill={colorTheme.primary === 'rgba(0,0,0,1)' ? 'white' : 'rgba(0,0,0,1)'} />
                    </Svg>
                }
                {/* Dungeon symbol */}
                <Svg viewBox='0 0 524 524' width={30} height={30} style={{
                    marginLeft: dungeonCompleted ? 0 : 10,
                }}>
                    <Path d="M128.73 195.32l-82.81-51.76c-8.04-5.02-18.99-2.17-22.93 6.45A254.19 254.19 0 0 0 .54 239.28C-.05 248.37 7.59 256 16.69 256h97.13c7.96 0 14.08-6.25 15.01-14.16 1.09-9.33 3.24-18.33 6.24-26.94 2.56-7.34.25-15.46-6.34-19.58zM319.03 8C298.86 2.82 277.77 0 256 0s-42.86 2.82-63.03 8c-9.17 2.35-13.91 12.6-10.39 21.39l37.47 104.03A16.003 16.003 0 0 0 235.1 144h41.8c6.75 0 12.77-4.23 15.05-10.58l37.47-104.03c3.52-8.79-1.22-19.03-10.39-21.39zM112 288H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm0 128H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm77.31-283.67l-36.32-90.8c-3.53-8.83-14.13-12.99-22.42-8.31a257.308 257.308 0 0 0-71.61 59.89c-6.06 7.32-3.85 18.48 4.22 23.52l82.93 51.83c6.51 4.07 14.66 2.62 20.11-2.79 5.18-5.15 10.79-9.85 16.79-14.05 6.28-4.41 9.15-12.17 6.3-19.29zM398.18 256h97.13c9.1 0 16.74-7.63 16.15-16.72a254.135 254.135 0 0 0-22.45-89.27c-3.94-8.62-14.89-11.47-22.93-6.45l-82.81 51.76c-6.59 4.12-8.9 12.24-6.34 19.58 3.01 8.61 5.15 17.62 6.24 26.94.93 7.91 7.05 14.16 15.01 14.16zm54.85-162.89a257.308 257.308 0 0 0-71.61-59.89c-8.28-4.68-18.88-.52-22.42 8.31l-36.32 90.8c-2.85 7.12.02 14.88 6.3 19.28 6 4.2 11.61 8.9 16.79 14.05 5.44 5.41 13.6 6.86 20.11 2.79l82.93-51.83c8.07-5.03 10.29-16.19 4.22-23.51zM496 288h-96c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm0 128h-96c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zM240 177.62V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V177.62c-5.23-.89-10.52-1.62-16-1.62s-10.77.73-16 1.62zm-64 41.51V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V189.36c-12.78 7.45-23.84 17.47-32 29.77zm128-29.77V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V219.13c-8.16-12.3-19.22-22.32-32-29.77z"
                        fill={
                            dungeonCompleted ?
                                (colorTheme.primary === 'rgba(0,0,0,1)' ? 'white' : 'rgba(0,0,0,1)')
                                :
                                colorTheme.secondary
                        }
                    />
                </Svg>
            </Pressable>

            {/* City's Blessing */}
            <Animated.View testID={"blessing"}
                style={styles.card_container}>
                <Pressable
                    style={globalPlayerData[playerID].citysBlessing === true ? styles.active_card_overlay : [styles.card_overlay, {
                        width: imageDimensions && imageDimensions.height * .75,
                        transform: [
                            { scale: globalPlayerData[playerID].citysBlessing === true ? 1 : .5 }
                        ]
                    }]}
                    onPress={() => activateCitysBlessing()}
                    onLongPress={() => cardLongPress("blessing")}
                    testID={"blessing_pressable"}
                />
                <Animated.Image source={require('../../assets/cards/citys-blessing.png')}
                    style={[
                        styles.counter_card,
                        blessingScaleStyle,
                        imageDimensions && {
                            width: imageDimensions.height * .75,
                        }
                    ]}
                    onLayout={(e) => getImageDimensions(e)}
                />
            </Animated.View>

            {/* Initiative */}
            <Animated.View testID={"initiative"}
                style={styles.card_container}>
                <Pressable
                    style={[currentInitiative === playerName ? styles.active_card_overlay : styles.card_overlay,
                    {
                        width: imageDimensions && imageDimensions.height * .75,
                        transform: [
                            { scale: currentInitiative === playerName ? 1 : .5 }
                        ]
                    }
                    ]}
                    onPress={() => activeInitiative()}
                    onLongPress={() => cardLongPress("initiative")}
                    testID={"initiative_pressable"}
                />
                <Animated.Image source={require('../../assets/cards/initiative.png')}
                    style={[styles.counter_card,
                        initiativeScaleStyle,
                    imageDimensions && {
                        width: imageDimensions.height * .75
                    }
                    ]}
                />
            </Animated.View>

            {/* Monarch */}
            <Animated.View testID={"monarch"}
                style={styles.card_container}>
                <Pressable
                    style={[currentMonarch === playerName ? styles.active_card_overlay : styles.card_overlay,
                    {
                        width: imageDimensions && imageDimensions.height * .75,
                        transform: [
                            { scale: currentMonarch === playerName ? 1 : .5 }
                        ]
                    }
                    ]}
                    onPress={() => activateMonarch()}
                    onLongPress={() => cardLongPress("monarch")}
                    testID={"monarch_pressable"}
                />
                <Animated.Image source={require('../../assets/cards/monarch.png')}
                    style={[styles.counter_card,
                        monarchScaleStyle,
                    imageDimensions && {
                        width: imageDimensions.height * .75
                    }
                    ]}
                />
            </Animated.View>
        </View >

    )
}

const styles = StyleSheet.create({
    /*
    container dimensions should be the height of a scaled up card,
    scaled up = 1.5. original height = 20% = 30% total height
    */
    static_counter_container: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        paddingTop: '1%',
    },
    dungeon_complete_touch: {
        flexDirection: 'row',
        height: '100%',
        width: `${100 / staticCounterList.length}%`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dungeon_icon_touch: {
        flexDirection: 'row',
        height: '100%',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card_container: {
        height: '100%',
        width: `${100 / staticCounterList.length}%`,
        alignItems: 'center',
    },
    active_card_overlay: {
        backgroundColor: 'rgba(200, 200, 200, 0)',
        height: '100%',
        width: '100%',
        position: 'absolute',
        borderRadius: 5,
        zIndex: 1,
    },
    card_overlay: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(200, 200, 200, 0.4)',
        borderRadius: 5,
        zIndex: 1,
    },
    counter_card: {
        height: '100%',
        width: '100%',
        resizeMode: 'stretch',
    },

})

export default StaticCounterContainer