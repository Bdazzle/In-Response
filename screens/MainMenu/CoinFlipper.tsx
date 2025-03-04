import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useContext, useEffect, useRef, useState } from "react"
import { Easing, Animated, Image, Text, KeyboardAvoidingView, Platform, StyleSheet, TextInput, Pressable, View, NativeSyntheticEvent, TextInputChangeEventData } from "react-native"
import { AllScreenNavProps } from "../.."
import { staticTextScaler } from "../../functions/textScaler"
import Svg, { Path, Polygon } from "react-native-svg"
import { GameContext } from "../../GameContext"

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
    const { globalPlayerData } = useContext(GameContext)
    const [results, setResults] = useState<string[]>([])
    const [quantity, setQuantity] = useState<number>(1)
    const animationTime = 1200
    const zIndex = useRef<Animated.Value>(new Animated.Value(0)).current
    const resultSpin = useRef<Animated.Value>(new Animated.Value(0)).current
    const rotation = resultSpin.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
      });
    
      const rotateStyle = {
        transform: [
          {
            rotateX: rotation, // Use the interpolated value directly
          },
        ],
      };

    const zStyle = {
        zIndex: zIndex
    }
    
    const handleBack = () => {
        Object.keys(globalPlayerData).length > 0 ? navigation.navigate('Game') : navigation.navigate('MainMenu')
    }

    const changeQuantity = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setQuantity(Number(event.nativeEvent.text))
    }

    /*
    set a flip start variable, like a Loading variable?
    */
    const handleFlip = () => {
        const result = [...Array(quantity)].map((_, i) => Math.random() < 0.5 ? "Heads" : "Tails")
        setResults(results => [...result])
        resultSpin.setValue(1800)
        if(result[0] === 'Tails'){
            Animated.timing(zIndex, {
                toValue: 1,
                duration: animationTime,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(zIndex, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            }).start()
        }
        
        Animated.timing(resultSpin, {
            toValue: 180, // Animate to 180 degrees
            duration: animationTime,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start();
    }

    /*
    reset resultSpin.value
    */
    useEffect(() => {
        setTimeout(() => resultSpin.setValue(0), animationTime)
    }, [results])

    return (
        <View style={styles.flipper_container}>
            {/* Back Button */}
            <Pressable style={styles.back_button}
                onPressIn={() => handleBack()}
                accessibilityLabel={Object.keys(globalPlayerData).length > 0 ? "Back to Game" : "back to main menu"}
            >
                <Svg viewBox="0 0 800 800" style={{
                    width: '100%',
                    height: '100%',
                    transform: [
                        { rotate: '180deg' }
                    ],
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
                <View style={styles.input_touch}>
                    <TextInput style={[styles.input_text, styles.all_text]}
                        nativeID="flips input"
                        keyboardType='numeric'
                        accessibilityLabel="input number of coin flips"
                        accessibilityHint={`Flip ${quantity} coins`}
                        onChange={(e) => changeQuantity(e)}
                        textAlignVertical="bottom"
                    ></TextInput>
                </View>
            </KeyboardAvoidingView>

            {/* Coins/flip button */}
            <View style={styles.coins_container}>
                <Pressable style={styles.coin_button}
                    onPressIn={() => handleFlip()}
                    accessibilityLabel="Flip coins"
                    accessibilityHint={`Flip ${quantity} coins`}
                    nativeID="flips pressable"
                >
                    <View style={styles.face_wrapper}>
                        <Animated.View
                            style={[styles.tails_wrapper, rotateStyle,
                                zStyle
                            ]}
                        >
                            <Tails />
                        </Animated.View>
                        <Animated.View style={[styles.heads_wrapper, rotateStyle ]}>
                            <Heads />
                        </Animated.View>
                    </View>
                </Pressable>
            </View>

            <Text style={styles.all_text}>{results.join(', ')}</Text>
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
        width: 100,
        height: 100,
    },
    input_wrapper: {
        flexDirection: 'row',
        minHeight: 100,
        alignItems: 'flex-end',
        justifyContent: 'center',
        top: 10,
    },
    input_touch: {
        width: '20%',
        minHeight: 100,
    },
    input_text: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        minHeight: 100
    },
    all_text: {
        fontSize: staticTextScaler(26),
        textAlign: 'center',
        color: 'white',
        fontFamily: "Beleren"
    },
    coins_container: {
        height: '40%',
        width: '90%',
        marginLeft: '5%',
        top: '5%',
    },
    coin_button: {
        height: '10%',
        minHeight: 100
    },
    face_wrapper: {
        height: '100%',
    },
    coin: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
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