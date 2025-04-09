import React, { useContext, useEffect, useReducer } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Easing, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GameContext, GameContextProps } from '../../GameContext';
import Svg, { Path } from 'react-native-svg'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import { CounterCardProps, DungeonData } from '../..';
import { imageAction, imageReducer, ImageReducerState } from '../../reducers/imageResources';
import { trackers } from '../../constants/CounterTypes';

interface StaticCounterProps {
    colorTheme: {
        primary: string,
        secondary: string
    },
    playerName: string,
    playerID: number,
    dungeonCompleted: boolean,
}

interface TrackerButtonProps {
    playerID: number;
    cardLongPress: (counterType: string) => void;
}

const DungeonButton: React.FC<{ playerID: number }> = ({ playerID }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { globalPlayerData } = useContext(GameContext) as GameContextProps;
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            Svg: undefined
        })
    const playerName = globalPlayerData[playerID].screenName;
    const colorTheme = globalPlayerData[playerID].colors;
    const dungeonCompleted = globalPlayerData[playerID].dungeonCompleted

    const showDungeon = () => {
        navigation.navigate('Dungeon', {
            playerID: playerID,
            currentDungeon: globalPlayerData[playerID as number].dungeonData?.currentDungeon,
            dungeonCoords: globalPlayerData[playerID as number].dungeonData?.dungeonCoords,
        } as DungeonData)
    }

    useEffect(() => {
        dispatchResources({
            card: 'dungeon',
            dungeonCompleted: dungeonCompleted,
            colorTheme: colorTheme,
            svgDimension:{ width:'60%', height:'100%'}
        })
    }, [globalPlayerData[playerID].dungeonCompleted])

    return (
        <>
            <Pressable style={dungeonCompleted ? styles.dungeon_complete_touch : styles.dungeon_icon_touch}
                onPress={() => showDungeon()}
                testID="dungeon"
                accessibilityLabel={dungeonCompleted ? `${playerName} Dungeon Completed` : `${playerName} Venture into the Dungeon`}
                accessibilityRole="button"
            >
                {
                    dungeonCompleted &&
                    <Svg viewBox='2 -10 15 30'
                        style={styles.dungeonCheck}
                        accessibilityLabel="dungeon icon"
                    >
                        <Path d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27   c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0   L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                            fill={colorTheme.primary === 'rgba(0,0,0,1)' ? 'white' : 'rgba(0,0,0,1)'} />
                    </Svg>
                }
                    {resources.Svg}
            </Pressable>
        </>
    )
}

const RingButton: React.FC<TrackerButtonProps> = ({ playerID, cardLongPress }) => {
    const { globalPlayerData } = useContext(GameContext) as GameContextProps;
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            Svg: undefined
        })
    const playerName = globalPlayerData[playerID].screenName;

    useEffect(() => {
        dispatchResources({ card: 'the ring' })
    }, [])

    return (
        <>
            <View style={styles.card_container}>
                <Pressable testID='the_ring'
                    accessibilityLabel={`The Ring ${playerName}`}
                    onPress={() => cardLongPress('the ring')}
                    style={styles.card_overlay}
                    accessibilityRole="button"
                >
                    {resources.Svg}
                </Pressable>
            </View>
        </>
    )
}

const InitiativeButton: React.FC<TrackerButtonProps> = ({ playerID, cardLongPress }) => {
    const { globalPlayerData, currentInitiative, setCurrentInitiative } = useContext(GameContext) as GameContextProps;
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            Svg: undefined
        })
    const playerName = globalPlayerData[playerID].screenName;

    const activeInitiative = () => {
        //set current initiative to player or string instead of undefined to be identified as !undefined in other components
        currentInitiative !== playerName ? setCurrentInitiative(playerName) : setCurrentInitiative('')
    }

    const scale: SharedValue<number> = useSharedValue(.5)

    const initiativeScaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(
                        scale.value
                        , {
                            duration: 50,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        }),
                }
            ],
        }
    })

    useEffect(() => {
        scale.value = currentInitiative === playerName ? 1 : .5;
        dispatchResources({
            card: 'initiative',
            scale: initiativeScaleStyle,
            fills: [globalPlayerData[playerID].colors.primary === "rgba(0,0,0,1)" ? 'white' : currentInitiative === playerName ? 'black' : globalPlayerData[playerID].colors.secondary,
            currentInitiative === playerName ? "url(#SVGID_1_)" : globalPlayerData[playerID].colors.primary]
        })
    }, [currentInitiative])

    return (
        <View testID={"initiative"}
            style={styles.card_container}>
            <Pressable
                accessibilityLabel={currentInitiative === playerName ? `${playerName} has the Initiative` : `initiative to ${playerName}`}
                style={styles.card_overlay}
                onPress={() => activeInitiative()}
                onLongPress={() => cardLongPress("initiative")}
                testID={"initiative_pressable"}
                accessibilityRole="button"
            />
            {resources.Svg}
        </View>
    )
}

