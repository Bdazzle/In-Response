import { Text, View, useWindowDimensions, StyleProp, ViewStyle, Dimensions, GestureResponderEvent, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';
import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Player } from '../components/Player'
// import { PlayerProvider } from '../PlayerContext';
import { GameContext, GameContextProps } from '../GameContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AllScreenNavProps } from '..';
import { OptionsContext, OptionsContextProps } from '../OptionsContext';
import Svg, { Path } from 'react-native-svg';
// import { iconData } from '../reducers/imageResources';
import DayNight from '../components/counters/DayNight';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import ResetModal from '../components/ResetModal';

interface Debounce<T> {
    (func: T, delay: number): (...args: any) => void
}

const screen = Dimensions.get("screen");
const window = Dimensions.get("window")
/*
PanResponder intercepts onPress and onLongPress events, making them not work in Animated.View children.
Fixable?
*/
export const Game = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const { totalPlayers, startingLife } = useContext(OptionsContext) as OptionsContextProps
    const { globalPlayerData, dispatchGlobalPlayerData, setCurrentMonarch, setCurrentInitiative } = useContext(GameContext) as GameContextProps
    const [swipeStart, setSwipeStart] = useState<number>()
    const [randomPlayer, setRandomPlayer] = useState<string | undefined>()
    const [activeCycle, setActiveCycle] = useState<string>("neutral")
    const randomPlayerScaleVal = useSharedValue(0)
    const randomPlayerZVal = useSharedValue(0)
    const resetModalScaleVal = useSharedValue(0)
    const resetModalZVal = useSharedValue(0)
    const designationMap = Object.keys(globalPlayerData).map(i => Number(i))
    const panActivationWidth = useRef(Math.round(Dimensions.get('window').width / 3))
    // const pan = useRef(new Animated.ValueXY()).current

    // const panResponder = useRef(PanResponder.create({
    //     // onMoveShouldSetPanResponder: () => true,
    //     onMoveShouldSetPanResponder: Platform.select({
    //         default: () => true,
    //         android: (e: GestureResponderEvent, state: PanResponderGestureState) => {
    //             console.log(state)
    //             return Math.abs(state.dx) > panActivationWidth.current || Math.abs(state.dy) > panActivationWidth.current
    //             // state.vx > 0

    //         }
    //     }),
    //     onPanResponderGrant: () => {
    //         pan.setOffset({
    //             x: (pan.x as any)._value,
    //             y: 0
    //         });
    //     },
    //     onPanResponderMove: Animated.event(
    //         [
    //             null,
    //             {
    //                 dx: pan.x,
    //                 dy: pan.y
    //             },
    //         ],
    //         { useNativeDriver: true }
    //     ),
    //     onPanResponderRelease: () => {
    //         if ((pan.x as any)._value > panActivationWidth.current || (pan.x as any)._value < -panActivationWidth.current) {
    //             navigation.navigate('GlobalMenu', {
    //                 screen: "MainMenu"
    //             })
    //         }
    //     },
    // })).current

    const debounce: Debounce<any> = (func: any, delay: number) => {
        let timeOutId: number;
        return (...args: any) => {
            if (timeOutId) clearTimeout(timeOutId)
            timeOutId = setTimeout(() => {
                func(...args)
            }, delay)
        }
    }

    const debounceSwipe = debounce(setSwipeStart, 100)

    const handleSwipe = (event: GestureResponderEvent) => {
        debounceSwipe(event.nativeEvent.pageX)
    }

    const swipeEnd = (input: number) => {
        if (swipeStart) {
            if (input - swipeStart > panActivationWidth.current || swipeStart - input > panActivationWidth.current) {
                navigation.navigate('GlobalMenu', {
                    screen: "MainMenu"
                })
            }
        }
        setSwipeStart(undefined)
    }

    const debounceSwipeEnd = debounce(swipeEnd, 100)

    const handleSwipeEnd = (event: GestureResponderEvent) => {
        debounceSwipeEnd(event.nativeEvent.pageX)
    }

    /* Random Player Functions */
    const getRandomPlayer = () => {
        const random = Math.ceil(Math.random() * totalPlayers)
        setRandomPlayer(globalPlayerData[random].screenName)
        randomPlayerScaleVal.value = 5
        randomPlayerZVal.value = 10
    }

    const hideRandomPlayer = () => {
        setRandomPlayer(undefined)
        randomPlayerScaleVal.value = 0
        randomPlayerZVal.value = 0
    }

    const scaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(randomPlayerScaleVal.value, {
                        duration: 100,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    })
                }
            ],
            zIndex: withTiming(randomPlayerZVal.value, {
                duration: 100,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
        }
    })

    /*
    Reset button functions
    */
    const showResetModal = () => {
        resetModalScaleVal.value = 5
        resetModalZVal.value = 10
    }

    const hideResetModal = () => {
        resetModalScaleVal.value = 0
        resetModalZVal.value = 0
    }
    /* 
    reset need to change life totals/commander damage to starting,
    set dungeons and static/incrementing counters to 0,
    hide reset confirmation modal
    */
    const handleReset = () => {
        let newPlayerData = globalPlayerData
        for (let playerID in newPlayerData) {
            newPlayerData[playerID].lifeTotal = startingLife;
            newPlayerData[playerID].counterData = {}
            for (let otherPlayer in newPlayerData[playerID].commander_damage) {
                newPlayerData[playerID].commander_damage[otherPlayer] = 0
            }
            if (newPlayerData[playerID].dungeonCompleted) {
                delete newPlayerData[playerID].dungeonCompleted
            }
            if (newPlayerData[playerID].dungeonData) {
                delete newPlayerData[playerID].dungeonData
            }
            if (newPlayerData[playerID].citysBlessing) {
                delete newPlayerData[playerID].citysBlessing
            }
        }

        setCurrentMonarch(undefined)
        setCurrentInitiative(undefined)
        setActiveCycle('neutral')

        dispatchGlobalPlayerData({
            field: 'init',
            value: newPlayerData,
            playerID: 0
        })

        hideResetModal()
    }

    const resetModalStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(resetModalScaleVal.value, {
                        duration: 100,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    })
                }
            ],
            zIndex: withTiming(resetModalZVal.value, {
                duration: 100,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
        }
    })

    return (
        <View
            onTouchStart={(e) => handleSwipe(e)}
            onTouchEnd={(e) => handleSwipeEnd(e)}
            testID='game_container' style={styles.game_container}>

            <View testID='middle_buttons'
                style={{
                    zIndex: 10,
                    position: 'absolute',
                    height: '5%',
                    width: totalPlayers === 1 ? window.width / 2 : window.width,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    top: totalPlayers === 1 ? 0 : totalPlayers === 3 ? (window.height - 38) * .65 : (window.height - 38) / 2,
                    transform: totalPlayers === 1 ? [
                        { rotate: '90deg' },
                        { translateX: window.width / 4 },
                        { translateY: window.width / 5 }
                    ]
                        : [],
                }}
            >
                {/* Reset button */}
                <View testID='reset_button'
                    style={[styles.icon_button, styles.button_background]}
                >
                    <Pressable
                        onPress={() => showResetModal()}
                    >
                        <Svg viewBox='0 0 25 25'>
                            <Path d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9"
                                stroke={"#000"}
                            ></Path>
                        </Svg>
                    </Pressable>
                </View>


                {/* Day/night Cycle button */}
                <View testID='cycle_icon_container'
                    style={styles.icon_button}
                >
                    <DayNight activeCycle={activeCycle} setActiveCycle={setActiveCycle} />
                </View>

                {/* Random Player button */}
                <View testID='random_button'
                    style={[styles.icon_button, styles.button_background]}
                >
                    <Pressable onPress={() => getRandomPlayer()}>
                        <Svg viewBox='0 0 358 358' >
                            <Path d="M179.006,0C80.141,0,0,80.141,0,179.006s80.141,179.006,179.006,179.006   s179.006-80.141,179.006-179.006S277.871,0,179.006,0z M277.668,281.04l-8.437-8.437l33.587-33.588l-79.091-0.376v-0.018   c-1.545,0-3.031-0.603-4.141-1.671l-51.411-49.65l-51.405,49.65c-1.116,1.074-2.602,1.671-4.147,1.671H41.022v-11.934h69.192   L159.59,179l-49.376-47.687H41.022v-11.934h71.602c1.545,0,3.031,0.603,4.147,1.677l51.405,49.65l51.411-49.65   c1.116-1.074,2.602-1.677,4.141-1.677h25.389v0.137l53.642,0.257l-34.363-34.369l8.437-8.437l48.797,48.797l-47.962,47.962   l-8.437-8.437l33.588-33.588l-76.704-0.364L176.768,179l49.376,47.687h22.972v0.137l53.642,0.257l-34.363-34.369l8.437-8.437   l48.797,48.797L277.668,281.04z"
                                fill={"#010002"}
                            ></Path>
                        </Svg>
                    </Pressable>
                </View>
            </View>

            {/* Random Player Modal */}
            <Animated.View testID='random_player_modal'
                style={[styles.modal, scaleStyle]}
            >
                <Pressable style={[styles.random_modal_pressable]}
                    onPress={() => hideRandomPlayer()}>
                    <Text style={[styles.modal_text]}>{randomPlayer} Selected</Text>
                </Pressable>
            </Animated.View>

            {/* Reset Modal */}
            <Animated.View testID='confirm_reset'
                style={[styles.reset_modal, resetModalStyle]}
            >
                <ResetModal accept={() => handleReset()} decline={() => hideResetModal()} />
            </Animated.View>

            {
                totalPlayers === 1 ? <Oneplayer playerIDs={designationMap} />
                    :
                    totalPlayers === 2 ? <TwoPlayerScreen playerIDs={designationMap}
                        p1style={{
                            transform: [{ rotate: "180deg" }],
                            height: '50%'
                        }}
                        p2style={{ height: '50%' }}
                        containerStyle={{
                            height: '100%',
                            transform: [{ rotate: "180deg" }],
                        }} />
                        :
                        totalPlayers === 3 ? <Threeplayer playerIDs={designationMap} />
                            :
                            totalPlayers === 4 ? <Fourplayer playerIDs={designationMap} />
                                :
                                undefined
            }
        </View>
    )
}

