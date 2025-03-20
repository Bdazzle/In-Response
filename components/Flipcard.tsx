import React, { useEffect, useRef } from "react";
import { StyleSheet, ImageSourcePropType, Pressable, View, Image, Dimensions, StyleProp, ViewStyle, AccessibilityInfo } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import iconData from "../images/staticResources";

interface FlipCardProps {
    front: ImageSourcePropType,
    back: ImageSourcePropType,
    onLayout?: ({ width, height }: { width: number, height: number }) => void,
    onFlip?: () => void,
    altFront?: string,
    altBack?: string,
    initialFlipVal? : 0 | 1,
    buttonStyle?: StyleProp<ViewStyle>;
}

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const FlipCard: React.FC<FlipCardProps> = ({ front, back, onLayout, onFlip, altFront, altBack, initialFlipVal, buttonStyle }) => {
    const flipVal = useSharedValue(0)
    const imageRef = useRef<Image>(null)

    const frontAnimatedStyle = useAnimatedStyle(() => {
        /*Front card spins from 0 - 180 degrees*/
        
        const frontSpin = interpolate(flipVal.value, [0, 1], [0, 180])
        return {
            transform: [
                {
                    rotateY: withTiming(`${frontSpin}deg`, { duration: 200 })
                }
            ]
        }
    })

    const backAnimatedStyle = useAnimatedStyle(() => {
        /*Back card spins from 180 to 360*/
        const backSpin = interpolate(flipVal.value, [0, 1], [180, 360])
        return {
            transform: [
                {
                    rotateY: withTiming(`${backSpin}deg`, { duration: 200 })
                }
            ]
        }
    })

    const flipCard = () => {
        flipVal.value = flipVal.value ? 0 : 1;
        onFlip && onFlip();
        (altFront && altBack ) && AccessibilityInfo.announceForAccessibility(flipVal.value === 0 ? altBack : altFront);
    }

    useEffect(() =>{
        if(initialFlipVal){
            flipVal.value = initialFlipVal
        }
    },[initialFlipVal])

    const handleImageLayout = () => {
        /*
        checks to see if image is bigger than device,
        then scales it down, 
        and passes dimensions to parent to create overlay based on them.
        */
        if (imageRef.current) {
            const { height, width } = Image.resolveAssetSource(front)
            let imageWidth, imageHeight;

            const widthRatio = width / screenWidth;
            const heightRatio = height / screenHeight;

            if (widthRatio > heightRatio) {
                imageWidth = screenWidth;
                imageHeight = height / widthRatio;
            } else {
                imageWidth = width / heightRatio;
                imageHeight = screenHeight;
            }
            onLayout && onLayout({ width : imageWidth, height : imageHeight });
        }
    };

    return (
        <View testID="flip-card-container"
            style={styles.flipcardContainer}>
            <View testID='flip-card-wrapper'
                style={styles.flipcardWrapper}>
                {/* Front */}
                <Animated.View testID='front-wrapper'
                    style={[frontAnimatedStyle, styles.frontWrapper]}
                >
                    <Image testID="front-image"
                        source={front}
                        ref={imageRef}
                        onLayout={() => handleImageLayout()}
                        style={styles.frontImage}
                        alt={altFront}
                        accessibilityLiveRegion="polite"
                    />
                </Animated.View>
                {/* Back */}
                <Animated.View testID='back-wrapper'
                    style={[backAnimatedStyle, styles.backWrapper]}
                >
                    <Image
                        testID="back-image"
                        source={back}
                        style={styles.backImage}
                        alt={altBack}
                        accessibilityLiveRegion="polite"
                    />
                </Animated.View>

            </View>
            <Pressable testID="flip-button"
                onPress={() => flipCard()}
                style={buttonStyle ?? styles.flipButton}
                accessibilityHint="flip card"
                accessibilityRole="button"
            >
                {iconData['flip']}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    flipcardContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipcardWrapper: {
        alignItems: 'center',
        width:'100%',
        height:'100%',
    },
    frontWrapper: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
    },
    frontImage: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
    },
    backWrapper: {
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        justifyContent: 'center',
        position: 'absolute',
    },
    backImage: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
    },
    flipButton: {
        borderColor: 'white',
        borderRadius: 50,
        borderWidth: 1,
        maxWidth: 80,
        maxHeight: 78,
        width:'22%',
        height:'15%',
        zIndex: 10,
        backgroundColor: 'black',
        bottom:'5%',
        position: 'absolute'
    }
})

export default FlipCard

