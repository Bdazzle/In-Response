import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Text, View, StyleSheet, Pressable, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';
import { GameContext, GameContextProps } from '../GameContext';
import { RootStackParamList } from '../navigation';
import { imageAction, imageReducer, ImageReducerState } from '../reducers/imageResources';
import { counters, trackers } from '../constants/CounterTypes';
import { CounterCardProps, DungeonData } from '..';
import { textScaler } from '../functions/textScaler';
import { OptionsContext, OptionsContextProps } from '../OptionsContext';
import useScreenRotation from '../hooks/useScreenRotation';
import getDimensions from '../functions/getComponentDimensions';

interface CounterRowProps {
    counterType: string
    changeCounters: (counterType: string, value: number) => void;
}

const CounterRow: React.FC<CounterRowProps> = ({ counterType, changeCounters }) => {
    const route = useRoute<RouteProp<RootStackParamList, 'Counters'>>()
    const { globalPlayerData } = useContext(GameContext) as GameContextProps
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            Svg: undefined
        })
    const [displayTotal, setDisplayTotal] = useState<number>()
    const [containerDimensions, setContainerDimensions] = useState<{ width: number, height: number }>({
        width: 200,
        height: 100
    });
    const [fontSize, setFontSize] = useState<number>(18)
    const [totalFontSize, setTotalFontsize] = useState<number>(18)

    useEffect(() => {
        dispatchResources({ card: counterType })
        globalPlayerData[route.params.playerID].counterData![counterType] ? setDisplayTotal(globalPlayerData[route.params.playerID].counterData![counterType]) : setDisplayTotal(0)
    }, [counterType])

    const changeTotal = (amount: number) => {
        const total = displayTotal as number

        if (total + amount <= 0) {
            changeCounters(counterType, 0)
            setDisplayTotal(0)
        } else {
            changeCounters(counterType, total + amount)
            setDisplayTotal(total + amount)
        }
    }

    useEffect(() => {
        globalPlayerData[route.params.playerID].counterData![counterType] && setDisplayTotal(globalPlayerData[route.params.playerID].counterData![counterType])
    }, [])

    useEffect(() => {
        if (containerDimensions.width !== 0 && containerDimensions.height !== 0) {
            setFontSize(textScaler(counterType.length,
                { ...containerDimensions, width: containerDimensions?.width / 3 },
                36,
                24));
            setTotalFontsize(textScaler(String(displayTotal).length, { ...containerDimensions, width: containerDimensions?.width / 3 },
                36,
                16))
        }
    }, [containerDimensions])

    return (
        <View testID='row_container'
            onLayout={(e) => getDimensions(e, setContainerDimensions)}
            style={styles.row_container}>

            {/* Plus */}
            <Pressable
                testID='plus'
                onPress={() => changeTotal(1)}
                onLongPress={() => changeTotal(10)}
                style={{
                    width: '20%',
                }}
                accessibilityLabel={`add ${counterType} counter`}
                accessibilityRole="button"
            >
                <Svg viewBox='0 0 550 550'
                    style={{
                        height: '100%',
                    }}
                >
                    <Path d="M491.841,156.427c-19.471-45.946-51.936-85.013-92.786-112.637C358.217,16.166,308.893-0.007,256,0    c-35.254-0.002-68.946,7.18-99.571,20.158C110.484,39.63,71.416,72.093,43.791,112.943C16.167,153.779-0.007,203.104,0,256    c-0.002,35.255,7.181,68.948,20.159,99.573c19.471,45.946,51.937,85.013,92.786,112.637C153.783,495.834,203.107,512.007,256,512    c35.253,0.002,68.946-7.18,99.571-20.158c45.945-19.471,85.013-51.935,112.638-92.785C495.834,358.22,512.007,308.894,512,256    C512.002,220.744,504.819,187.052,491.841,156.427z M460.413,342.257c-16.851,39.781-45.045,73.723-80.476,97.676    c-35.443,23.953-78.02,37.926-123.936,37.933c-30.619-0.002-59.729-6.218-86.255-17.454    c-39.781-16.851-73.724-45.044-97.677-80.475C48.114,344.495,34.14,301.917,34.133,256c0.002-30.62,6.219-59.731,17.454-86.257    c16.851-39.781,45.045-73.724,80.476-97.676C167.506,48.113,210.084,34.14,256,34.133c30.619,0.002,59.729,6.218,86.255,17.454    c39.781,16.85,73.724,45.044,97.677,80.475c23.953,35.443,37.927,78.02,37.934,123.939    C477.864,286.62,471.648,315.731,460.413,342.257z"
                        fill={'white'}
                    />
                    <Path d="M389.594,239.301H272.699V122.406c0-9.222-7.477-16.699-16.699-16.699c-9.222,0-16.699,7.477-16.699,16.699v116.895    H122.406c-9.222,0-16.699,7.477-16.699,16.699s7.477,16.699,16.699,16.699h116.895v116.895c0,9.222,7.477,16.699,16.699,16.699    c9.222,0,16.699-7.477,16.699-16.699V272.699h116.895c9.222,0,16.699-7.477,16.699-16.699S398.817,239.301,389.594,239.301z"
                        fill={"white"}
                    />
                </Svg>
            </Pressable>

            {/*Type - Name/Symbol/Total */}
            <View testID='type_container' style={styles.type_container} >
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    style={[styles.type_text,
                    {
                        height: '30%',
                        fontSize: fontSize
                    }]}>
                    {counterType.charAt(0).toLocaleUpperCase() + counterType.slice(1)}
                </Text>
                <View
                    style={{
                        height: '30%', width: '100%'
                    }}
                >
                    {
                        resources.Svg
                    }
                </View>
                <Text
                    accessibilityLiveRegion="polite"
                    accessibilityLabel={`${displayTotal} ${counterType}`}
                    style={[styles.total_text, {
                        fontSize: totalFontSize,
                        height: '35%'
                    }]}>
                    {
                        displayTotal
                    }
                </Text>
            </View>

            {/* Minus */}
            <Pressable
                testID='minus'
                onPress={() => changeTotal(-1)}
                onLongPress={() => changeTotal(-10)}
                style={{
                    width: "20%"
                }}
                accessibilityLabel={`minus ${counterType} counter`}
                accessibilityRole="button"
            >
                <Svg viewBox='0 0 360 360'
                    style={{
                        height: '100%',
                    }}
                >
                    <Path d="M281.633,48.328C250.469,17.163,209.034,0,164.961,0C120.888,0,79.453,17.163,48.289,48.328   c-64.333,64.334-64.333,169.011,0,233.345C79.453,312.837,120.888,330,164.962,330c44.073,0,85.507-17.163,116.671-48.328   c31.165-31.164,48.328-72.599,48.328-116.672S312.798,79.492,281.633,48.328z M260.42,260.46   C234.922,285.957,201.021,300,164.962,300c-36.06,0-69.961-14.043-95.46-39.54c-52.636-52.637-52.636-138.282,0-190.919   C95,44.042,128.901,30,164.961,30s69.961,14.042,95.459,39.54c25.498,25.499,39.541,59.4,39.541,95.46   S285.918,234.961,260.42,260.46z"
                        fill={"white"}
                    />
                    <Path d="M254.961,150H74.962c-8.284,0-15,6.716-15,15s6.716,15,15,15h179.999c8.284,0,15-6.716,15-15S263.245,150,254.961,150z"
                        fill={"white"}
                    />
                </Svg>
            </Pressable>
        </View>
    )
}

