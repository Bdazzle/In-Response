import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Text, Image, View, StyleSheet, Dimensions, TextInput, TextInputChangeEventData, NativeSyntheticEvent, KeyboardAvoidingView, Platform, Pressable, ImageSourcePropType, useWindowDimensions, AccessibilityInfo } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GameContext, GameContextProps } from '../GameContext';
import { RootStackParamList } from '../navigation';
import { imageReducer, ImageReducerState, manaSymbols } from '../reducers/imageResources';
import { counters } from '../constants/CounterTypes'
import { textScaler } from '../functions/textScaler';
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
            // placeholder={`${total} ${manaColor}`}
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
                    sets counters to 0, but still keeps display
                    */
                    // dispatchGlobalPlayerData({
                    //     playerID: route.params.playerID,
                    //     field: 'counters',
                    //     subField: route.params.card,
                    //     value: 0
                    // })
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
        if(globalPlayerData[route.params.playerID!].dungeonData?.currentDungeon){
            navigation.navigate('Dungeon', {
                playerID: route.params.playerID,
                currentDungeon: globalPlayerData[route.params.playerID as number].dungeonData?.currentDungeon,
                dungeonCoords: globalPlayerData[route.params.playerID as number].dungeonData?.dungeonCoords,
            } as DungeonData)
        } else {
            navigation.navigate('Dungeon', {
                playerID: route.params.playerID,
                currentDungeon: 'Undercity',
                dungeonCoords:{
                    x: width/2,
                    y:75
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
                transform: rotate && [rotate, { translateY: 70 }],
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
                                <Svg viewBox='0 0 512 512' style={{ height: '100%', width: '100%' }}>
                                    <Path d="M193.571 26.027l35.192 83.99c14.877 7.658 33.121 6.696 47.488-1.279l40.283-85.976c-45.582-7.268-84.512-4.945-122.963 3.265zm137.3 7.606l-32.038 71.38c12.536 12.349 37.237 18.872 47.033 15.448l31.172-64.691c-12.422-8.392-27.428-15.886-46.168-22.137zm-154.86-1.97c-21.814 6.55-40.982 16.35-56.099 28.591 14.941 15.844 28.861 34.184 38.194 52.832 24.477 6.133 35.479-6.849 47.475-18.55zm-74.245 34.831c-36.541 32.91-66.523 76.42-78.068 125.215l65.957 3.353c12.006-30.53 24.552-56.284 54.231-72.755-9.883-20.24-23.626-39.403-42.12-55.813zm292.503-.29l-31.852 61.044c32.54 21.007 43.572 41.348 52.597 69l72.464-8.43c-9.612-55.894-42.206-107.047-93.209-121.614zm-52.233 137.2c4.757 12.937-15.842 29.7-9.07 39.428-4.011.85-8.874 1.642-14.385-8.957-1.126 12.49 2.172 19.603 12.168 29.209-2.682.783-8.045 2.75-12.08.566-1.24 7.386 10.867 13.863 20.725 14.832l8.392-2.175c-6.09-1.106-7.881-3.315-10.627-6.13 2.97-1.32 12.554-7.117 2.149-14.751 12.634-2.752 6.035-14.89 4.14-21.862 7.525 7.798 15.243 22.54 21.862 7.084 4.176 12.604 6.561 12.12 13.614 9.107 1.054 9.196-2.957 14.791-8.792 22.518l12.494-4.992c6.018-5.026 20.16-25.502 6.428-35.5 2.603 12.443-5.563 14.388-18.672-10.937-4.377 30.773-12.236-7.49-28.346-17.44zm-321.668 2.108v66.242l72.842-11.858 1.592-49.873zm143.486.363c3.732 8.72-14.487 45.226-18.865 14.453-13.109 25.325-23.908 24.26-21.304 11.817-13.732 9.998-1.347 33.458 4.671 38.484l11.229 3.001c-5.835-7.727-11.565-13.614-10.512-22.81 7.053 3.013 10.492 5.604 14.668-7 6.618 15.456 17.32-4.378 24.846-12.175-1.554 11.494-6.282 22.427 7.303 25.197-9.13 10.082 1.899 19.99-12.694 22.812l8.393 2.176c9.857-.97 20.385-10.606 19.144-17.992-4.035 2.183-7.818 3.376-10.5 2.594 9.996-9.607 10.662-21.46 9.536-33.95-5.511 10.6-7.917 11.738-11.752 13.698 6.77-9.728-5.927-32.285-14.163-40.305zm327.512 1.172l-77.57 5.687 1.156 79.192 75.524 2.842zM98.313 279.81l-79.955 9.779 1.202 99.754 83.54 1.152zm280.659 7.347l-28.332 7.031 21.455 68.315 16.125-5.043zm-246.961 3.348l-9.248 70.303 16.125 5.043 21.455-68.315zM412.269 310.3v83.58l79.166-8.031 2.289-75.55zm84.605 91.656l-88.934 9.947-1.16 80.727 90.674.586zm-395.822 2.002l-81.848 2.322-4.658 86.184h90z"
                                        fill="white"
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
                            // manaSymbols.map((m, i) => {
                            //     return <ManaCounter key={`manasymbol_${i}`} source={m} />
                            // })
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
        justifyContent:'center',
        alignContent:'center',
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
        alignSelf:'center',
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
        fontSize: cardName === 'storm' ? textScaler(48) : textScaler(56),
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
        fontSize: deviceType === 'phone' ? textScaler(42) : textScaler(30),
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