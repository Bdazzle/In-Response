import { CSSProperties } from 'react';
import Animated, { useAnimatedStyle, withTiming, Easing, useSharedValue, useDerivedValue } from 'react-native-reanimated';

interface FadeContainerProps {
    style : CSSProperties
}

const FadeContainer : React.FC<FadeContainerProps> = ({ children }, style ) =>{
    const opacityVal = useSharedValue(0)

    const fadeInStyle = useAnimatedStyle(() => {
        return {
            opacity : withTiming(opacityVal.value, {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            })
        }
    })
    return (
        <Animated.View 
        testID="FadeContainer"
        onLayout={() => opacityVal.value = 1 }
        style={[style, fadeInStyle]} >
            {children}
        </Animated.View>
    )
}

export default FadeContainer