const CountersCol: React.FC<{ changeCounters: (counterType: string, value: number) => void }> = ({ changeCounters }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Counters'>>()
    const [stormPressDimensions, setStormPressDimensions] = useState<{ width: number, height: number }>({
        width: 200,
        height: 100
    });
    const [fontSize, setFontSize] = useState<number>(18)

    const toStorm = () => {
        navigation.navigate("Card", {
            card: "storm",
            currentCounters: 0,
            playerID: route.params.playerID
        } as CounterCardProps)
    }

    useEffect(() => {
        if (stormPressDimensions.height !== 0 && stormPressDimensions.width !== 0) {
            setFontSize(textScaler(5, stormPressDimensions))
        }
    }, [stormPressDimensions])

    return (
        <View testID='counters_wrapper'
            style={styles.counters_wrapper}
        >
            {
                Object.keys(counters).map((counterType: string) => {
                    return <CounterRow key={counterType} counterType={counterType} changeCounters={changeCounters} />
                })
            }
            <Pressable key={"storm"}
                style={styles.storm_container}
                onPress={() => toStorm()}
                onLayout={(e) => getDimensions(e, setStormPressDimensions)}
                accessibilityRole="button"
                accessibilityLabel='Storm and Mana tracker'
            >
                <Text style={[styles.type_text, {
                    fontSize: fontSize
                }]} >Storm</Text>
                <Svg viewBox='-25 0 600 600' style={styles.storm_icon}>
                    <Path fill={"white"} d="M375.771,103.226c1.137-5.199,1.736-10.559,1.736-16.04c0-47.913-45.389-86.754-101.377-86.754    c-39.921,0-74.447,19.749-90.979,48.451c-3.419-0.298-6.888-0.451-10.398-0.451c-41.397,0-76.993,21.236-92.738,51.671    C35.289,107.836,0,143.023,0,185.27c0,47.913,45.388,86.754,101.377,86.754h241.377c55.988,0,101.377-38.841,101.377-86.754    C444.131,147.25,415.551,114.945,375.771,103.226z" />
                    <Polygon fill={"white"} points="289.232,280.023 203.678,371.373 279.623,371.373 239.523,443.699 327.887,347.631 251.941,347.631 " />
                    <Polygon fill={"white"} points="168.739,294.847 116.246,350.895 162.842,350.895 138.239,395.271 192.454,336.326 145.858,336.326   " />
                </Svg>
            </Pressable>
        </View>
    )
}