const MonarchButton: React.FC<TrackerButtonProps> = ({ playerID, cardLongPress }) => {
    const { globalPlayerData, currentMonarch, setCurrentMonarch } = useContext(GameContext) as GameContextProps
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            Svg: undefined
        })
    const playerName = globalPlayerData[playerID].screenName

    const activateMonarch = () => {
        currentMonarch !== playerName ? setCurrentMonarch(playerName) : setCurrentMonarch('')
    }

    const scale: SharedValue<number> = useSharedValue(.5)

    const monarchScaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(
                        scale.value
                        , {
                            duration: 50,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        })
                }
            ]
        }
    })

    useEffect(() => {
        scale.value = currentMonarch === playerName ? 1 : .5;
        dispatchResources({
            card: 'monarch',
            scale: monarchScaleStyle,
            fills: [globalPlayerData[playerID].colors.secondary,
            currentMonarch === playerName ? "url(#gradient-0)" : globalPlayerData[playerID].colors.secondary,
            currentMonarch === playerName ? "url(#gradient-0)" : globalPlayerData[playerID].colors.secondary]
        })
    }, [currentMonarch])

    return (
        < View testID={"monarch"}
            style={styles.card_container} >
            <Pressable
                accessibilityLabel={currentMonarch === playerName ? `${playerName} is the Monarch` : `Monarch to ${playerName}`}
                style={styles.card_overlay}
                onPress={() => activateMonarch()}
                onLongPress={() => cardLongPress("monarch")}
                testID={"monarch_pressable"}
                accessibilityRole="button"
            />
            {resources.Svg}
        </View >
    )
}

const SpeedButton: React.FC<TrackerButtonProps> = ({ playerID, cardLongPress }) => {
    const { globalPlayerData } = useContext(GameContext) as GameContextProps;
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            Svg: undefined
        })
    const playerName = globalPlayerData[playerID].screenName;

    useEffect(() => {
        dispatchResources({ card: 'speed' })
    }, [])

    useEffect(() => {
        if (globalPlayerData[playerID].speed === 4) {
            dispatchResources({ card: 'speed', colorTheme: { primary: 'green', secondary: 'green' } })
        }
    }, [globalPlayerData[playerID].speed])

    return (
        <View style={styles.card_container}>
            <Pressable testID='speed'
                accessibilityLabel={`Speed for ${playerName}`}
                onPress={() => cardLongPress('speed')}
                style={styles.card_overlay}
                accessibilityRole="button"
            >
                {resources.Svg}
            </Pressable>
        </View>
    )
}

/*
Change each button into a reusable component?
*/
const StaticCounterContainer: React.FC<StaticCounterProps> = ({ dungeonCompleted, playerName, playerID, colorTheme }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { currentInitiative, currentMonarch, globalPlayerData } = useContext(GameContext) as GameContextProps

    const cardLongPress = (counterType: string) => {
        navigation.navigate("Card", {
            playerID: playerID as number,
            card: counterType
        } as CounterCardProps)
    }

    return (
        <View testID='static_counter_container' style={styles.static_counter_container}>

            {(globalPlayerData[playerID].dungeonData?.currentDungeon || globalPlayerData[playerID].dungeonCompleted || currentInitiative) &&
                <DungeonButton playerID={playerID} />
            }
            {globalPlayerData[playerID].theRing !== undefined &&
                <RingButton playerID={playerID} cardLongPress={cardLongPress} />
            }
            {currentInitiative !== undefined &&
                <InitiativeButton playerID={playerID} cardLongPress={cardLongPress} />
            }
            {currentMonarch !== undefined &&
                <MonarchButton playerID={playerID} cardLongPress={cardLongPress} />
            }
            {globalPlayerData[playerID].speed !== undefined &&
                <SpeedButton playerID={playerID} cardLongPress={cardLongPress} />
            }

        </View >
    )
}

const minHeight = 40;

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
        justifyContent: 'space-evenly',
    },
    dungeon_complete_touch: {
        flexDirection: 'row',
        height: '100%',
        width: '20%',
        minHeight: minHeight,
        alignItems: 'center',
        zIndex: 5,
    },
    dungeon_icon_touch: {
        flexDirection: 'row',
        height: '100%',
        width: '20%',
        minHeight: minHeight,
        alignItems: 'center',
        zIndex: 5,
    },
    dungeonCheck: {
        height: '50%',
        width: '40%',
        minHeight: 30
    },
    card_container: {
        height: '100%',
        width: `${100 / trackers.length}%`,
        minHeight: minHeight,
        justifyContent: 'center',
        alignItems: 'center',

    },
    card_overlay: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        zIndex: 1,
    },
})

export default StaticCounterContainer