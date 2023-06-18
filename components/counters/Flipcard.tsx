import { stringifyQuery } from "next/dist/server/server-route-utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ImageSourcePropType, Pressable, View, Image, useWindowDimensions, LayoutChangeEvent } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { OptionsContext } from "../../OptionsContext";
import { iconData, ShapeData } from "../../reducers/imageResources";


interface FlipCardProps {
    front: ImageSourcePropType,
    back: ImageSourcePropType,
    onLayout?: ({ width, height }: { width: number, height: number }) => void,
}

const FlipCard: React.FC<FlipCardProps> = ({ front, back, onLayout }) => {
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
    }

    const handleImageLayout = () => {
        if (imageRef.current) {
          imageRef.current.measure((x, y, width, height, pageX, pageY) => {
            onLayout && onLayout({ width, height });
          });
        }
      };

    return (
        <View style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View testID='flip-card-container'
                style={{
                    width: '100%',
                    // width:imageDimensions!.width,
                    height: '100%',
                    alignItems: 'center',

                    // borderColor: 'white',
                    // borderWidth: 1,
                }}>
                {/* Front */}
                <Animated.View testID='flip-wrapper'
                    style={[frontAnimatedStyle, {
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        backfaceVisibility: 'hidden',

                    //    width: width > imageDimensions!.width ? imageDimensions?.width : '100%',
                        // width: imageDimensions?.width,
                        // flex:1,
                        // alignItems:'center',
                        // justifyContent:'center',
                        // borderColor: 'white',
                        // borderWidth: 1,
                    }]}
                >
                    <Image source={front}
                    ref={imageRef}
                        // onLayout={(e) => getImageSize(e)}
                        onLayout={() => handleImageLayout()}
                        style={{
                            // resizeMode: deviceType === 'phone' ? 'contain' : 'stretch',
                            // resizeMode:'cover',
                            resizeMode: 'contain',
                            // width: width > imageDimensions!.width ? imageDimensions?.width : '100%',
                            width: '100%',
                            // height:'100%',

                            
                            // width:width * .8,
                            // aspectRatio: 1

                            // borderColor: 'white',
                            // borderWidth: 1,
                        }}
                    />
                </Animated.View>
                {/* Back */}
                <Animated.View testID='flip-wrapper'
                    style={[backAnimatedStyle, {
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        justifyContent: 'center',
                        position: 'absolute',
                    }]}
                >
                    <Image source={back}
                        // onLayout={(e) => getImageSize(e)}
                        style={{
                            resizeMode: 'contain',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </Animated.View>

            </View>
            <Pressable
                onPress={() => flipCard()}
                style={{
                    borderColor: 'white',
                    borderRadius: 50,
                    borderWidth: 1,
                    width: 50,
                    height: 48,
                    zIndex: 50,
                    backgroundColor: 'black',
                    // marginBottom: -30,
                    position: 'absolute',
                    bottom: 0,
                }}
            >
                <Svg viewBox={iconData['flip'].viewBox}>
                    {
                        iconData['flip'].pathData.map((p, i: number) => (<Path key={i} d={p.path} fill={p.fill} ></Path>))
                    }
                </Svg>
            </Pressable>
        </View>
    )
}

export default FlipCard

{/* <View style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View testID='flip-card-container'
                    style={{
                        width: '100%',
                        height: '100%',
                        alignItems:'center'
                        // borderColor: 'white',
                        // borderWidth: 1,
                    }}>
                    <Animated.View testID='flip-wrapper'
                        style={[frontAnimatedStyle, {
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            backfaceVisibility: 'hidden',
                            // borderColor: 'white',
                            // borderWidth: 1,
                        }]}
                    >
                        <Image source={imageSource.front}
                            onLayout={(e) => getImageSize(e)}
                            style={{
                                resizeMode: 'contain',
                                width: '100%',
                            }}
                        />
                    </Animated.View>

                    <Animated.View testID='flip-wrapper'
                        style={[backAnimatedStyle, {
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            // borderColor: 'white',
                            // borderWidth: 1,
                            justifyContent: 'center',
                            position:'absolute',
                        }]}
                    >
                        <Image source={imageSource.back}
                            onLayout={(e) => getImageSize(e)}
                            style={{
                                resizeMode: 'contain',
                                // resizeMode: 'cover',
                                // margin: 0,
                                width: '100%',

                            }}
                        />
                    </Animated.View>
                    <Pressable
                        onPress={() => flipCard()}
                        style={{
                            borderColor: 'white',
                            borderRadius: 50,
                            borderWidth: 1,
                            width: 50,
                            height: 48,
                            zIndex: 50,
                            backgroundColor: 'black',
                            // marginBottom: -30,
                            position: 'absolute',
                            bottom: 0,
                        }}
                    >
                        <Svg viewBox={iconData['flip'].viewBox}>
                            {
                                iconData['flip'].pathData.map((p, i: number) => (<Path key={i} d={p.path} fill={p.fill} ></Path>))
                            }
                        </Svg>
                    </Pressable>
                </View>
            </View> */}