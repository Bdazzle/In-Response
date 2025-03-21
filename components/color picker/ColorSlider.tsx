import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slider } from '@react-native-assets/slider';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { gradientColors } from '../../constants/Colors';

interface ColorSliderProps {
    initialHue: number,
    passHue: (hue: number) => void,
}

/* 
Color Slider controls only hue
*/
const ColorSlider: React.FC<ColorSliderProps> = ({ initialHue, passHue }) => {
    const [hue, setHue] = useState<number>(initialHue);

    const handleHueChange = (value: number) => {
        setHue(value);
        if(passHue && value){
            passHue(Math.round(hue))
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.gradientContainer} >
                <Svg style={styles.sliderGradient}>
                    <Defs>
                        <LinearGradient id='colorGradient' x1="0%" y1="0%" x2="100%" y2="0%"
                        >
                            {gradientColors.map((color, i) => {
                                return <Stop key={i}
                                    offset={`${(i / gradientColors.length) * 100}%`}
                                    stopColor={`hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`}
                                />
                            })}
                        </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#colorGradient)" />
                </Svg>
            </View>
                <Slider
                    style={styles.slider}
                    aria-label='Color slider'
                    accessibilityLabel="Color slider"
                    minimumValue={0}
                    maximumValue={360}
                    value={hue}
                    onValueChange={handleHueChange}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    slider: {
        marginTop: 16,
    },
    gradientContainer: {
        width: '100%',
        height: 20,
    },
    sliderGradient: {
        width: '100%',
        height: '100%',
        borderColor: 'white',
        borderWidth: 1
    }
});

export default ColorSlider;