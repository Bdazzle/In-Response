import { useRef } from "react"
import { Animated } from "react-native"


const useFadeDownAnimation = () => {
    const opacityVal = useRef(new Animated.Value(0)).current;
    const zIndexVal = useRef<Animated.Value>(new Animated.Value(0)).current;
    const translateYVal = useRef<Animated.Value>(new Animated.Value(-40)).current;

    const fadeStyle = (opacity: number, z: number, y : number, duration: number) =>{
        Animated.parallel([
            Animated.timing(opacityVal, {
                toValue: opacity,
                duration: duration ,
                useNativeDriver: true
            }),
            Animated.timing(zIndexVal, {
                toValue: z,
                duration: duration,
                useNativeDriver: true
            }),
            Animated.timing(translateYVal, {
                toValue: y, //0 moves to the original position (top to bottom)
                duration: duration ,
                useNativeDriver: true,
              }),
        ]).start()
    }
   
    return { opacityVal, zIndexVal, translateYVal, fadeStyle }
}

export default useFadeDownAnimation;