import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Text, Image, View, StyleSheet, Dimensions, TextInput, TextInputChangeEventData, NativeSyntheticEvent, KeyboardAvoidingView, Platform, Pressable, ImageSourcePropType } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GameContext, GameContextProps } from '../GameContext';
import { RootStackParamList } from '../navigation';
import { imageReducer, ImageReducerState, manaSymbols } from '../reducers/imageResources';
import { counters } from '../constants/CounterTypes'
import { textScaler } from '../functions/textScaler';
import { OptionsContext, OptionsContextProps } from '../OptionsContext';

interface ManaCounterProps {
    source: ImageSourcePropType
}

const ManaCounter: React.FC<ManaCounterProps> = ({ source }) => {
    const [total, setTotal] = useState<number>(0)

    return (
        <View style={styles.mana_counter} >
            {/*Mana Symbol/Plus*/}
            <Pressable onPressIn={() => setTotal(total + 1)}
                style={styles.mana_pressable}
            >
                <Image source={source}
                    resizeMode='contain'
                    style={styles.mana_image}
                />
            </Pressable>
            {/* Total */}
            <Text testID='mana_total' style={styles.mana_total} >{total}</Text>
            {/* Minus */}
            <Pressable onPressIn={() => setTotal(total - 1)}
                style={styles.mana_minus}
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
    const { dispatchGlobalPlayerData } = useContext(GameContext) as GameContextProps
    const [cardImageSource, dispatchCardImageSource] = useReducer<(state: ImageReducerState, action: string) => ImageReducerState>(imageReducer,
        {
            cardImage: undefined,
        })
    const [total, setTotal] = useState<number | undefined>()

    const height = Dimensions.get('screen').height
    const width = Dimensions.get('screen').width

    useEffect(() => {
        dispatchCardImageSource(route.params.counterType)
        setTotal(route.params.currentCounters)
    }, [])

    const handleInputChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setTotal(Number(e.nativeEvent.text))
    }

    const handleSaveAndClose = () => {
        if (Object.keys(counters).includes(route.params.counterType)) {
            if (total as number > 0) {
                dispatchGlobalPlayerData({
                    playerID: route.params.playerID,
                    field: 'counters',
                    subField: route.params.counterType,
                    value: total as number
                })
            } else {
                dispatchGlobalPlayerData({
                    playerID: route.params.playerID,
                    field: 'counters',
                    subField: route.params.counterType,
                    value: 0
                })
            }
        }
        navigation.navigate('Game', { menu: false })
    }

    return (
        <View testID='container'
            style={[styles.container, {
                width: width,
                height: height,
                transform: (totalPlayers === 2 && route.params.playerID === 2) || (totalPlayers === 3 && route.params.playerID !== 3) || (totalPlayers === 4 && route.params.playerID % 2 !== 0) ?
                    [{
                        rotate: '180deg',
                    }, {
                        translateY: 70
                    }
                    ] : []
            }]}>
            <KeyboardAvoidingView testID='card_wrapper'
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.card_wrapper, {
                    flex: route.params.counterType === 'storm' ? 0 : 1,
                    height: route.params.counterType === 'storm' ? height * .45 : height,
                    width: width,
                }]}>
                {/* Image/Close functions */}
                <Pressable testID='card_pressable'
                    onPressIn={() => handleSaveAndClose()}
                    style={styles.card_pressable}
                >
                    <Image
                        style={Object.keys(counters).includes(route.params.counterType) || route.params.counterType === 'storm'
                            ? styles.counter_card_image : styles.static_card}
                        source={cardImageSource.cardImage!}
                        resizeMethod='scale'
                        resizeMode="contain"
                    />
                </Pressable>

                {/* Total/Increment Buttons */}
                {total !== undefined &&
                    <View style={[styles.button_wrapper, {
                        height: route.params.counterType === 'storm' ? '25%' : '20%'
                    }]}>
                            <Pressable
                                testID='plus'
                                onPress={() => setTotal(total + 1)}
                                onLongPress={() => setTotal(total + 10)}
                                style={styles.increment_pressable}
                            >
                                <Svg
                                    viewBox={`${width < 900 ? -width / 10 : 10} 0 650 650`}
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

                        <Pressable style={styles.total_wrapper}>
                            <TextInput style={[styles.total_text, {
                                fontSize: route.params.counterType === 'storm' ? textScaler(42) : textScaler(56),
                            }
                            ]}
                                value={`${total}`}
                                testID="counter_total"
                                keyboardType='numeric'
                                onChange={(e) => handleInputChange(e)}
                            ></TextInput>
                        </Pressable>

                            <Pressable
                                testID='minus'
                                onPress={() => setTotal(total - 1)}
                                onLongPress={() => setTotal(total - 10)}
                                style={styles.increment_pressable}
                            >
                                <Svg 
                                viewBox={`${width < 900 ? -width / 10 : -width / 90} 0 420 420`}
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
            {route.params.counterType === 'storm' &&
                <View testID='mana_container' style={styles.mana_container}>
                    <View testID='mana_wrapper'
                        style={styles.mana_wrapper}>
                        {
                            manaSymbols.map((m, i) => {
                                return <ManaCounter key={`manasymbol_${i}`} source={m} />
                            })
                        }
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    card_wrapper: {
        zIndex: 20,
        top: 0,
        justifyContent: 'flex-start',
        backgroundColor: 'black',
    },
    card_pressable: {
        width: '100%',
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    static_card: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    increment_pressable:{
        width:'30%',
        height:'100%',
        alignItems:'center',
    },
    counter_card_image: {
        height: '100%',
        width: '100%',
    },
    button_wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    total_wrapper: {
        flex: 1,
        width: '33%',
        alignContent: 'center',
        justifyContent: 'center',
    },
    total_text: {
        color: 'white',
        textAlign: 'center',
        borderBottomColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 2,
        fontFamily: 'Beleren'
    },
    mana_container: {
        height: '55%',
        flex: 1,
        top: 0,
        overflow: 'visible',
    },
    mana_wrapper: {
        alignContent: 'center',
        flex: 1,
    },
    mana_counter: {
        flexDirection: 'row',
        height: '14%',
        width: '100%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    mana_total: {
        color: 'white',
        textAlign: 'center',
        fontSize: textScaler(34),
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
    }
})

export default CounterCard