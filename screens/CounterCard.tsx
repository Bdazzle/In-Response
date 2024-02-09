import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Text, Image, View, StyleSheet, TextInput, TextInputChangeEventData, NativeSyntheticEvent, KeyboardAvoidingView, Platform, Pressable, ImageSourcePropType, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GameContext, GameContextProps } from '../GameContext';
import { RootStackParamList } from '../navigation';
import { imageReducer, ImageReducerState, manaSymbols } from '../reducers/imageResources';
import { counters } from '../constants/CounterTypes'
import { staticTextScaler } from '../functions/textScaler';
import { OptionsContext, OptionsContextProps } from '../OptionsContext';
import useScreenRotation from '../hooks/useScreenRotation';
import FlipCard from '../components/counters/Flipcard';
import TheRing from '../components/overlays/TheRingOverlay';
import { cardRules } from '../constants/cardRules'
import { DungeonData } from '..';


interface ManaCounterProps {
    source: ImageSourcePropType,
    manaColor: string
}

const ManaCounter: React.FC<ManaCounterProps> = ({ source, manaColor }) => {
    const { deviceType } = useContext(OptionsContext)
    const [total, setTotal] = useState<number>(0)

    return (
        <View style={styles().mana_counter} >
            {/*Mana Symbol/Plus*/}
            <Pressable onPressIn={() => setTotal(total + 1)}
                style={styles().mana_pressable}
                accessibilityLabel={`Add ${manaColor} Mana`}
            >
                <Image source={source}
                    resizeMode='contain'
                    style={styles().mana_image}
                    alt={`${manaColor} mana`}
                />
            </Pressable>
            {/* Total */}
            <Text testID='mana_total' style={styles(undefined, deviceType).mana_total}
                accessibilityRole="none"
                accessibilityLabel={`${total} ${manaColor} mana`}
            >{total}</Text>
            {/* Minus */}
            <Pressable onPressIn={() => setTotal(total - 1)}
                style={styles().mana_minus}
                accessibilityLabel={`Minus ${manaColor} Mana`}
            >
                <Svg viewBox='0 -100 520 520' height={'100%'} width={'50%'}>
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

/* 
Can do 2 different things:
1) Show a non-incrementing counter image onLongPress from StaticCounter component,
in which case it SHOULD NOT render plus, minus, and total components.

2)if navigated from an IncrementCounter component, SHOULD render plus, minus, and total components, 
in which case, when closed, should save the total to globalPlayerData -> playerID -> counter, 
which should update corresponding Player component
*/
const CounterCard: React.FC = ({ }) => {
    const { totalPlayers } = useContext(OptionsContext) as OptionsContextProps
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Card'>>()
    const { dispatchGlobalPlayerData, globalPlayerData } = useContext(GameContext) as GameContextProps
    const [cardImageSource, dispatchCardImageSource] = useReducer<(state: ImageReducerState, action: string) => ImageReducerState>(imageReducer,
        {
            cardImage: undefined,
        })
    const [total, setTotal] = useState<number | undefined>()
    const [rotate] = useScreenRotation(totalPlayers, route.params.playerID!)
    const { width, height } = useWindowDimensions()

    useEffect(() => {
        dispatchCardImageSource(route.params.card)
        setTotal(route.params.currentCounters)
    }, [])



    const handleInputChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setTotal(Number(e.nativeEvent.text))
    }

    const handleSaveAndClose = () => {
        if (route.params.playerID) {
            if (Object.keys(counters).includes(route.params.card)) {
                if (total as number > 0) {
                    dispatchGlobalPlayerData({
                        playerID: route.params.playerID,
                        field: 'counters',
                        subField: route.params.card,
                        value: total as number
                    })
                } else {
                    /* 
                    remove counters
                    */
                    dispatchGlobalPlayerData({
                        playerID: route.params.playerID,
                        field: 'remove counter',
                        subField: route.params.card,
                        value: 0
                    })
                }
            }
        }
        navigation.navigate('Game', { menu: false })
    }

    const dungeonNav = () => {
        if (globalPlayerData[route.params.playerID!].dungeonData?.currentDungeon) {
            navigation.navigate('Dungeon', {
                playerID: route.params.playerID,
                currentDungeon: globalPlayerData[route.params.playerID as number].dungeonData?.currentDungeon,
                dungeonCoords: globalPlayerData[route.params.playerID as number].dungeonData?.dungeonCoords,
            } as DungeonData)
        } else {
            navigation.navigate('Dungeon', {
                playerID: route.params.playerID,
                currentDungeon: 'Undercity',
                dungeonCoords: {
                    x: width / 2,
                    y: 75
                }
            } as DungeonData)
        }
    }

    return (
        <Pressable testID='container'
            focusable={true}
            accessibilityRole="button"
            onPressIn={() => handleSaveAndClose()}
            accessibilityHint='Press background to go back to game'
            style={[styles().container, {
                width: width,
                height: height,
                transform: rotate && [rotate],
            }]}>
            {/*The Ring */}
            {
                route.params.card === 'the ring' ?
                    <TheRing imageSource={{
                        front: require('../assets/cards/the_ring.png'),
                        back: require('../assets/cards/ring_tempt.png')
                    }} />
                    :
                    <KeyboardAvoidingView testID='card_wrapper'
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles(route.params.card).card_wrapper}>
                        {/* Image/Close functions */}
                        {
                            (typeof cardImageSource.cardImage === 'object' &&
                                'front' in cardImageSource.cardImage &&
                                'back' in cardImageSource.cardImage) ?
                                <FlipCard front={cardImageSource.cardImage.front} back={cardImageSource.cardImage.back} />
                                :
                                // Static Card
                                <View testID='card_pressable'
                                    style={styles().card_pressable}
                                    accessibilityLabel={`${route.params.card}`}
                                >
                                    <Image
                                        style={Object.keys(counters).includes(route.params.card) || route.params.card === 'storm'
                                            ? styles().counter_card_image : styles().static_card}
                                        source={cardImageSource.cardImage!}
                                        resizeMethod='scale'
                                        resizeMode="contain"
                                        alt={route.params.card === 'initiative' ? cardRules['initiative'] :
                                            route.params.card === 'monarch' ? cardRules['monarch'] :
                                                `${route.params.card} card`}
                                    />
                                </View>
                        }
                        {
                            route.params.card === 'initiative' &&
                            <Pressable style={styles().dungeon_icon}
                                onPressIn={() => dungeonNav()}
                                accessibilityLabel="to Dungeon"
                            >
                                <Svg viewBox='0 0 524 524'>
                                    <Path d="M128.73 195.32l-82.81-51.76c-8.04-5.02-18.99-2.17-22.93 6.45A254.19 254.19 0 0 0 .54 239.28C-.05 248.37 7.59 256 16.69 256h97.13c7.96 0 14.08-6.25 15.01-14.16 1.09-9.33 3.24-18.33 6.24-26.94 2.56-7.34.25-15.46-6.34-19.58zM319.03 8C298.86 2.82 277.77 0 256 0s-42.86 2.82-63.03 8c-9.17 2.35-13.91 12.6-10.39 21.39l37.47 104.03A16.003 16.003 0 0 0 235.1 144h41.8c6.75 0 12.77-4.23 15.05-10.58l37.47-104.03c3.52-8.79-1.22-19.03-10.39-21.39zM112 288H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm0 128H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm77.31-283.67l-36.32-90.8c-3.53-8.83-14.13-12.99-22.42-8.31a257.308 257.308 0 0 0-71.61 59.89c-6.06 7.32-3.85 18.48 4.22 23.52l82.93 51.83c6.51 4.07 14.66 2.62 20.11-2.79 5.18-5.15 10.79-9.85 16.79-14.05 6.28-4.41 9.15-12.17 6.3-19.29zM398.18 256h97.13c9.1 0 16.74-7.63 16.15-16.72a254.135 254.135 0 0 0-22.45-89.27c-3.94-8.62-14.89-11.47-22.93-6.45l-82.81 51.76c-6.59 4.12-8.9 12.24-6.34 19.58 3.01 8.61 5.15 17.62 6.24 26.94.93 7.91 7.05 14.16 15.01 14.16zm54.85-162.89a257.308 257.308 0 0 0-71.61-59.89c-8.28-4.68-18.88-.52-22.42 8.31l-36.32 90.8c-2.85 7.12.02 14.88 6.3 19.28 6 4.2 11.61 8.9 16.79 14.05 5.44 5.41 13.6 6.86 20.11 2.79l82.93-51.83c8.07-5.03 10.29-16.19 4.22-23.51zM496 288h-96c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm0 128h-96c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zM240 177.62V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V177.62c-5.23-.89-10.52-1.62-16-1.62s-10.77.73-16 1.62zm-64 41.51V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V189.36c-12.78 7.45-23.84 17.47-32 29.77zm128-29.77V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V219.13c-8.16-12.3-19.22-22.32-32-29.77z"
                                        fill={'white'}
                                    />
                                </Svg>
                            </Pressable>
                        }
                        {/* Total/Increment Buttons */}
                        {total !== undefined &&
                            <View style={styles().button_wrapper}>
                                <Pressable
                                    testID='plus'
                                    onPress={() => setTotal(total + 1)}
                                    onLongPress={() => setTotal(total + 10)}
                                    style={styles().increment_pressable}
                                    accessibilityLabel={`Plus ${route.params.card}`}
                                >
                                    <Svg
                                        viewBox={`0 0 650 650`}
                                        height={'100%'} width={'100%'}
                                    >
                                        <Path d="M491.841,156.427c-19.471-45.946-51.936-85.013-92.786-112.637C358.217,16.166,308.893-0.007,256,0    c-35.254-0.002-68.946,7.18-99.571,20.158C110.484,39.63,71.416,72.093,43.791,112.943C16.167,153.779-0.007,203.104,0,256    c-0.002,35.255,7.181,68.948,20.159,99.573c19.471,45.946,51.937,85.013,92.786,112.637C153.783,495.834,203.107,512.007,256,512    c35.253,0.002,68.946-7.18,99.571-20.158c45.945-19.471,85.013-51.935,112.638-92.785C495.834,358.22,512.007,308.894,512,256    C512.002,220.744,504.819,187.052,491.841,156.427z M460.413,342.257c-16.851,39.781-45.045,73.723-80.476,97.676    c-35.443,23.953-78.02,37.926-123.936,37.933c-30.619-0.002-59.729-6.218-86.255-17.454    c-39.781-16.851-73.724-45.044-97.677-80.475C48.114,344.495,34.14,301.917,34.133,256c0.002-30.62,6.219-59.731,17.454-86.257    c16.851-39.781,45.045-73.724,80.476-97.676C167.506,48.113,210.084,34.14,256,34.133c30.619,0.002,59.729,6.218,86.255,17.454    c39.781,16.85,73.724,45.044,97.677,80.475c23.953,35.443,37.927,78.02,37.934,123.939    C477.864,286.62,471.648,315.731,460.413,342.257z"
                                            fill={'white'}
                                        />
                                        <Path d="M389.594,239.301H272.699V122.406c0-9.222-7.477-16.699-16.699-16.699c-9.222,0-16.699,7.477-16.699,16.699v116.895    H122.406c-9.222,0-16.699,7.477-16.699,16.699s7.477,16.699,16.699,16.699h116.895v116.895c0,9.222,7.477,16.699,16.699,16.699    c9.222,0,16.699-7.477,16.699-16.699V272.699h116.895c9.222,0,16.699-7.477,16.699-16.699S398.817,239.301,389.594,239.301z"
                                            fill={"white"}
                                        />
                                    </Svg>
                                </Pressable>

                                <View style={styles().total_wrapper}
                                    accessibilityLabel={`${route.params.card} total`}
                                >
                                    <TextInput style={styles(route.params.card).total_text}
                                        value={`${total}`}
                                        accessibilityRole="none"
                                        placeholder={`${total} ${route.params.card} counters`}
                                        testID="counter_total"
                                        keyboardType='numeric'
                                        onChange={(e) => handleInputChange(e)}
                                        editable={true}
                                        accessibilityLabel={`${route.params.card} total input`}
                                    ></TextInput>
                                </View>

                                <Pressable
                                    testID='minus'
                                    onPress={() => setTotal(total - 1)}
                                    onLongPress={() => setTotal(total - 10)}
                                    style={styles().increment_pressable}
                                    accessibilityLabel={`Minus ${route.params.card}`}
                                >
                                    <Svg
                                        viewBox={`-80 0 420 420`}
                                        height={'100%'} width={'100%'}
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
                        }
                    </KeyboardAvoidingView>
            }

            {route.params.card === 'storm' &&
                <View testID='mana_container' style={styles().mana_container}>
                    <View testID='mana_wrapper'
                        style={styles().mana_wrapper}>
                        {
                            Object.entries(manaSymbols).map((m) => {
                                return <ManaCounter key={m[0]} source={m[1]} manaColor={m[0]} />
                            })
                        }
                    </View>
                </View>
            }
        </Pressable>
    )
}

