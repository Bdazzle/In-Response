import { View, useWindowDimensions, StyleProp, ViewStyle, Animated, PanResponder, Dimensions, Pressable, GestureResponderEvent, PanResponderGestureState, Platform } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Player } from '../components/Player'
// import { PlayerProvider } from '../PlayerContext';
import { GameContext, GameContextProps } from '../GameContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AllScreenNavProps } from '..';
import { OptionsContext, OptionsContextProps } from '../OptionsContext';

export const Game = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const { totalPlayers } = useContext(OptionsContext) as OptionsContextProps
    const { globalPlayerData } = useContext(GameContext) as GameContextProps
    const [swipeStart, setSwipeStart] = useState<number>()
    const designationMap = Object.keys(globalPlayerData).map(i => Number(i))
    const panActivationWidth = useRef(Math.round(Dimensions.get('window').width / 3))
    const pan = useRef(new Animated.ValueXY()).current

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


    const handleSwipe = (event: GestureResponderEvent) => {
        setSwipeStart(event.nativeEvent.pageX)
    }

    const handleSwipeEnd = (event: GestureResponderEvent) => {
        if (swipeStart) {
            if (event.nativeEvent.pageX - swipeStart > panActivationWidth.current || swipeStart - event.nativeEvent.pageX > panActivationWidth.current) {
                navigation.navigate('GlobalMenu', {
                    screen: "MainMenu"
                })
            }
        }
    }

    return (
        <View
            onTouchStart={(e) => handleSwipe(e)}
            onTouchEnd={(e) => handleSwipeEnd(e)}
            testID='Game_container' style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'black',
            }}>
            {
                totalPlayers === 1 ? <Oneplayer playerIDs={designationMap} />
                    :
                    totalPlayers === 2 ? <TwoPlayerScreen playerIDs={designationMap}
                        p1style={{
                            transform: [{ rotate: "180deg" }],
                            height: '50%'
                        }}
                        p2style={{ height: '50%' }}
                        containerStyle={{ height: '100%' }} />
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
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {Object.keys(globalPlayerData).length > 0 ?
                // <PlayerProvider >
                <View testID='player_wrapper'
                    style={{
                        backgroundColor: 'black',
                        height: width,
                        width: height,
                        transform: [
                            { rotate: '90deg' },
                        ]
                    }}>

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
                <View nativeID={`${playerIDs[1]} pair_container`} style={[containerStyle, {
                    overflow: 'hidden'
                }]}>

                    <View testID='player_provider_wrapper'
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        {/* <PlayerProvider> */}
                        <View testID='player_wrapper' style={[p1style, {
                            borderRadius: 5,
                            borderColor: 'black',
                            borderWidth: 2,
                        }]}>

                            <Player
                                playerName={globalPlayerData[playerIDs[0]].screenName}
                                theme={globalPlayerData[playerIDs[0]].colors}
                                playerID={playerIDs[0]}
                            />
                        </View>
                        {/* </PlayerProvider> */}
                    </View>

                    <View testID='player_provider_wrapper'
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        {/* <PlayerProvider> */}
                        <View testID='player_wrapper'
                            style={[p2style, {
                                borderRadius: 5,
                                borderColor: 'black',
                                borderWidth: 2,
                            }]}>

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
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        {/* <PlayerProvider> */}
                        <View testID='player_wrapper'
                            style={[p1style, {
                                width: '100%',
                                height: '100%',
                                borderRadius: 5,
                                borderColor: 'black',
                                borderWidth: 2,
                            }]}>
                            <Player
                                playerName={globalPlayerData[playerIDs[0]].screenName}
                                theme={globalPlayerData[playerIDs[0]].colors}
                                playerID={playerIDs[0]}
                            />
                        </View>
                        {/* </PlayerProvider> */}
                    </View>

                    <View testID='player_provider_wrapper'
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        {/* <PlayerProvider> */}
                        <View testID='player_wrapper'
                            style={[p2style, {
                                width: '100%',
                                height: '100%',
                                borderRadius: 5,
                                borderColor: 'black',
                                borderWidth: 2,
                            }]}>
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
            nativeID='Threeplayer'
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'black'
            }}>
            {Object.keys(globalPlayerData).length > 0 ?
                <View style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'black'
                }} >

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
                    <View key="player 3" style={{
                        backgroundColor: 'black',
                        height: height / 3,
                        width: '100%',
                        borderRadius: 5,
                        borderColor: 'black',
                    }}>
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
                <View nativeID='players container'
                    style={{
                        flexDirection: 'row',
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'black'
                    }} >

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