interface GameParams {
    playerIDs: number[];
}

const Oneplayer: React.FC<GameParams> = ({ playerIDs }) => {
    const { height, width } = useWindowDimensions()
    const { globalPlayerData } = useContext(GameContext) as GameContextProps

    return (
        <View testID='player_provider_wrapper'
            style={styles.player_provider_wrapper}>
            {Object.keys(globalPlayerData).length > 0 ?
                // <PlayerProvider >
                <View testID='player_wrapper'
                    style={[styles.player_wrapper, {
                        height: width,
                        width: height,
                    }]}>

                    <Player key={`Player 1`}
                        playerName={globalPlayerData[playerIDs[0]].screenName}
                        theme={globalPlayerData[playerIDs[0]].colors}
                        playerID={playerIDs[0]}
                    />
                </View>
                // </PlayerProvider>

                : <></>
            }
        </View>
    )
}

const Twoplayer: React.FC<TwoPlayerParams> = ({ playerIDs, p1style, p2style, containerStyle }) => {
    const { globalPlayerData } = useContext(GameContext) as GameContextProps

    return (
        <>
            {Object.keys(globalPlayerData).length &&
                <View testID={`${playerIDs[1]} pair_container`} style={[containerStyle, {
                    overflow: 'hidden'
                }]}>

                    <View testID='player_provider_wrapper'
                        style={styles.player_provider_wrapper}
                    >
                        {/* <PlayerProvider> */}
                        <View testID='player_wrapper' style={[p1style, styles.player_wrapper_2p]}>

                            <Player
                                playerName={globalPlayerData[playerIDs[0]].screenName}
                                theme={globalPlayerData[playerIDs[0]].colors}
                                playerID={playerIDs[0]}
                            />
                        </View>
                        {/* </PlayerProvider> */}
                    </View>

                    <View testID='player_provider_wrapper'
                        style={styles.player_provider_wrapper}
                    >
                        {/* <PlayerProvider> */}
                        <View testID='player_wrapper'
                            style={[p2style, styles.player_wrapper_2p]}>

                            <Player
                                playerName={globalPlayerData[playerIDs[1]].screenName}
                                theme={globalPlayerData[playerIDs[1]].colors}
                                playerID={playerIDs[1]}
                            />
                        </View>
                        {/* </PlayerProvider> */}
                    </View>
                </View>
            }
        </>
    )
}

