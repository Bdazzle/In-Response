import React, { useRef } from "react";
import { StyleSheet, ImageSourcePropType, Pressable, View, Image } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { iconData } from "../../reducers/imageResources";


interface FlipCardProps {
    front: ImageSourcePropType,
    back: ImageSourcePropType,
    onLayout?: ({ width, height }: { width: number, height: number }) => void,
    onFlip?: () => void,
}

const FlipCard: React.FC<FlipCardProps> = ({ front, back, onLayout, onFlip }) => {
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
        flipVal.value = flipVal.value ? 0 : 1
        onFlip && onFlip()
    }

    const handleImageLayout = () => {
        if (imageRef.current) {
            imageRef.current.measure((x, y, width, height, pageX, pageY) => {
                onLayout && onLayout({ width, height });
            });
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
                    />
                </Animated.View>

            </View>
            <Pressable testID="flip-button"
                onPress={() => flipCard()}
                style={styles.flipButton}
            >
                {iconData['flip']}
                {/* <Svg viewBox={iconData['flip'].viewBox}>
                    {
                        iconData['flip'].pathData.map((p, i: number) => (<Path key={i} d={p.path} fill={p.fill} ></Path>))
                    }
                </Svg> */}
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
        width: '100%',
        height: '100%',
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
        bottom: '5%',
    }
})

export default FlipCard