const styles = (cardName?: string, deviceType?: string) => StyleSheet.create({
    container: {
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    card_wrapper: {
        flex: cardName === 'storm' ? 0 : 1,
        height: cardName === 'storm' ? '55%' : '100%',
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignContent: 'center',
    },
    card_pressable: {
        height: '80%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counter_card_image: {
        height: '100%',
        width: '100%',
    },
    dungeon_icon: {
        width: 80,
        height: 80,
        alignSelf: 'center',
    },
    static_card: {
        resizeMode: 'contain',
        margin: 0,
        width: '100%',
    },
    increment_pressable: {
        width: '30%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_wrapper: {
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    total_wrapper: {
        width: '33%',
    },
    total_text: {
        color: 'white',
        textAlign: 'center',
        borderBottomColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 2,
        fontFamily: 'Beleren',
        fontSize: cardName === 'storm' ? staticTextScaler(48) : staticTextScaler(56),
    },
    mana_container: {
        height: '45%',
        overflow: 'visible',
    },
    mana_wrapper: {
        justifyContent: 'center',
        flex: 1,
    },
    mana_counter: {
        flexDirection: 'row',
        height: '16%',
        width: '100%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    mana_total: {
        color: 'white',
        textAlign: 'center',
        fontSize: deviceType === 'phone' ? staticTextScaler(42) : staticTextScaler(30),
        fontFamily: 'Beleren',
        borderBottomColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 2,
        width: '33%'
    },
    mana_pressable: {
        height: '100%',
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mana_image: {
        height: '100%',
        width: 60,
    },
    mana_minus: {
        width: '33%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default CounterCard