interface TwoPlayerParams extends GameParams {
    p1style: StyleProp<ViewStyle>;
    p2style: StyleProp<ViewStyle>;
    containerStyle: StyleProp<ViewStyle>;
}

const TwoPlayerScreen: React.FC<TwoPlayerParams> = ({ playerIDs, p1style, p2style, containerStyle }) => {
    const { globalPlayerData } = useContext(GameContext) as GameContextProps

    return (
        <>
            {Object.keys(globalPlayerData).length > 0 ?
                <View style={[containerStyle, {
                    overflow: 'hidden'
                }]}>
                    <View testID='player_provider_wrapper'
                        style={styles.player_provider_wrapper}
                    >
                        {/* <PlayerProvider> */}
                        <View testID='p_wrapper_2p_screen'
                            style={[p1style, styles.p_wrapper_2p_screen]}>
                            <Player
                                playerName={globalPlayerData[playerIDs[0]].screenName}
                                theme={globalPlayerData[playerIDs[0]].colors}
                                playerID={playerIDs[0]}
                            />
                        </View>
                        {/* </PlayerProvider> */}
                    </View>

                    <View testID='player_provider_wrapper'
                        style={styles.player_provider_wrapper}
                    >
                        {/* <PlayerProvider> */}
                        <View testID='p_wrapper_2p_screen'
                            style={[p2style, styles.p_wrapper_2p_screen]}>
                            <Player
                                playerName={globalPlayerData[playerIDs[1]].screenName}
                                theme={globalPlayerData[playerIDs[1]].colors}
                                playerID={playerIDs[1]}
                            />
                        </View>
                        {/* </PlayerProvider> */}
                    </View>
                </View>
                : <></>
            }
        </>
    )
}



