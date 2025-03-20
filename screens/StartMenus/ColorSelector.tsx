import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react"
import { StyleSheet, View, Pressable, Text } from "react-native"
import { AllScreenNavProps, ColorTheme, HSLAVals } from "../..";
import { GameContext, GameContextProps } from "../../GameContext";
import { StartMenuStackParamList } from "../../navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorPicker from "../../components/color picker/ColorPicker";
import deriveHSLAValues from "../../components/color picker/convertColorTypes";

export interface ColorSelectorProps {
    playerID: number;
    currentColor: string;
    themePosition: string //primary or secondary color, text or background
}

const ColorSelector: React.FC = ({ }) => {
    const { globalPlayerData,
        dispatchGlobalPlayerData
    } = useContext(GameContext) as GameContextProps
    const navigation = useNavigation<AllScreenNavProps>()
    const route = useRoute<RouteProp<StartMenuStackParamList, 'ColorSelector'>>()
    const [color, setColor] = useState<HSLAVals>()
    const [colorString, setColorString] = useState<string>(globalPlayerData[route.params.playerID].colors[route.params.themePosition as keyof ColorTheme]);

    const saveColors = async (val: string) => {
        try {
            await AsyncStorage.setItem(`${String(route.params.playerID)} colors`, JSON.stringify({ ...globalPlayerData[route.params.playerID].colors, [route.params.themePosition]: val }))
            // console.log('new saved colors', JSON.stringify({...globalPlayerData[route.params.playerID].colors, [route.params.themePosition] : val}))
        }
        catch (e) {
            console.log(`error saving colors`, e)
        }
    }

    /*
    will set primary color if themePosition is primary color, same for secondary (route.params.themePosition)
    navigation will navigate back with oposite themePosition from spread context state
    and adding selected themePosition and new color selected to route params passed.
    */
    const handleColorAccept = () => {
        dispatchGlobalPlayerData({
            field: 'colors',
            subField: route.params.themePosition,
            value: colorString,
            playerID: route.params.playerID
        })

        saveColors(colorString)

        navigation.navigate('ColorMenu', {
            playerID: route.params.playerID,
            ...globalPlayerData[route.params.playerID].colors,
            [route.params.themePosition]: colorString
        })
    }

    const handleColorChange = (color: HSLAVals) => {
        setColor(color)
        setColorString(`hsla(${color.hue},${color.saturation}%, ${color.lightness}%, ${color.alpha})`)
    }

return (
        <View style={styles().container}>
            <View nativeID="saveColorWrapper"
                style={route.params.themePosition === 'primary' ? 
                styles(color).saveColorWrapper : 
                styles(deriveHSLAValues(globalPlayerData[route.params.playerID].colors.primary) as HSLAVals).saveColorWrapper}
            >
                <Pressable
                    nativeID="save_color"
                    accessibilityRole="button"
                    accessibilityLabel="Save Color"
                    style={styles().saveColorPress}
                    onPress={() => handleColorAccept()}
                >
                    <Text style={route.params.themePosition === 'secondary' ? 
                    styles(color).saveColorText : 
                    styles(deriveHSLAValues(globalPlayerData[route.params.playerID].colors.secondary) as HSLAVals).saveColorText}>
                        Save Color
                    </Text>
                </Pressable>
            </View>
            <ColorPicker onColorChange={handleColorChange}
                initialColor={deriveHSLAValues(globalPlayerData[route.params.playerID].colors[route.params.themePosition as keyof ColorTheme]) as HSLAVals}
            />
        </View>
    )
}

const styles = (color?: HSLAVals) => StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    saveColorWrapper: {
        height: 50,
        width: '40%',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color && `hsla(${color.hue},${color.saturation}%, ${color.lightness}%, ${color.alpha})`,
    },
    saveColorPress:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 50,
    },
    saveColorText: {
        color: color && `hsla(${color.hue},${color.saturation}%, ${color.lightness}%, ${color.alpha})`,
    }
})

export default ColorSelector