/*
display icon and name? 
*/
interface TrackerProps {
    icon: string,
}

const TrackerRow: React.FC<TrackerProps> = ({ icon }) => {
    const [containerDimensions, setContainerDimensions] = useState<{ width: number, height: number }>({
        width: 0,
        height: 0
    });
    const [fontSize, setFontSize] = useState<number>(18)
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            Svg: ''
        })
    const route = useRoute<RouteProp<RootStackParamList, 'Counters'>>()
    const { globalPlayerData, setCurrentInitiative, setCurrentMonarch } = useContext<GameContextProps>(GameContext)
    const { deviceType } = useContext<OptionsContextProps>(OptionsContext)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { width } = useWindowDimensions()

    useEffect(() => {
        const minSize = icon === "the ring" ? containerDimensions.width / "ring".length : containerDimensions.width / icon.length;

        if (containerDimensions.height !== 0 && containerDimensions.width !== 0) {
            setFontSize(textScaler(icon.length,
                containerDimensions,
                undefined,
                deviceType === 'phone' ? Math.round(minSize) : 32
            ))
        }
    }, [containerDimensions])

    useEffect(() => {
        const svgSize = {
            height: deviceType === 'phone' ? 60 : 120,
        }
        if (icon === 'initiative') {
            dispatchResources({ card: icon, fills: ['black', "url(#SVGID_1_)"], svgDimension: svgSize })
        } else if (icon === 'monarch') {
            dispatchResources({ card: icon, fills: ['white', "url(#gradient-0)", "url(#gradient-0)"], svgDimension: svgSize })
        } else {
            dispatchResources({ card: icon, colorTheme: { primary: 'white', secondary: 'white' }, svgDimension: svgSize })
        }

    }, [icon])

    const handlePress = () => {
        if (icon === 'initiative' || icon === 'dungeon') {
            if (icon === 'initiative') setCurrentInitiative(globalPlayerData[route.params.playerID].screenName);

            navigation.navigate('Dungeon', {
                playerID: route.params.playerID,

                currentDungeon: (icon === "initiative" && !globalPlayerData[route.params.playerID].dungeonData?.currentDungeon) ? 'Undercity'
                    : globalPlayerData[route.params.playerID].dungeonData?.currentDungeon,

                dungeonCoords: globalPlayerData[route.params.playerID].dungeonData?.dungeonCoords ?
                    globalPlayerData[route.params.playerID].dungeonData?.dungeonCoords :
                    {
                        x: width / 2,
                        y: 75
                    }
            } as DungeonData)
        }
        else if (icon === 'monarch') {
            setCurrentMonarch(globalPlayerData[route.params.playerID].screenName)
            navigation.navigate("Game", { menu: false })
        }
        else { //for ring and speed
            navigation.navigate('Card', {
                playerID: route.params.playerID,
                card: icon
            })
        }
    }

    return (
        <View testID='trackers_container'
            onLayout={(e) => getDimensions(e, setContainerDimensions)}
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
            }}
        >
            <Pressable onPress={() => handlePress()}
                style={{
                    alignItems: 'center',
                    width: '60%',
                }}
                accessibilityRole="button"
                accessibilityLabel={`${icon}`}
                accessibilityHint={icon === 'monarch' || icon === 'initiative' ? `activate ${icon}` : `go to ${icon}`}
            >
                <Text style={[styles.total_text, {
                    fontSize: fontSize
                }]}>
                    {icon}
                </Text>
                <View testID='svg_container'
                    style={{
                        height: '10%',
                        width: '100%'
                    }}
                >
                    {
                        resources.Svg
                    }
                </View>
            </Pressable>
        </View>
    )
}

