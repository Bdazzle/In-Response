import React, { useCallback, useEffect, useRef, useState } from "react"
import { GestureResponderEvent, Pressable, StyleSheet, View } from "react-native"
import Animated, { Easing, useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated";
import Svg, {
    Defs, Rect, Stop,
    LinearGradient
} from "react-native-svg"
import { HSLAVals } from "../.."
import convertCoordinatesToHSB, { brightnessToLightness, colorValToPercent, convertHSLToCoordinates } from "./colorCalculations";

interface ColorPaletteParams {
    initialColor: HSLAVals,
    initialHue: number,
    onColorPress?: (vals: Pick<HSLAVals, 'saturation' | 'lightness'>) => void;
}

type Measurements = {
    x: number,
    y: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number,
}

interface PaletteMarkerProps {
    x: number,
    y: number,
    moveDelay: number,
}

/* 
for Pressable coordinate calculations
take the pageX and Y, subtract palletRef.current.measure() pageX and pageY (the offsets)
*/
const normalizeCoords = (x: number, y: number, pageOffsetX: number, pageOffsetY: number, maxX: number, maxY: number) => {
    const adjustedX = x - pageOffsetX <= 0 ? 0
        : x - pageOffsetX > maxX ? maxX
            : x - pageOffsetX
    const adjustedY = y - pageOffsetY <= 0 ? 0
        : y - pageOffsetY > maxY ? maxY
            : y - pageOffsetY
    return { x: adjustedX, y: adjustedY }
}

const PaletteMarker: React.FC<PaletteMarkerProps> = ({ x, y, moveDelay }) => {
    const translateX = useDerivedValue<number>(() => { return x });
    const translateY = useDerivedValue<number>(() => { return y });
    const radius = 20;// 1/2 width or height from styles.

    const markerMoveStyle = useAnimatedStyle(() => {
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
            style={[markerMoveStyle, styles.markerStyle]}
        >
        </Animated.View>
    )
}

/**
 * Pressable > PanHandler since Panhandler keep setting Y value to maximum if dragged x/y locations go out of palette box.
 * And pressable allows marker to keep moving if someone traces finger on the outside of the palette,
 * so better visibility for color selection.
 * @param param0 
 * @returns 
 */
const ColorPalette: React.FC<ColorPaletteParams> = ({ initialColor, initialHue, onColorPress }) => {
    const [color, setColor] = useState<HSLAVals>()
    const [markerCoordinate, setMarkerCoordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const palettePressRef = useRef<View>(null)
    const paletteMeasurementsRef = useRef<Measurements>()

    const getPaletteMeasurements = useCallback(() => {
        palettePressRef.current?.measure((x, y, width, height, pageX, pageY) => {
            paletteMeasurementsRef.current = { x, y, width, height, pageX, pageY };
            const initialMarkerCoords = convertHSLToCoordinates(initialColor.saturation / 100,
                initialColor.lightness / 100,
                width,
                height
            )
            setMarkerCoordinates(initialMarkerCoords)
        });
    }, []);

    useEffect(() => {
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

    /* 
    having marker View as child of Pressable was setting View "in front" of Pressable,
    preventing onPress or onTouchMove to fire, and reseting locationX and locationY to origin (0,0),
    and screwing up anything that refered to them. See Notes.
    Have to use pageX and Y
    */
    /**
     * Code for Pressable Palette. Keep in case PanGesture is bad. 
     * @param pageX 
     * @param pageY 
     */
    const markerDrag = (event: GestureResponderEvent) => {
        const { pageX, pageY } = event.nativeEvent;
        if (paletteMeasurementsRef.current) {
            const { x, y } = normalizeCoords(pageX, pageY, paletteMeasurementsRef.current.pageX, paletteMeasurementsRef.current.pageY, paletteMeasurementsRef.current.width, paletteMeasurementsRef.current.height)

            const [saturation, brightness] = convertCoordinatesToHSB(x, y, paletteMeasurementsRef.current!.width, paletteMeasurementsRef.current!.height)
            const lightness = brightnessToLightness(saturation, brightness)

            setMarkerCoordinates({ x, y })

            if (onColorPress) {
                onColorPress({
                    saturation: colorValToPercent(saturation),
                    lightness: colorValToPercent(lightness)
                })
            }
        }
    }

    return (
        <View nativeID="color_palette_container" style={styles.container} >
            {color &&
                <Pressable
                    ref={palettePressRef}
                    onLayout={() => getPaletteMeasurements()}
                    nativeID="colorPalettePress"
                    accessibilityLabel="Color Gradient"
                    accessibilityRole="adjustable"
                    onTouchMove={(e) => markerDrag(e)}
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
        height: '100%',
    },
    markerStyle: {
        pointerEvents: 'none',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 50,
        width: 40,
        height: 40,
        position: 'absolute',
    }
})

export default ColorPalette