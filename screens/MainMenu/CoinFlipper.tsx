import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useEffect, useState } from "react"
import { Image, Text, KeyboardAvoidingView, Platform, StyleSheet, TextInput, Pressable, View, NativeSyntheticEvent, TextInputChangeEventData } from "react-native"
import Animated, { Easing, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated"
import { AllScreenNavProps } from "../.."
import { textScaler } from "../../functions/textScaler"
import Svg, { Path, Polygon } from "react-native-svg"

const Heads = () => {
    return (
        <Image style={styles.coin}
            source={require('../../assets/images/heads.png')} />
    )
}

const Tails = () => {
    return (

        <Image
            style={styles.coin}
            source={require('../../assets/images/tails.png')} />
    )
}

const CoinFlipper = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const [results, setResults] = useState<string[]>([])
    const [quantity, setQuantity] = useState<number>(1)

    const animationTime = 1200
    const zIndex = useSharedValue(0)
    const resultSpin = useSharedValue(0)
    const rotation = useDerivedValue(() => {
        return interpolate(resultSpin.value,
            [0, 180],
            [0, 180]
        )
    })

    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateX: withTiming(`${rotation.value}deg`, {
                        duration: animationTime,
                        easing: Easing.linear
                    })
                }
            ],
        }
    })

    const zStyle = useAnimatedStyle(() => {
        return {
            zIndex: withTiming(zIndex.value, {
                duration: animationTime,
                easing: Easing.linear
            })
        }
    })

    const handleBack = () => {
        navigation.navigate('MainMenu')
    }

    const changeQuantity = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setQuantity(Number(event.nativeEvent.text))
    }

    /*
    set a flip start variable, like a Loading variable?
    */
    const handleFlip = () => {
        zIndex.value = 0
        const result = [...Array(quantity)].map((_, i) => Math.random() < 0.5 ? "Heads" : "Tails")
        setResults(results => [...result])
        resultSpin.value = 1800
        if (result[0] === 'Tails') zIndex.value = withDelay(animationTime, withTiming(1))
    }

    /*
    reset resultSpin.value
    */
    useEffect(() => {
        setTimeout(() => resultSpin.value = 0, 1200)
    }, [results])

    return (
        <View style={styles.flipper_container}>
            {/* Back Button */}
            <Pressable style={styles.back_button}
                onPressIn={() => handleBack()}
            >
                <Svg viewBox="0 0 800 800" style={{
                    width: 60,
                    height: 60,
                    transform: [
                        { rotate: '180deg' }
                    ]
                }}>
                    <Path d="M206.78,341.58v-47.04l-81.44,47.04V153.42l81.44,47.04v-47.04l40.72,23.52V0   C110.81,0,0,110.81,0,247.5S110.81,495,247.5,495V318.06L206.78,341.58z"
                        fill={"#6D2C93"}
                    />
                    <Path d="M247.5,0v176.94l122.16,70.56L247.5,318.06V495C384.19,495,495,384.19,495,247.5S384.19,0,247.5,0z"
                        fill={"#3D1952"}
                    />
                    <Polygon points={"125.34,247.5 125.34,341.58 206.78,294.54 206.78,341.58 247.5,318.06 369.66,247.5  "}
                        fill={"#9CDD05"}
                    />
                    <Polygon points={"206.78,200.46 125.34,153.42 125.34,247.5 369.66,247.5 247.5,176.94 206.78,153.42  "}
                        fill={"#B2FA09"}
                    />
                </Svg>
            </Pressable>

            {/* Flip Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.input_wrapper}
            >
                <Text style={styles.all_text}>How many flips?</Text>

                <Pressable style={styles.input_touch}>
                    <TextInput style={[styles.input_text, styles.all_text]}
                        defaultValue={`${quantity}`}
                        keyboardType='numeric'
                        onChange={(e) => changeQuantity(e)}
                    ></TextInput>
                </Pressable>
            </KeyboardAvoidingView>

            {/* Coins/flip button */}
            <Animated.View style={styles.coins_container}>
                <Pressable style={styles.coin_button}
                    onPressIn={() => handleFlip()}
                >
                    <View style={{
                        height: '100%'
                    }}>

                        <Animated.View
                            style={[styles.tails_wrapper, rotateStyle, zStyle]}
                        >
                            <Tails />
                        </Animated.View>
                        <Animated.View style={[styles.heads_wrapper, rotateStyle]}>
                            <Heads />
                        </Animated.View>
                    </View>
                </Pressable>
            </Animated.View>

            <Text style={[styles.all_text, {
                paddingTop: '15%',
            }]}>{results.join(', ')}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    flipper_container: {
        overflow: "hidden",
        height: "100%",
        width: "100%",
        backgroundColor: "#753BA5",
        justifyContent: 'center',
    },
    back_button: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 60,
        height: 60,
    },
    input_wrapper: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        top: 10,
    },
    input_touch: {
        width: '20%',
        alignContent: 'center',
        justifyContent: 'center',
    },
    input_text: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
    },
    all_text: {
        fontSize: textScaler(24),
        textAlign: 'center',
        color: 'white',
        fontFamily: "Beleren"
    },
    coins_container: {
        height: '50%',
        width: '90%',
        marginLeft: '5%',
        top: '5%',
    },
    coin_button: {
        height: '10%',
    },
    coin:{
        resizeMode: 'contain',
        width: '100%',
        height: '100%'
    },
    heads_wrapper: {
        position: 'absolute',
        height: 257,
        width: '100%',
        backfaceVisibility: 'hidden',
    },
    tails_wrapper: {
        position: 'absolute',
        height: 250,
        width: '100%',
    },
    heads: {
        backgroundColor: "#EFC75E",
        borderRadius: 500
    }
})

export default CoinFlipper