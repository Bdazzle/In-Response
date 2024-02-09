import React, { useContext, useEffect, useReducer, useState } from "react"
import { View, StyleSheet, Text, Pressable } from "react-native"
import { imageReducer, ImageReducerState, ShapeData } from "../../reducers/imageResources"
import Svg, { Circle, Path, Polygon } from "react-native-svg"
import { ColorTheme, CounterCardProps, CounterData } from "../.."
import { GameContext, GameContextProps } from "../../GameContext"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../navigation"
import { textScaler } from "../../functions/textScaler"
import getDimensions from "../../functions/getComponentDimensions"

interface IncrementCounterProps {
    counterType: string
    colorTheme: ColorTheme
    playerID: number,
    parentDimensions: {
        height: number,
        width: number
    }
}
const IncrementingCounter: React.FC<IncrementCounterProps> = ({ parentDimensions, playerID, colorTheme, counterType }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: string) => ImageReducerState>(imageReducer,
        {
            iconImage: undefined,
            cardImage: undefined,
            SvgPaths: undefined,
            SvgViewbox: undefined
        })
    const { globalPlayerData } = useContext(GameContext) as GameContextProps
    const [counterDimensions, setCounterDimensions] = useState<{ width: number, height: number }>();
    const [total, setTotal] = useState<number>()
    const [textSize, setTextSize] = useState<number>()

    useEffect(() => {
        dispatchResources(counterType)
    }, [parentDimensions])

    const handleCounterPress = (counter: string) => {
        navigation.navigate("Card", {
            playerID: playerID,
            card: counter,
            currentCounters: globalPlayerData[playerID].counterData![counterType]
        } as CounterCardProps)
    }

    useEffect(() => {
        setTotal(globalPlayerData[playerID].counterData![counterType])
    }, [globalPlayerData[playerID].counterData![counterType]])

    useEffect(() => {
        if (counterDimensions) {
            setTextSize(textScaler(
                String(total).length,
                counterDimensions,
                64, 16
             )
            )
        }
    },[counterDimensions?.height])

    return (
        <View
            onLayout={(e) => getDimensions(e, setCounterDimensions)}
            style={[styles.increment_counter,
            {
                height: `${Math.round(80 / Object.keys(globalPlayerData[playerID].counterData as CounterData).length)}%`
            }]}>
            <Pressable style={styles.touchable_wrapper}
                onPress={() => handleCounterPress(counterType)}
                accessibilityLabel={`${globalPlayerData[playerID].screenName} ${counterType}`}
            >
                {
                    resources.SvgPaths &&
                    <View style={styles.counter_icon_container}
                        testID="counter_icon_container"
                    >
                        <Svg viewBox={resources.SvgViewbox} height={'100%'} width={'100%'}>
                            {
                                resources.SvgPaths.map((path: ShapeData<boolean | string>, i: number) => {
                                    return path.path ? <Path key={`${counterType} path ${i}`} d={path.path}
                                        fill={
                                            typeof path.fill === "string" ? path.fill :
                                                path.fill === true ? colorTheme.secondary :
                                                    colorTheme.primary
                                        } />
                                        : path.polygonPoints ? <Polygon key={`${counterType} polygon ${i}`}
                                            points={path.polygonPoints}
                                            fill={
                                                typeof path.fill === "string" ? path.fill :
                                                    path.fill === true ? colorTheme.secondary :
                                                        colorTheme.primary
                                            }
                                        />
                                            : path.circle ? <Circle key={`${counterType} circle ${i}`}
                                                cx={path.circle.cx} cy={path.circle.cy} r={path.circle.r}
                                                fill={
                                                    typeof path.fill === "string" ? path.fill :
                                                        path.fill === true ? colorTheme.secondary :
                                                            colorTheme.primary
                                                } />
                                                : undefined
                                })
                            }
                        </Svg>
                    </View>
                }
                <View testID="counter_total_container"
                    style={styles.counter_total_container}
                >
                    <Text
                        accessibilityLabel={`${globalPlayerData[playerID].screenName} ${total} ${counterType}`}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                        style={[styles.total_text, {
                            fontSize: textSize,
                            color: colorTheme.secondary,
                        }]}>
                        {total}
                    </Text>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    increment_counter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },
    touchable_wrapper: {
        paddingTop: '2%',
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    counter_icon_container: {
        height: '100%',
        width: '50%'
    },
    counter_total_container: {
        width: '50%',
    },
    total_text: {
        width: '100%',
        fontFamily: 'Beleren',
    }
})

export default IncrementingCounter