import { StyleSheet, Text, View, LayoutChangeEvent, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Svg, { Path } from 'react-native-svg'
import { GameContext, GameContextProps } from '../GameContext'
import IncrementingCounter from './counters/IncrementCounter'
import StaticCounterContainer from './counters/StaticCounter';
import { ColorTheme, CountersProps, Dimensions } from '..';
import CommanderDamage from "./DamageTracker"
import { RootStackParamList } from '../navigation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { lifeTextScaler, RFPercentage, textScaler } from '../functions/textScaler';
import { OptionsContext, OptionsContextProps } from '../OptionsContext';
import useLuminance from '../hooks/useLuminance'
import useContainerDimensions from '../hooks/useContainerDimensions';

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
    const { globalPlayerData, dispatchGlobalPlayerData, } = useContext(GameContext) as GameContextProps
    const { totalPlayers, gameType} = useContext(OptionsContext) as OptionsContextProps
    const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })
    const [scaleTracker, setScaleTracker] = useState<boolean>(false)
    const luminance = useLuminance(theme.secondary.slice(theme.secondary.indexOf('(') + 1, theme.secondary.lastIndexOf(',')).split(','))
    const [staticCounterDim, commanderDim] = useContainerDimensions(gameType, totalPlayers)
    const [lifeTextSize, setLifeTextSize] = useState<number>(40)
    const [counterText, setCounterText] = useState<number>(40)

    const handleLifeChange = (val: number): void => {
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

    const handleCDamageModal = () => {
        if (scaleTracker === true) {
            setScaleTracker(false)
        }
    }

    useEffect(()=>{
        setLifeTextSize(lifeTextScaler(totalPlayers, playerID, globalPlayerData[playerID].lifeTotal, dimensions))
        setCounterText(textScaler(8, dimensions))
    }, [dimensions])

    return (
        <Pressable testID={`${playerID}-player-container`}
            style={[styles.player_container,
            {
                backgroundColor: theme.primary,
            }
            ]}
            onLayout={(e) => getDimensions(e)}
            onPressIn={() => handleCDamageModal()}
        >
            {/* Commander Damage tracker */}
            {gameType === 'oathbreaker' || gameType === 'commander' ?
                <View testID='commander_damage_tracker'
                    style={[styles.commander_damage_tracker, commanderDim]} >
                    <CommanderDamage playerID={playerID}
                        scaleTracker={setScaleTracker}
                        showScale={scaleTracker}
                        gameType={gameType}
                    />
                </View>
                :
                <></>
            }

            <View testID='life_and_static_container'
                style={styles.life_and_static_container}>
                
                {/* Static counter/trackers */}
                    <View testID="static_counter_wrapper"
                        style={[styles.static_counter_wrapper, staticCounterDim
                        ]}
                    >
                        <StaticCounterContainer
                            playerID={playerID}
                            playerName={playerName}
                            colorTheme={theme}
                            dungeonCompleted={globalPlayerData[playerID].dungeonCompleted as boolean}
                        />
                    </View>

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
                            accessibilityLabel={`${playerName} Gain Life`}
                            accessibilityHint='Press to add, hold to add by 10'
                            style={
                                ({ pressed }) =>
                                    [
                                        {
                                            opacity: pressed ? .5 : 1,
                                        },
                                        styles.background_plus
                                    ]}
                            delayLongPress={300}
                            onPress={() => handleLifeChange(globalPlayerData[playerID].lifeTotal + 1)}
                            onLongPress={() => handleLifeChange(globalPlayerData[playerID].lifeTotal + 10)}
                        >
                            <View testID='life_icon_wrapper'
                                style={styles.life_icon_wrapper}>
                                <Svg testID='plus_icon'
                                    viewBox='0 0 700 700'
                                    height={'100%'}
                                    width={'100%'}
                                >
                                    <Path d="M459.319,229.668c0,22.201-17.992,40.193-40.205,40.193H269.85v149.271c0,22.207-17.998,40.199-40.196,40.193   c-11.101,0-21.149-4.492-28.416-11.763c-7.276-7.281-11.774-17.324-11.769-28.419l-0.006-149.288H40.181   c-11.094,0-21.134-4.492-28.416-11.774c-7.264-7.264-11.759-17.312-11.759-28.413C0,207.471,17.992,189.475,40.202,189.475h149.267   V40.202C189.469,17.998,207.471,0,229.671,0c22.192,0.006,40.178,17.986,40.19,40.187v149.288h149.282   C441.339,189.487,459.308,207.471,459.319,229.668z"
                                        fill={theme.secondary}
                                        stroke={luminance * 100 >= 50 ? 'black' : 'white'}
                                        strokeWidth={10}
                                    />
                                </Svg>
                            </View>
                        </Pressable>
                        <Pressable
                            accessibilityLabel={`${playerName} lose Life`}
                            accessibilityHint='Press to subtract, hold to subtract by 10'
                            testID='background_minus'
                            style={({ pressed }) => [
                                {
                                    opacity: pressed ? .5 : 1,
                                },
                                styles.background_minus
                            ]}
                            onPress={() => handleLifeChange(globalPlayerData[playerID].lifeTotal - 1)}
                            onLongPress={() => handleLifeChange(globalPlayerData[playerID].lifeTotal - 10)}
                            delayLongPress={300}
                        >
                            <View style={styles.life_icon_wrapper}>
                                <Svg viewBox='0 -20 75 75'
                                    height={'100%'}
                                    width={'100%'}
                                >
                                    <Path d="M52.161,26.081c0,3.246-2.63,5.875-5.875,5.875H5.875C2.63,31.956,0,29.327,0,26.081l0,0c0-3.245,2.63-5.875,5.875-5.875   h40.411C49.531,20.206,52.161,22.835,52.161,26.081L52.161,26.081z"
                                        fill={theme.secondary}
                                        stroke={luminance * 100 >= 50 ? 'black' : 'white'}
                                        strokeWidth={1}
                                    />
                                </Svg>
                            </View>
                        </Pressable>
                    </View>

                    {/* Life Total */}
                    <View testID='life_total_text_container' style={styles.life_total_text_container}>
                        <Text testID='life_total'
                            accessibilityLabel={`${playerName} ${globalPlayerData[playerID].lifeTotal} life`}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles.life_total, {
                                fontSize: lifeTextSize > 0 ? lifeTextSize : 180,
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
                            fontSize: totalPlayers === 3 && playerID !== 3 ? RFPercentage(3.2) : totalPlayers === 2 ? RFPercentage(8)  : RFPercentage(4),
                            color: theme.secondary,
                        }]} >
                            {playerName}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.increment_counters_container}>
                <Pressable
                    testID='counter_pressable'
                    style={({ pressed }) => [
                        styles.counter_pressable,
                        { backgroundColor: pressed ? 'grey' : theme.secondary }
                    ]}
                    onPressIn={() => toCounters()}
                >
                    <Text testID='counter_pressable_text'
                        accessibilityLabel={`${playerName} Counters`}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        style={[styles.counter_pressable_text, {
                            color: theme.primary,
                            fontSize: counterText > 0 ? counterText : 23
                        }]}>Counters</Text>
                </Pressable>
                <View testID='counter_icons_container'
                    style={styles.counter_icons_container}
                >
                    {
                        Object.keys(globalPlayerData[playerID].counterData!).sort().map(c => {
                            return <IncrementingCounter
                                key={c}
                                counterType={c}
                                colorTheme={theme}
                                playerID={playerID}
                                parentDimensions={dimensions}
                            />
                        })
                    }
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    player_container: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        borderRadius: 15,
    },
    life_and_static_container: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },
    static_counter_wrapper: {
        height: '25%',
        position: 'absolute',
    },
    life_total_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '100%',
        width: '100%',
    },
    life_total_text_container: {
        width: '60%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    life_total: {
        fontFamily: 'Beleren',
        textAlign: 'center',
        width: '100%',
    },
    player_name_container: {
        height: '15%',
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
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
        position: 'absolute',
        left: '12%',
    },
    life_button: {
        height: '50%'
    },
    background_increment_wrapper: {
        height: '75%',
        position: 'absolute',
        width: '60%',
        zIndex: 5,
        alignItems: 'flex-end',
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
    life_icon_wrapper: {
        height: '40%',
    },
    increment_counters_container: {
        position: 'absolute',
        right: 0,
        height: '100%',
        width: '20%',
    },
    counter_pressable: {
        marginTop: 5,
        width: '100%',
        height: '15%',
        justifyContent: 'center',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 10,
    },
    counter_pressable_text: {
        fontFamily: 'Beleren',
        textAlign: 'center',
    },
    counter_icons_container: {
        height: '100%',
        width: '100%'
    },
    commander_damage_tracker: {
        position: 'absolute',
        left: 0,
        bottom: 5,
        zIndex: 9,
        width: '20%',
    }
})