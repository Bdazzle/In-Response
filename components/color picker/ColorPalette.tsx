import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { GestureResponderEvent, LayoutChangeEvent, LayoutRectangle, Pressable, PressableProps, StyleSheet, useWindowDimensions, View } from "react-native"
import Animated, { Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, {
    Defs, Rect, Stop,
    LinearGradient
} from "react-native-svg"
import { HSLAVals } from "../.."
import { useDebounce } from "../../hooks/useDebounce";
import convertCoordinatesToHSB, { brightnessToLightness, colorValToPercent, convertHSLToCoordinates } from "./colorCalculations";

interface ColorPaletteParams {
    initialColor: HSLAVals,
    initialHue: number,
    onColorPress?: (vals: Pick<HSLAVals, 'saturation' | 'lightness'>) => void;
}

type Measurements = {
    width: number,
    height: number,
    pageX: number,
    pageY: number,
    x: number,
    y: number
}

interface PaletteMarkerProps {
    x: number,
    y: number,
    moveDelay: number,
    // paletteDimensions: Measurements
    // paletteDimensions: LayoutRectangle
}

const PaletteMarker: React.FC<PaletteMarkerProps> = ({ x, y, moveDelay }) => {
    const translateX = useDerivedValue<number>(() => { return x });
    const translateY = useDerivedValue<number>(() => { return y });
    // const translateX = useDerivedValue<number>(() => { return paletteDimensions.x });
    // const translateY = useDerivedValue<number>(() => { return paletteDimensions.y });
    // const translateX = useSharedValue<number>(x);
    // const translateY = useSharedValue<number>(y);
    const radius = 20;// 1/2 width or height from styles.
    // console.log('marker x/y',x,y)
    /*
    if translateX < palette pageX, translateX should be pageX,
    if translateX > palette pageX, translateX should be pageX + pallete width,
    if translateY < palette pageY, translateY should be pageY,
    if translateY > palette pageY, translateY should be pageY + pallete height,
    */
    // useEffect(() => {
    //     if (translateX.value < paletteDimensions.pageX) {
    //         translateX.value = paletteDimensions.pageX
    //     }
    //     if (translateX.value > paletteDimensions.pageX) {
    //         translateX.value = paletteDimensions.pageX + paletteDimensions.height
    //     }
    // }, [translateX])

    // useEffect(() => {
    //     if (translateY.value < paletteDimensions.pageY) {
    //         translateY.value = paletteDimensions.pageY
    //     }
    //     if (translateY.value > paletteDimensions.pageY) {
    //         translateY.value = paletteDimensions.pageY + paletteDimensions.width
    //     }
    // }, [translateX])

    const containerMoveStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(translateX.value - radius,
                        {
                            duration: moveDelay,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        })
                },
                {
                    translateY: withTiming(translateY.value - radius,
                        {
                            duration: moveDelay,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        })
                }
            ]
        }
    })

    return (
        <Animated.View
            style={[containerMoveStyle, styles.markerStyle]}
        >
        </Animated.View>
    )
}

/*
#hueGradient is changing lightness and saturation too much.
Should be static while hue value changes?
*/
const ColorPalette: React.FC<ColorPaletteParams> = ({ initialColor, initialHue, onColorPress }) => {
    const [color, setColor] = useState<HSLAVals>()
    const [hue, setHue] = useState<number>()
    const [paletteDimensions, setPaletteDimensions] = useState<LayoutRectangle>()
    // const [paletteDimensions, setPaletteDimensions] = useState<Measurements>()
    const [markerCoordinate, setMarkerCoordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    // const debouncedMarker = useDebounce<{ x: number, y: number }>(markerCoordinate, 75);
    const palettePressRef = useRef<View>(null)
    // const lastPressedCoordinates = useRef({ x: 0, y: 0 });
    // const { width, height } = useWindowDimensions()

    useEffect(() => {
        // setColor(initialColor)
        // setHue(initialHue)
        if (color) {
            setColor({
                ...color,
                hue: initialHue
            })
        }
        else {
            setColor(initialColor)
        }
    }, [initialHue])

    useEffect(() => {
        setColor(initialColor)
    }, [])

    const getPaletteMeasurements = (event: LayoutChangeEvent) => {
        const { width, height, x, y } = event.nativeEvent.layout
        setPaletteDimensions({ width, height, x, y })
        /* 
        convert color values from percents to decimals for maths.
        */
        const initialMarkerCoords = convertHSLToCoordinates(initialColor.saturation / 100, initialColor.lightness / 100, width, height)
        setMarkerCoordinates(initialMarkerCoords)
    }

    /* 
    having marker View as child of Pressable was setting View "in front" of Pressable,
    preventing onPress or onTouchMove to fire, and reseting locationX and locationY to origin (0,0),
    and screwing up anything that refered to them. See Notes.
    */
    const handlePalettePress = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        if (paletteDimensions) {
            const [saturation, brightness] = convertCoordinatesToHSB(locationX, locationY, paletteDimensions!.width, paletteDimensions!.height)
            const lightness = brightnessToLightness(saturation, brightness)
            setMarkerCoordinates({ x: locationX, y: locationY })
            if (onColorPress) {
                onColorPress({
                    saturation: colorValToPercent(saturation),
                    lightness: colorValToPercent(lightness)
                })
            }
        }
    }

    const markerDrag = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        setMarkerCoordinates({ x: locationX, y: locationY })
    }

    // console.log(markerCoordinate)
    // console.log('palette color', color)
    // console.log('test', initialHue, initialColor)
    return (
        <View nativeID="color_palette_container" style={styles.container}>

            {color &&
                // <View nativeID="paletteTouchWraper" 
                
                // >
                    <Pressable
                        ref={palettePressRef}
                        nativeID="colorPalettePress"
                        accessibilityLabel="Color Gradient"
                        onLayout={(event) => getPaletteMeasurements(event)}
                        onPress={(event) => handlePalettePress(event)}
                        // onTouchMove={(e) => markerDrag(e)}
                    >
                        <Svg style={styles.paletteSVG}
                        >
                            <Defs>
                                <LinearGradient id="saturationGradient" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="white" stopOpacity="1" />
                                    <Stop offset="100%" stopColor="black" stopOpacity="0" />
                                </LinearGradient>
                                <LinearGradient id="hueGradient" x1="1" y1="1" x2="0" y2="1">
                                    <Stop offset="0%" stopColor={`hsla(${color.hue}, 100%, 50%, 1)`} stopOpacity="1" />
                                    <Stop offset="100%" stopColor="black" stopOpacity={0} />
                                    {/* <Stop offset="0%" stopColor={`hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${color.alpha})`} stopOpacity="1" /> */}
                                </LinearGradient>
                                <LinearGradient id="black" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor="black" stopOpacity={0} />
                                    <Stop offset="100%" stopColor="black" stopOpacity={1} />
                                </LinearGradient>
                            </Defs>
                            <Rect width="100%" height="100%" fill="url(#saturationGradient)" />
                            <Rect width="100%" height="100%" fill="url(#hueGradient)" />
                            <Rect width="100%" height="100%" fill="url(#black)" />
                        </Svg>
                    </Pressable>
                // </View>
            }
            <PaletteMarker
                x={markerCoordinate.x} y={markerCoordinate.y}
                moveDelay={20}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',

        borderColor: 'white',
        borderWidth: 1
    },
    paletteSVG: {
        width: '100%',
        height: '100%'
    },
    markerStyle: {
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 50,
        width: 40,
        height: 40,
        position: 'absolute',
        // zIndex: 10
    }
})

export default ColorPalette