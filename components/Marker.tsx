import React, { useEffect } from 'react';
import { GestureResponderEvent, View, StyleSheet, } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
interface MarkerProps {
    x: number,
    y: number,
    radius: number,
    moveDelay: number,
    touchResponse?: (event: GestureResponderEvent) => void
}

/*
Can't migrate to Animated API because it runs on JS thread and drops frames,
reanimated is potential bloat, but useDerivedValue causes smooth animations along x/y change.
*/
const Marker: React.FC<MarkerProps> = ({ x, y, radius, moveDelay, touchResponse }) => {
    const endScale = useSharedValue(0)
    const translateX = useDerivedValue<number>(() => { return x })
    const translateY = useDerivedValue<number>(() => { return y })

    useEffect(() => {
        endScale.value = withRepeat(withTiming(1, {
            duration: 500,
        }), -1, true)
    }, [])
    
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

    const pulseStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: withTiming(endScale.value, {
                    duration: 500,
                    easing: Easing.linear
                }),
            }]
        }
    })

    return (
        <Animated.View key="pulse_container"
            accessibilityLabel="Room Marker"
            onTouchEnd={(e) => touchResponse && touchResponse(e)}
            style={[styles.pulse_container, containerMoveStyle,
            {
                height: radius * 2,
                width: radius * 2,
                pointerEvents: touchResponse ? 'auto' : "none"//allow touches to pass through to the PanResponder in Dungeon.tsx
            },
            ]}>
            <Animated.View key="pulse_outter" style={[styles.pulse_outter, pulseStyle]}>
                <View key="pulse_inner" style={styles.pulse_inner}></View>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    pulse_container: {
        position: 'absolute',
        top: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    pulse_inner: {
        borderRadius: 50,
        backgroundColor: "rgba(62, 182, 247,0.5)",
        height: "100%",
        width: "100%",
        borderColor: "rgba(262, 182, 247,0.5)",
        shadowColor: 'rgba(62, 182, 247,0.5)',
        shadowRadius: 20,
        zIndex: 1
    },
    pulse_outter: {
        width: "70%",
        height: "70%",
        borderRadius: 50,
        borderColor: "rgba(62, 182, 247,0.5)",
        shadowColor: 'rgba(62, 182, 247,0.5)',
        borderWidth: 2,
        shadowRadius: 20,
        shadowOpacity: 1,
        zIndex: 1
    }
})

export default Marker