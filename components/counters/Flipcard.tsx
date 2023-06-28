import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, ImageSourcePropType, Pressable, View, Image, Dimensions, useWindowDimensions, DimensionValue } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { iconData } from "../../reducers/imageResources";


interface FlipCardProps {
    front: ImageSourcePropType,
    back: ImageSourcePropType,
    // frontUri: string,
    // backUri: string
    onLayout?: ({ width, height }: { width: number, height: number }) => void,
    onFlip?: () => void,
    altFront?: string,
    altBack?: string,
}

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const FlipCard: React.FC<FlipCardProps> = ({ front, back, onLayout, onFlip, altFront, altBack }) => {
    const flipVal = useSharedValue(0)
    const imageRef = useRef<Image>(null)
    const backRef = useRef<Image>(null)
    const [scaledDimensions, setScaledDimensions] = useState<{width: DimensionValue, height: DimensionValue}>()

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
        flipVal.value = flipVal.value ? 0 : 1
        onFlip && onFlip()
    }

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
            setScaledDimensions({width : imageWidth, height: imageHeight })
        }
    };

    return (
        <View testID="flip-card-container"
            style={styles.flipcardContainer}>
            <View testID='flip-card-wrapper'
                style={[styles.flipcardWrapper, scaledDimensions && {
                    height: scaledDimensions.height,
                    width: scaledDimensions.width
                } ]}>
                {/* Front */}
                <Animated.View testID='front-wrapper'
                    style={[frontAnimatedStyle, styles.frontWrapper]}
                // accessibilityLabel={altFront}
                >
                    <Image testID="front-image"
                        source={require('../../assets/cards/the_ring.png')}
                        ref={imageRef}
                        onLayout={() => handleImageLayout()}
                        style={styles.frontImage}
                        alt={altFront}
                    // accessibilityLabel={altFront}
                    />
                </Animated.View>
                {/* Back */}
                <Animated.View testID='back-wrapper'
                    style={[backAnimatedStyle, styles.backWrapper]}
                >
                    <Image
                        ref={backRef}
                        testID="back-image"
                        source={back}
                        style={styles.backImage}
                        alt={altBack}
                    />
                </Animated.View>

            </View>
            <Pressable testID="flip-button"
                onPress={() => flipCard()}
                style={styles.flipButton}
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
        width: 80,
        height: 78,
        zIndex: 50,
        backgroundColor: 'black',
        bottom: 0,
        position: 'absolute'
    }
})

export default FlipCard