const Threeplayer: React.FC<GameParams> = ({ playerIDs }) => {
    const { globalPlayerData } = useContext(GameContext) as GameContextProps
    const { height, width } = useWindowDimensions()

    return (
        <View
            testID='threeplayer'
            style={styles.game_container}>
            {Object.keys(globalPlayerData).length > 0 ?
                <View style={styles.game_container} >
                    <Twoplayer playerIDs={playerIDs.slice(0, 2)}
                        p1style={{
                            backgroundColor: 'black',
                            height: width / 2,
                            width: height * .65,
                            transform: [
                                { rotate: '90deg' },
                            ]
                        }}
                        p2style={{
                            backgroundColor: 'black',
                            height: width / 2,
                            width: height * .65,
                            transform: [
                                { rotate: '270deg' },
                            ]
                        }}
                        containerStyle={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: height * .65,
                        }} />

                    {/* <PlayerProvider> */}
                    <View key="player_3" style={[styles.player_3, {
                        height: height / 3
                    }]}>
                        <Player key="Player 3"
                            playerName={globalPlayerData[playerIDs[2]].screenName}
                            theme={globalPlayerData[playerIDs[2]].colors}
                            playerID={playerIDs[2]}
                        />
                    </View>
                    {/* </PlayerProvider> */}
                </View>
                : <></>
            }
        </View>
    )
}

const Fourplayer: React.FC<GameParams> = ({ playerIDs }) => {
    const { globalPlayerData } = useContext(GameContext) as GameContextProps
    const { height, width } = useWindowDimensions()

    return (
        <>
            {Object.keys(globalPlayerData).length > 0 ?
                <View testID='players_container'
                    style={styles.players_container} >

                    <Twoplayer playerIDs={playerIDs.slice(0, 2)}
                        p1style={{
                            transform: [
                                { rotate: '90deg' },
                            ],
                            height: width / 2,
                            width: height / 2
                        }}
                        p2style={{
                            transform: [
                                { rotate: '90deg' },
                            ],
                            height: width / 2,
                            width: height / 2
                        }}
                        containerStyle={{
                            width: '50%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }} />

                    <Twoplayer playerIDs={playerIDs.slice(2)}
                        p1style={{
                            transform: [
                                { rotate: '270deg' },
                            ],
                            height: width / 2,
                            width: height / 2
                        }}
                        p2style={{
                            transform: [
                                { rotate: '270deg' },
                            ],
                            height: width / 2,
                            width: height / 2
                        }}
                        containerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '50%',
                            height: '100%',
                        }} />
                </View>
                : <></>
            }
        </>
    )
}

const styles = StyleSheet.create({
    game_container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
    },
    player_provider_wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    player_wrapper: {
        backgroundColor: 'black',
        transform: [
            { rotate: '90deg' },
        ]
    },
    players_container: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        backgroundColor: 'black'
    },
    player_3: {
        backgroundColor: 'black',
        width: '100%',
        borderRadius: 5,
        borderColor: 'black',
    },
    player_wrapper_2p: {
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
    },
    p_wrapper_2p_screen: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
    },
    modal: {
        position: 'absolute',
        backgroundColor: 'black',
        top: '25%',
        right: '40%',
        width: '17%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white'
    },
    modal_text: {
        color: "white",
        fontSize: 14,
        fontFamily: "Beleren",
        textAlign: 'center',
    },
    random_modal_pressable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    reset_modal: {
        position: 'absolute',
        backgroundColor: 'black',
        top: '30%',
        right: '40%',
        width: '17%',
        height: '7%',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white'
    },
    icon_button: {
        height: 38,
        width: 38,
    },
    button_background: {
        backgroundColor: 'white',
        borderRadius: 50
    },
})