import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext } from "react"
import { StyleSheet, View, TouchableOpacity} from "react-native"
import { AllScreenNavProps } from "../..";
import { ColorLibrary } from "../../constants/Colors";
import { GameContext, GameContextProps } from "../../GameContext";
import { StartMenuStackParamList } from "../../navigation";

export interface ColorSelectorProps {
    playerID: number;
    currentColor: string;
    colorPosition: string
}
// { playerID, currentColor, colorPosition }
const ColorSelector: React.FC<ColorSelectorProps> = ({ currentColor, colorPosition }) => {
    const { globalPlayerData,
        dispatchGlobalPlayerData
    } = useContext(GameContext) as GameContextProps
    const navigation = useNavigation<AllScreenNavProps>()
    const route = useRoute<RouteProp<StartMenuStackParamList, 'ColorSelector'>>()
    const filteredColors = Object.entries(ColorLibrary).filter(([key, value]) => value !== route.params.currentColor)
    const chunk = 4
    const totalChunks = Math.ceil(filteredColors.length / chunk)
    const chunkedColors = [...Array(totalChunks)].map((_) => filteredColors.splice(0, chunk))
    const rows = chunkedColors.length
    const squareWidth = 100 / chunk

    /*
    will set primary color if colorPosition is primary color, same for secondary (route.params.colorPosition)
    navigation will navigate back with oposite colorPosition from spread context state
    and adding selected colorPosition and new color selected to route params passed.
    */
    const colorPress = (color: string) => {
        dispatchGlobalPlayerData({
            field: 'colors',
            subField: route.params.colorPosition,
            value: color,
            playerID: route.params.playerID
        })

        navigation.navigate('ColorMenu', {
            playerID: route.params.playerID,
            ...globalPlayerData[route.params.playerID].colors,
            [route.params.colorPosition]: color
        })
    }

    return (
        <View style={styles.container}>
            {
                chunkedColors.map((colorsArr, i) => {
                    return <View key={`color array ${i}`} style={[styles.color_row, {
                        height: `${80 / rows}%`
                    }]}>
                        {colorsArr.map(color => {
                            return <TouchableOpacity key={color[0]} style={[styles.color_touch, {
                                width: `${squareWidth}%`
                            }]}
                                onPress={() => colorPress(color[1])}
                            >
                                <View style={[styles.color_square, {
                                    backgroundColor: color[1]
                                }]}></View>
                            </TouchableOpacity>
                        })}
                    </View>
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
    },
    color_row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 5
    },
    color_touch: {
        height: '80%',
    },
    color_square: {
        height: '80%',
        width: '80%',
        borderColor: 'white',
        borderWidth: .5,
        borderRadius: 5
    },
    fade_container: {
        height: '20%',
        width: '100%',
        bottom: 0,
    }
})

export default ColorSelector