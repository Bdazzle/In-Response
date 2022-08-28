import React, { useContext, useEffect, useReducer, useState } from "react"
import { View, StyleSheet, Text, Pressable } from "react-native"
import { PlayerContext, PlayerContextProps } from "../../PlayerContext"
import { imageReducer, ImageReducerState, ShapeData } from "../../reducers/imageResources"
import Svg, { Path, Polygon } from "react-native-svg"
import { ColorTheme, CounterCardProps } from "../.."
import { GameContext, GameContextProps } from "../../GameContext"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../navigation"
import { textScaler } from "../../functions/textScaler"

interface IncrementCounterProps {
    counterType: string
    colorTheme: ColorTheme
    playerID: number
}
const IncrementingCounter: React.FC<IncrementCounterProps> = ({ playerID, colorTheme, counterType }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: string) => ImageReducerState>(imageReducer,
        {
            iconImage: undefined,
            cardImage: undefined,
            SvgPaths: undefined,
            SvgViewbox: undefined
        })
    const { dimensions } = useContext(PlayerContext) as PlayerContextProps
    const { globalPlayerData } = useContext(GameContext) as GameContextProps
    const [total, setTotal] = useState<number>()

    useEffect(() => {
        dispatchResources(counterType)
    }, [dimensions])

    const handleCounterPress = (counter: string) => {
        navigation.navigate("Card", {
            playerID: playerID,
            counterType: counter,
            currentCounters: globalPlayerData[playerID].counterData![counterType]
        } as CounterCardProps)
    }

    useEffect(() => {
        setTotal(globalPlayerData[playerID].counterData![counterType])
    }, [globalPlayerData[playerID].counterData![counterType]])

    return (
        <>
            <View style={styles.increment_counter}>
                <Pressable style={styles.touchable_wrapper}
                    onPress={() => handleCounterPress(counterType)}
                >
                    {
                        resources.SvgPaths &&
                        <View style={styles.counter_icon_container}
                        testID="counter_icon_container"
                        >
                            <Svg viewBox={resources.SvgViewbox} style={{ height: '100%', width: '100%' }}>
                                {
                                    resources.SvgPaths.map((path: ShapeData<boolean>, i: number) => {
                                        return path.path ? <Path key={`${counterType} path ${i}`} d={path.path}
                                            fill={path.fill === true ? colorTheme.secondary : colorTheme.primary} />
                                            : path.polygonPoints ? <Polygon key={`${counterType} polygon ${i}`}
                                                points={path.polygonPoints}
                                                fill={path.fill === true ? colorTheme.secondary : colorTheme.primary}
                                            />
                                                : undefined
                                    })
                                }
                            </Svg>
                        </View>
                    }
                    <View testID="counter_total_container"
                    style={styles.counter_total_container}>
                            <Text style={[styles.total_text, {
                                fontSize:textScaler(32, dimensions.width),
                                color: colorTheme.secondary,
                            }]}>
                                {total}
                            </Text>
                    </View>

                </Pressable>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    increment_counter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '20%'
    },
    touchable_wrapper: {
        height: '80%',
        width: '60%',
        flexDirection: 'row'
    },
    counter_icon_container: {
        height: '100%',
        width: '70%'
    },
    counter_total_container:{
        width: '100%',
    },
    total_text:{
        textAlignVertical: 'top',
        width: '100%',
        height:'100%',
        fontFamily: 'Beleren',
    }
})

export default IncrementingCounter