const TrackersCol: React.FC = ({ }) => {

    return (
        <View testID='trackers_wrapper'
            style={styles.tracker_wrapper}
        >
            {trackers.map(trackerType => {
                return <TrackerRow icon={trackerType} key={trackerType} />
            })}
        </View>
    )
}

const Counters: React.FC = ({ }) => {
    const { totalPlayers } = useContext(OptionsContext) as OptionsContextProps
    const { dispatchGlobalPlayerData, globalPlayerData } = useContext(GameContext) as GameContextProps
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Counters'>>()
    const [rotate] = useScreenRotation(totalPlayers, route.params.playerID)
    const [counterTotals, setCounterTotals] = useState<{ [key: string]: number }>({})

    useEffect(() => {
        setCounterTotals(globalPlayerData[route.params.playerID].counterData ?? {})
    }, [])

    const closeCounters = () => {
        if (Object.keys(counterTotals).length) {
            dispatchGlobalPlayerData({
                playerID: route.params.playerID,
                field: 'counters',
                value: counterTotals
            })
        }
        navigation.navigate("Game", { menu: false })
    }

    const changeCounters = (counterType: string, value: number) => {
        const total = !counterTotals[counterType] ? 0 : counterTotals[counterType]
        if (total + value <= 0 || value === 0) {
            const countersCopy = counterTotals
            delete countersCopy[counterType]
            setCounterTotals(countersCopy)
        } else {
            setCounterTotals({ ...counterTotals, [counterType]: value })
        }
    }

    return (
        <View style={styles.counters_container}>
            <View style={[styles.counter_rows_container,
            rotate && {
                transform: [rotate]
            }
            ]}
            >
                <CountersCol changeCounters={changeCounters} />
                <TrackersCol />
            </View>
            <Pressable style={[styles.close_icon,
            (totalPlayers === 2 && route.params.playerID === 2) || (totalPlayers === 3 && route.params.playerID !== 3) || (totalPlayers === 4 && (route.params.playerID === 1 || route.params.playerID === 2)) ?
                {
                    top: 0,
                    left: 0
                } : {
                    bottom: 0,
                    right: 0
                }
            ]}
                onPress={() => closeCounters()}
                accessibilityRole="button"
            >
                <Svg height="60" width="60" viewBox='0 0 512 512'
                    style={styles.close_icon}
                >
                    <Path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
                        fill="white"
                    />
                </Svg>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    counters_container: {
        height: '95%',
        width: '100%'
    },
    counter_rows_container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    counters_wrapper: {
        width: '60%',
    },
    row_container: {
        width: '100%',
        height: `${80 / Object.keys(counters).length}%`,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderBottomColor: '#6e6e6e',
        borderBottomWidth: 1,
        marginTop: 5
    },
    tracker_wrapper: {
        width: '30%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    storm_container: {
        width: '100%',
        height: `${80 / Object.keys(counters).length}%`,
        alignItems: 'center',
    },
    storm_icon: {
        height: '80%',
        width: '100%',
    },
    type_container: {
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    type_text: {
        color: 'white',
        fontFamily: 'Beleren'
    },
    total_text: {
        color: 'white',
        fontFamily: 'Beleren',
    },
    close_icon: {
        position: "absolute",
        zIndex: 1,
        width: 60,
        height: 60,
    },
})

export default Counters