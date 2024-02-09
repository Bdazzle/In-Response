import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react"
import { Image, Text, StyleSheet, TextInput, Pressable, View, KeyboardAvoidingView, NativeSyntheticEvent, TextInputChangeEventData } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Path, Polygon } from "react-native-svg";
import { AllScreenNavProps } from "../..";
import { colorLibrary } from "../../constants/Colors";
import { staticTextScaler } from "../../functions/textScaler";
import { GameContext } from "../../GameContext";

/* Die rolling animations in future? */
const Dice = () => {
    // const [front, setFront] = useState<string | number>()
    // const numbers = [...Array(20)].map((_, i) => i + 1)

    return (
        <>
            <Image style={{
                resizeMode: 'contain',
                width: '100%',
                height: '100%'
            }}
                source={require("../../assets/images/filled-d20.png")} 
                accessibilityLabel="twenty sided die"
                />
            {/* {
                [...Array(20)].map((_, i) => {
                    const num = i + 1
                    return (
                        <View key={num} style={[styles.face_wrapper, {
                            transform: [
                                // { translateX : i*72},
                                // { translateY: -i *72}

                            ]
                        }]}>
                            <Text style={styles.face_text} >{num}</Text>
                        </View>
                    )
                })
            } */}
        </>
    )
}

const DiceRoller = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const { globalPlayerData } = useContext(GameContext)
    const [amount, setAmount] = useState<number>(1)
    const [sides, setSides] = useState<number>(20)
    const [results, setResults] = useState<number[]>()
    const [sum, setSum] = useState<number>()
    const diceScale = useSharedValue(1)

    /*
    animate dice scale between ~.9 - 1.1 repeated,
    to make a spring effect on press release
    */
    const animateDice = () => {
        diceScale.value = withSequence(
            withRepeat(
                withTiming(1.1, {
                    duration: 150
                }),
                4),
            withTiming(1)
        )
    }

    const springStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: diceScale.value
            }]
        }
    })
    /*
    make dice slightly small when pressed
    */
    const handlePressIn = () => {
        diceScale.value = .9
    }

    const roll = () => {
        animateDice()
        const resultsArr = [...Array(amount)].map((_, i) => {
            return Math.floor(Math.random() * sides) + 1
        })
        setResults(resultsArr)
        if (resultsArr.length > 1) {
            const total = resultsArr.reduce((a, b) => a + b)
            setSum(total)
        }
    }

    const handleBack = () => {
        Object.keys(globalPlayerData).length > 0 ? navigation.navigate('Game') : navigation.navigate('MainMenu')
    }

    const changeAmount = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setAmount(Number(e.nativeEvent.text))
    }

    const changeSides = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setSides(Number(e.nativeEvent.text))
    }


    return (
        <View style={styles.container}>
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

            <View nativeID="input_wrapper"
            style={styles.input_wrapper}
            >
                <KeyboardAvoidingView style={styles.text_wrapper}>
                    {/* Amount of Dice */}
                    <View style={styles.input_press}>
                        <TextInput
                            style={[styles.input_text, styles.number_text]}
                            keyboardType='numeric'
                            onChange={(e) => changeAmount(e)}
                            accessibilityLabel="amount of dice"
                            textAlignVertical="bottom"
                            aria-label="amount of dice"
                        >
                        </TextInput>
                    </View>

                    <View style={{
                        justifyContent: 'flex-end'

                    }}>
                        <Text style={styles.all_text}> Deez </Text>
                    </View>


                    {/* Sides */}
                    <View style={styles.input_press}>
                        <TextInput
                            style={[styles.input_text, styles.number_text]}
                            keyboardType='numeric'
                            onChange={(e) => changeSides(e)}
                            textAlignVertical="bottom"
                            accessibilityLabel="dice sides"
                            aria-label="dice sides"
                        >
                        </TextInput>
                    </View>
                </KeyboardAvoidingView>
            </View>
            {/* Dice image/Roller button */}
            <Animated.View style={[styles.dice_container, springStyle]}>
                <Pressable style={styles.dice_press}
                    onPressIn={() => handlePressIn()}
                    onPressOut={() => roll()}
                >
                    <Dice />
                </Pressable>
            </Animated.View>


            {/* Results */}
            <View>
                {results &&
                    <View>
                        <Text style={styles.all_text}>Results:</Text>
                        <Text style={styles.number_text}>{results.join(', ')}</Text>
                    </View>
                }
                {sum &&
                    <View>
                        <Text style={styles.all_text}>Total:</Text>
                        <Text style={styles.number_text}>{sum}</Text>
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        height: '100%',
        width: "100%",
        backgroundColor: colorLibrary.vapePink,
        justifyContent: 'center',
        alignItems: 'center'
    },
    back_button: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 100,
        height: 100,
    },
    input_wrapper:{
        minHeight: 100,
    },
    text_wrapper: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    input_press: {
        width: '33%',
    },
    input_text: {
        minHeight: 100,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        fontFamily: "Beleren"
    },
    all_text: {
        fontSize: staticTextScaler(26),
        textAlign: 'center',
        fontFamily: "Beleren"
    },
    number_text: {
        fontSize: staticTextScaler(26),
        textAlign: 'center',
        fontFamily: "Beleren"
    },
    dice_container: {
        height: '50%',
        width: '90%',
        marginLeft: '5%',
        top: '5%',
    },
    dice_press: {
        height: '80%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    /*
    keep incase of adding dice rolling animations
    */
    // face_wrapper: {
    //     // borderColor: 'black',
    //     // borderWidth:1,
    //     // backgroundColor:'white',
    //     // width:60,
    //     /*
    //     styles for triangle
    //     */
    //     width: 0,
    //     height: 0,
    //     // height:'100%',
    //     borderRightWidth: 60,
    //     borderLeftWidth: 60,
    //     borderBottomWidth: 120,
    //     borderLeftColor: 'transparent',
    //     borderRightColor: 'transparent',
    //     borderBottomColor: 'white',
    //     // borderBottomColor:'transparent',
    //     position: 'absolute',
    //     backfaceVisibility: 'hidden',
    //     alignItems: 'center',
    //     zIndex: 0,
    //     // justifyContent: 'flex-end'
    //     shadowColor: "black",
    //     shadowOpacity: 0.8,
    //     shadowRadius: 2,
    //     shadowOffset: {
    //         height: 1,
    //         width: 1
    //     }
    // },
    // face_text: {
    //     // borderColor: 'black',
    //     // borderWidth:1,
    //     // backgroundColor:'white',
    //     position: 'absolute',
    //     fontSize: 36,
    //     width: 60,
    //     height: 60,
    //     marginTop: 50,
    //     marginLeft: 20,
    //     zIndex: 10
    // }
})

export default DiceRoller