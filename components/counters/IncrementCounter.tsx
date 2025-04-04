import React, { useContext, useEffect, useReducer, useState } from "react"
import { View, StyleSheet, Text, Pressable, ColorValue } from "react-native"
import { imageAction, imageReducer, ImageReducerState } from "../../reducers/imageResources"
import { ColorTheme, CounterCardProps, CounterData } from "../.."
import { GameContext, GameContextProps } from "../../GameContext"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../navigation"
import { counterTextScaler } from "../../functions/textScaler"
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
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            iconImage: undefined,
            cardImage: undefined,
            Svg: undefined
        })
    const { globalPlayerData } = useContext(GameContext) as GameContextProps
    const [counterDimensions, setCounterDimensions] = useState<{ width: number, height: number }>({width: 78, height: 25});
    const [total, setTotal] = useState<number>()
    const [textSize, setTextSize] = useState<number>()

    useEffect(() => {
        const colors :  [ColorValue, ...ColorValue[]] = counterType === 'energy' ? [colorTheme.primary, colorTheme.secondary] : [colorTheme.secondary]
        dispatchResources({card: counterType, fills:colors})
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
            const totalPlayers = Object.keys(globalPlayerData).length
            
            setTextSize(counterTextScaler(totalPlayers, playerID, total, counterDimensions))
        }
    }, [counterDimensions?.height, total])

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
                accessibilityRole="button"
            >
                {
                    resources.Svg &&
                    <View style={styles.counter_icon_container}
                        testID="counter_icon_container"
                    >
                            {
                                resources.Svg
                            }
                    </View>
                }
                <View testID="counter_total_container"
                    style={styles.counter_total_container}
                >
                    <Text
                        accessibilityLabel={`${globalPlayerData[playerID].screenName} ${total} ${counterType}`}
                        accessibilityLiveRegion="polite"
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
        maxHeight:'50%',
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