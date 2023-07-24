import { View, useWindowDimensions, StyleProp, ViewStyle, Dimensions, Pressable, StyleSheet } from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import { Player } from '../components/Player'
import { GameContext, GameContextProps } from '../GameContext';
import { OptionsContext, OptionsContextProps } from '../OptionsContext';
import Svg, { Path } from 'react-native-svg';
import DayNight from '../components/counters/DayNight';
import AnimatedModal from '../components/modals/AnimatedModal';
import GlobalMenu from './GlobalMenu'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import shuffle from '../functions/shuffler';

const window = Dimensions.get("window")

/*
PanResponder intercepts onPress and onLongPress events, making them not work in Animated.View children.
*/
export const Game = () => {
    const { totalPlayers, startingLife, deviceType, simpleDisplay } = useContext(OptionsContext) as OptionsContextProps
    const { globalPlayerData, dispatchGlobalPlayerData, setCurrentMonarch, setCurrentInitiative, setReset } = useContext(GameContext) as GameContextProps
    const [randomPlayer, setRandomPlayer] = useState<string | undefined>()
    const [activeCycle, setActiveCycle] = useState<string>("neutral")
    const [resetModalVis, setResetModalVis] = useState<boolean>(false)
    const [randomPlayerModalVis, setRandomPlayerModalVis] = useState<boolean>(false)
    const designationMap = Object.keys(globalPlayerData).map(i => Number(i))
    const swipeRef = useRef<Swipeable>(null)

    /* Random Player Functions */
    //see if ppl notice difference between shuffler and Math random players
    const getRandomPlayer = () => {
        /*shuffled players */
        const playerNames = Object.keys(globalPlayerData).map((player) => {
            return globalPlayerData[Number(player)].screenName
        })
        const shuffledPlayers = shuffle(playerNames)
        setRandomPlayer(shuffledPlayers[0])

        /* standard randomized players */
        // const random = Math.ceil(Math.random() * totalPlayers)
        // setRandomPlayer(globalPlayerData[random].screenName)

        setRandomPlayerModalVis(true)
    }

    const hideRandomPlayer = () => {
        setRandomPlayerModalVis(false)
        setRandomPlayer(undefined)
    }

    const hideResetModal = () => {
        setResetModalVis(false)
    }
    
    /* 
    reset need to change life totals/commander damage to starting,
    set dungeons and static/incrementing counters to 0,
    hide reset confirmation modal
    */
    const handleReset = async () => {
        let newPlayerData = globalPlayerData
        for (let playerID in newPlayerData) {
            newPlayerData[playerID].lifeTotal = startingLife;
            newPlayerData[playerID].counterData = {}
            newPlayerData[playerID].commander_tax = 0
            for (let otherPlayer in newPlayerData[playerID].commander_damage) {
                newPlayerData[playerID].commander_damage[otherPlayer] = 0
            }
            if (newPlayerData[playerID].dungeonCompleted) {
                delete newPlayerData[playerID].dungeonCompleted
            }
            if (newPlayerData[playerID].dungeonData) {
                delete newPlayerData[playerID].dungeonData
            }
            if (newPlayerData[playerID].theRing) {
                delete newPlayerData[playerID].theRing
            }
        }

        setCurrentMonarch(undefined)
        setCurrentInitiative(undefined)
        setActiveCycle('neutral')

        /* 
        Implementing a reset boolean variable to each component (like for commander tax tracker)
        may cut down on updating cost during a game session because 
        each component could keep track of it's own data, instead of updating GameContext objects
        */
        async function resetData() {
            setReset(true)
            const testPromise = new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    dispatchGlobalPlayerData({
                        field: 'init',
                        value: newPlayerData,
                        playerID: 0
                    })
                    resolve()
                }, 100)
            })
            await testPromise
            setReset(false)
        }

        resetData()
        setResetModalVis(false)
    }

    const renderLeftActions = () => {
        return (
            <GlobalMenu />
        );
    };

    return (
        <GestureHandlerRootView>
            <Swipeable
                ref={swipeRef}
                leftThreshold={80}
                renderLeftActions={renderLeftActions}
            >
                <View
                    testID='game_container'
                    style={styles.game_container}
                >
                    <View testID='middle_buttons'
                        style={{
                            zIndex: 10,
                            position: 'absolute',
                            height: '5%',
                            width: totalPlayers === 1 ? window.width / 2 : window.width,
                            maxWidth: totalPlayers === 1 ? 350 : '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            top: totalPlayers === 1 ? 0 : totalPlayers === 3 ? (window.height - 38) * .65 : (window.height - 38) / 2,
                            transform: totalPlayers === 1 ? [
                                { rotate: '90deg' },
                                { translateX: window.width / 5 },
                                { translateY: window.width / 6 }
                            ]
                                :
                                deviceType === 'tablet' ? [
                                    { translateY: -7 }
                                ]
                                    : [],
                        }}
                    >
                        {/* Reset button */}
                        <View testID='reset_button'
                            style={[styles.button_background, {
                                height: deviceType === 'phone' ? 38 : 58,
                                width: deviceType === 'phone' ? 38 : 58,
                            }]}
                        >
                            <Pressable
                                onPress={() => setResetModalVis(true)}
                                accessibilityLabel="reset game"
                            >
                                <Svg viewBox='0 0 25 25'>
                                    <Path d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9"
                                        stroke={"#000"}
                                    ></Path>
                                </Svg>
                            </Pressable>
                        </View>


                        {/* Day/night Cycle button */}
                        {!simpleDisplay &&
                            <View testID='cycle_icon_container'
                                style={{
                                    height: deviceType === 'phone' ? 38 : 58,
                                    width: deviceType === 'phone' ? 38 : 58,
                                }}
                            >
                                <DayNight activeCycle={activeCycle} setActiveCycle={setActiveCycle} />
                            </View>
                        }

                        {/* Random Player button */}
                        <View testID='random_button'
                            style={[styles.button_background, {
                                height: deviceType === 'phone' ? 38 : 58,
                                width: deviceType === 'phone' ? 38 : 58,
                            }]}
                        >
                            <Pressable onPress={() => getRandomPlayer()}
                                accessibilityLabel="select random player"
                                style={{
                                    height: '100%',
                                    width: '100%'
                                }}
                            >
                                <Svg viewBox='0 0 358 358' >
                                    <Path d="M179.006,0C80.141,0,0,80.141,0,179.006s80.141,179.006,179.006,179.006   s179.006-80.141,179.006-179.006S277.871,0,179.006,0z M277.668,281.04l-8.437-8.437l33.587-33.588l-79.091-0.376v-0.018   c-1.545,0-3.031-0.603-4.141-1.671l-51.411-49.65l-51.405,49.65c-1.116,1.074-2.602,1.671-4.147,1.671H41.022v-11.934h69.192   L159.59,179l-49.376-47.687H41.022v-11.934h71.602c1.545,0,3.031,0.603,4.147,1.677l51.405,49.65l51.411-49.65   c1.116-1.074,2.602-1.677,4.141-1.677h25.389v0.137l53.642,0.257l-34.363-34.369l8.437-8.437l48.797,48.797l-47.962,47.962   l-8.437-8.437l33.588-33.588l-76.704-0.364L176.768,179l49.376,47.687h22.972v0.137l53.642,0.257l-34.363-34.369l8.437-8.437   l48.797,48.797L277.668,281.04z"
                                        fill={"#010002"}
                                    ></Path>
                                </Svg>
                            </Pressable>
                        </View>
                    </View>

                    {/* Random Player Modal */}
                    <AnimatedModal visible={randomPlayerModalVis} 
                    modalTitle={`${randomPlayer} Selected`} 
                    close={hideRandomPlayer}
                    />

                    {/* Reset Modal */}
                    {
                            <AnimatedModal 
                            close={() => hideResetModal()}
                            visible={resetModalVis} 
                            modalTitle={"Reset Game?"}
                            accept={() => handleReset()} 
                            decline={() => hideResetModal()} />
                    }
                    {
                        totalPlayers === 1 ? <Oneplayer playerIDs={designationMap} />
                            :
                            totalPlayers === 2 ? <TwoPlayerScreen playerIDs={designationMap}
                                p1style={{
                                    transform: [{ rotate: "180deg" }],
                                }}
                                p2style={{}}
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

            </Swipeable>
        </GestureHandlerRootView>
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

                        <View testID='player_wrapper' style={[p1style, styles.player_wrapper_2p]}>

                            <Player
                                playerName={globalPlayerData[playerIDs[0]].screenName}
                                theme={globalPlayerData[playerIDs[0]].colors}
                                playerID={playerIDs[0]}
                            />
                        </View>

                    </View>

                    <View testID='player_provider_wrapper'
                        style={styles.player_provider_wrapper}
                    >

                        <View testID='player_wrapper'
                            style={[p2style, styles.player_wrapper_2p]}>

                            <Player
                                playerName={globalPlayerData[playerIDs[1]].screenName}
                                theme={globalPlayerData[playerIDs[1]].colors}
                                playerID={playerIDs[1]}
                            />
                        </View>

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

                        <View testID='p_wrapper_2p_screen'
                            style={[p1style, styles.p_wrapper_2p_screen]}>
                            <Player
                                playerName={globalPlayerData[playerIDs[0]].screenName}
                                theme={globalPlayerData[playerIDs[0]].colors}
                                playerID={playerIDs[0]}
                            />
                        </View>

                    </View>

                    <View testID='player_provider_wrapper'
                        style={styles.player_provider_wrapper}
                    >

                        <View testID='p_wrapper_2p_screen'
                            style={[p2style, styles.p_wrapper_2p_screen]}>
                            <Player
                                playerName={globalPlayerData[playerIDs[1]].screenName}
                                theme={globalPlayerData[playerIDs[1]].colors}
                                playerID={playerIDs[1]}
                            />
                        </View>

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

                    <View key="player_3" style={[styles.player_3, {
                        height: height / 3
                    }]}>
                        <Player key="Player 3"
                            playerName={globalPlayerData[playerIDs[2]].screenName}
                            theme={globalPlayerData[playerIDs[2]].colors}
                            playerID={playerIDs[2]}
                        />
                    </View>

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

                    <Twoplayer
                        playerIDs={[1, 3]}
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

                    <Twoplayer
                        playerIDs={[2, 4]}
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
    button_background: {
        backgroundColor: 'white',
        borderRadius: 50
    },
})