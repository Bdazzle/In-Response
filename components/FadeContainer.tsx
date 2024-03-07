import { CSSProperties, useRef } from 'react';
import { Animated } from 'react-native';

interface FadeContainerProps {
    children: React.ReactNode
    style : CSSProperties,
}

const FadeContainer : React.FC<FadeContainerProps> = ({ children }, style ) =>{
    const opacityVal = useRef(new Animated.Value(0)).current

    const fadeInStyle = () =>{
        Animated.timing(opacityVal, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    return (
        <Animated.View 
        testID="FadeContainer"
        onLayout={() => fadeInStyle()}
        style={[style, {
            opacity: opacityVal
        }]} 
        >
            {children}
        </Animated.View>
    )
}

export default FadeContainer