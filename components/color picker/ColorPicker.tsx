import React, { useEffect, useState } from "react"
import { HSLAVals } from "../..";
import ColorSlider from "./ColorSlider";
import { StyleSheet, View } from "react-native";
import ColorPalette from "./ColorPalette";

export interface ColorPickerProps {
    onColorChange?: (color: HSLAVals) => void;
    initialColor: HSLAVals
}
/* 
Color Slider will select hue (color).
Color Palette will select saturation and lightness
*/
const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange, initialColor }) => {
    const [color, setColor] = useState<HSLAVals>(initialColor)
    const [hue, setHue] = useState<number>(Number(initialColor?.hue))

    useEffect(() => {
        if (color !== undefined && onColorChange) {
            onColorChange(color)
        }
    }, [color])

    const getColorFromHue = (hue : number) =>{
        setHue(hue)
        setColor({
            ...initialColor as HSLAVals,
            hue: hue
        })
    }

    const getColorFromPalette = (val: Pick<HSLAVals, 'saturation' | 'lightness'>) =>{
        const { saturation, lightness } = val
        setColor({
            ...color,
            saturation, 
            lightness, 
            alpha : 1 
        } as HSLAVals)
    }
    
    return (
        <View style={styles.colorComponentsContainer}>
            <View style={styles.swatchContainer}>
                <ColorPalette initialColor={color !== undefined ? color as HSLAVals : initialColor as HSLAVals} 
                onColorPress={getColorFromPalette}
                initialHue={hue}
                />
            </View>
            <View style={styles.sliderContainer}>
                { color && <ColorSlider initialHue={color.hue as number} passHue={getColorFromHue} /> }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    colorComponentsContainer: {
        height: '60%',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    swatchContainer: {
        width: '80%',
        maxHeight:200
    },
    sliderContainer:{
        width:'100%',
        height:20
    }
})

export default ColorPicker