import React, { useContext, useEffect, useState } from "react"
import { GameContext, GameContextProps } from "../../GameContext";
import { HSLAVals } from "../..";
import ColorSlider from "./ColorSlider";
import { StyleSheet, View } from "react-native";
import ColorPalette from "./ColorPalette";

export interface ColorPickerProps {
    onColorChange?: (color: HSLAVals) => void;
    initialColor?: HSLAVals
}
/* 
Color Slider will select hue (color).
Color Palette will select saturation and lightness
*/
const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange, initialColor }) => {
    // const { globalPlayerData,
    //     dispatchGlobalPlayerData
    // } = useContext(GameContext) as GameContextProps
    // const [savedColor, setSavedColor] = useState<HSLAVals>()
    const [color, setColor] = useState<HSLAVals>()
    const [hue, setHue] = useState<number>(Number(initialColor?.hue))

    useEffect(() => {
        if (color !== undefined && onColorChange) {
            onColorChange(color)
        }
    }, [color])

    useEffect(() => {
        setColor(initialColor as HSLAVals)
    }, [])

    const getColorFromHue = (hue : number) =>{
        setHue(hue)
        setColor({
            ...initialColor as HSLAVals,
            hue: hue
        })
        // if(!initialColor?.lightness || !initialColor.saturation){
        //     setColor({
        //         hue: hue,
        //         saturation: 100,
        //         lightness: 50,
        //         alpha:1
        //     })
        // } else {
        //     setColor({
        //         hue: hue,
        //         saturation: initialColor.saturation,
        //         lightness: initialColor.lightness,
        //         alpha:1
        //     })
        // }
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

    // console.log(color)
    
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
        // width: 200,
        // height: 200,

        width: '80%',
        height: 200,

        // borderColor: 'white',
        // borderWidth: 1
    },
    // colorPreview:{
    //     height:100,
    //     width:100,
    //     borderRadius: 50,
    //     backgroundColor:color && `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${color.alpha})`,
    // },
    sliderContainer:{
        width:'100%',
        height:20
    }
})

export default ColorPicker