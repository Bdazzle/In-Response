import { StyleSheet, Text, View, LayoutChangeEvent, Pressable } from 'react-native';
import React, { useContext, useEffect, useReducer} from 'react';
import Svg, { Path } from 'react-native-svg'
import { PlayerContext, PlayerContextProps } from '../PlayerContext'
import { GameContext, GameContextProps } from '../GameContext'
import { TextActionParams, textSizeReducer, TextSizes } from '../reducers/textStyles';
import IncrementingCounter from './counters/IncrementCounter'
import StaticCounterContainer from './counters/StaticCounter';
import { ColorTheme, CountersProps, DungeonData } from '..';
import CommanderDamage from "./CommanderDamageTracker"
import { RootStackParamList } from '../navigation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { lifeTotalScaler, textScaler } from '../functions/textScaler';
import { OptionsContext, OptionsContextProps } from '../OptionsContext';

interface PlayerProps {
    playerName: string,
    theme: ColorTheme,
    playerID: number
}

/*
everything not in GameContext gets reset when navigating.
*/
export const Player: React.FC<PlayerProps> = ({ playerName, theme, playerID }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { dimensions, setDimensions, setPlayerName, setDungeonData,
        setDungeonComplete, setColorTheme, setPlayerID } = useContext(PlayerContext) as PlayerContextProps
    const { globalPlayerData, dispatchGlobalPlayerData, } = useContext(GameContext) as GameContextProps
    const { totalPlayers, gameType } = useContext(OptionsContext) as OptionsContextProps
    const [textSize, dispatchTextSize] = useReducer<(state: TextSizes, action: TextActionParams) => TextSizes>(textSizeReducer, {})

    useEffect(() => {
        setPlayerID(playerID)
    }, [playerID])

    useEffect(() => {
        setPlayerName(playerName)
    }, [playerName])

    useEffect(() => {
        setColorTheme(theme)
    }, [theme])

    useEffect(() => {
        setDungeonData(globalPlayerData[playerID].dungeonData as DungeonData)
    }, [globalPlayerData[playerID].dungeonData])

    useEffect(() => {
        setDungeonComplete(globalPlayerData[playerID].dungeonCompleted as boolean)
    }, [globalPlayerData[playerID].dungeonCompleted])

    useEffect(() => {
        if (dimensions.height > 0) {
            dispatchTextSize({
                playerNumber: totalPlayers,
                parentWidth: dimensions.width,
                parentHeight: dimensions.height,
                decimalPlaces: `${globalPlayerData[playerID].lifeTotal}`.length
            })
        }
    }, [dimensions.height])

    const handleLifeChange = (val: number) => {
        dispatchGlobalPlayerData({
            playerID: playerID,
            field: 'lifeTotal',
            value: val
        })
    }

    /* 
    dimensions get set to 0 when navigating between screens?
    keep check here so any components referencing it won't break
    */
    const getDimensions = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout
        if (width !== 0 && height !== 0) {
            setDimensions({ width: width, height: height })
        }
    }

    const toCounters = () => {
        navigation.navigate("Counters", {
            playerID: playerID as number,
        } as CountersProps)
    }

    return (
        <View testID='player_container'
            style={[styles.player_container, {
                backgroundColor: theme.primary,
                borderRadius: 15,
            }]}
            onLayout={(e) => getDimensions(e)}>
            {/* Commander Damage tracker */}
            {gameType === 'commander' &&
                <View testID='commander_damage_tracker'
                    style={styles.commander_damage_tracker} >
                    <CommanderDamage playerID={playerID} />
                </View>
            }

            <View testID='life_and_static_container'
                style={styles.life_and_static_container}>
                <StaticCounterContainer colorTheme={theme} />

                {/* 
                Life Total container
                */}
                <View testID='life_total_container'
                    style={styles.life_total_container}>

                    {/* Background life buttons */}
                    <View
                        testID='background_increment_wrapper'
                        style={styles.background_increment_wrapper}>
                        <Pressable
                            testID='background_plus'
                            style={({ pressed }) => [
                               {
                                // backgroundColor: pressed ? theme.primary : '#00000000',
                                opacity: pressed ? .5 : 1,
                               },
                               styles.background_plus
                            ]}
                            onPress={() => handleLifeChange(globalPlayerData[playerID].lifeTotal + 1)}
                            onLongPress={() => handleLifeChange(globalPlayerData[playerID].lifeTotal + 10)}
                        >
                            <View style={{
                                height: '40%'
                            }}>
                                <Svg testID='plus icon' viewBox='0 0 700 700'
                                    style={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                >
                                    <Path d="M459.319,229.668c0,22.201-17.992,40.193-40.205,40.193H269.85v149.271c0,22.207-17.998,40.199-40.196,40.193   c-11.101,0-21.149-4.492-28.416-11.763c-7.276-7.281-11.774-17.324-11.769-28.419l-0.006-149.288H40.181   c-11.094,0-21.134-4.492-28.416-11.774c-7.264-7.264-11.759-17.312-11.759-28.413C0,207.471,17.992,189.475,40.202,189.475h149.267   V40.202C189.469,17.998,207.471,0,229.671,0c22.192,0.006,40.178,17.986,40.19,40.187v149.288h149.282   C441.339,189.487,459.308,207.471,459.319,229.668z"
                                        fill={theme.secondary}
                                    />
                                </Svg>
                            </View>
                        </Pressable>
                        <Pressable
                            testID='background_minus'
                            style={({ pressed }) => [
                                {
                                 // backgroundColor: pressed ? theme.primary : '#00000000',
                                 opacity: pressed ? .5 : 1,
                                },
                                styles.background_minus
                             ]}
                            onPress={() => handleLifeChange(globalPlayerData[playerID].lifeTotal - 1)}
                            onLongPress={() => handleLifeChange(globalPlayerData[playerID].lifeTotal - 10)}
                            // delayLongPress={100}
                        >
                            <View style={{
                                height: '40%'
                            }}>
                                <Svg viewBox='0 -20 75 75'
                                    style={{
                                        height: '100%',
                                        width: '100%'

                                    }}
                                >
                                    <Path d="M52.161,26.081c0,3.246-2.63,5.875-5.875,5.875H5.875C2.63,31.956,0,29.327,0,26.081l0,0c0-3.245,2.63-5.875,5.875-5.875   h40.411C49.531,20.206,52.161,22.835,52.161,26.081L52.161,26.081z"
                                        fill={theme.secondary}
                                    />
                                </Svg>
                            </View>
                        </Pressable>
                    </View>

                    {/* Life Total */}
                    <View testID='life_total_text_container' style={styles.life_total_text_container}>
                        <Text testID='life_total'
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles.life_total, {
                                fontSize: lifeTotalScaler(totalPlayers, globalPlayerData[playerID].lifeTotal),
                                color: theme.secondary,
                            }]}>
                            {globalPlayerData[playerID].lifeTotal}
                        </Text>
                    </View>
                    {/* Player name */}
                    <View testID='playername_text_container'
                        style={styles.player_name_container}
                    >
                        <Text style={[styles.player_name,
                        {
                            fontSize: textSize[playerID] && textSize[playerID].name,
                            color: theme.secondary,
                        }]} >{playerName}
                        </Text>
                    </View>


                </View>
            </View>

            <View style={styles.increment_counters_container}>
                <Pressable
                    testID='counter_pressable'
                    style={styles.counter_pressable}
                    onPress={() => toCounters()}
                >
                    <Text 
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                        color: theme.secondary,
                        fontSize: textScaler(14, dimensions.width),
                        fontFamily:'Beleren',
                        textAlign:'center'
                    }}>Counters</Text>
                </Pressable>
                { 
                    Object.keys(globalPlayerData[playerID].counterData!).sort().map(c => {
                        return <IncrementingCounter
                            key={c}
                            counterType={c}
                            colorTheme={theme}
                            playerID={playerID}
                        />
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    player_container: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
    },
    life_and_static_container: {
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },
    life_total_container: {
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '100%'
    },
    life_total_text_container:{
        width: '60%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    life_total: {
        color: 'black',
        textAlign: 'center',
        width: '100%',
        // zIndex: -1,
    },
    player_name_container: {
        height: '15%',
        width: '100%',
        position: 'absolute',
        alignItems:'center',
    },
    player_name: {
        fontFamily: 'Beleren',
        height: '100%',
        textAlign: 'center',
    },
    life_button_container: {
        height: '70%',
        width: '10%',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '2%',
        top: '30%',
        zIndex: 10,
        position: 'absolute',
        left: '12%',
    },
    life_button: {
        height: '50%'
    },
    background_increment_wrapper: {
        height: '75%',
        position: 'absolute',
        width: '100%',
        zIndex: 10,
        alignItems: 'flex-end'
    },
    background_plus: {
        height: '50%',
        width: '100%',
        justifyContent: 'flex-start',
    },
    background_minus: {
        height: '50%',
        width: '100%',
        justifyContent: 'center',
    },
    increment_counters_container: {
        position: 'absolute',
        right: 0,
        justifyContent: 'space-between',
        height: '90%',
        width: '20%',
        marginTop: '2%'
    },
    counter_pressable:{
        width:'100%',
        height:'20%',
        justifyContent:'center'
    },
    commander_damage_tracker: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '70%',
        zIndex: 10,
        width: '20%'
    }
})