import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useContext } from "react"
import { View, StyleSheet, Text, Pressable } from "react-native"
import Svg, { Path } from "react-native-svg"
import { AllScreenNavProps } from ".."
import { iconData } from "../reducers/imageResources"
import { PlaneswalkerSvg } from "../constants/PlanechaseImages"
import { textScaler } from "../functions/textScaler"
import { OptionsContext, OptionsContextProps } from "../OptionsContext"

const options = ['New Game', 'Players', 'Coin Flip', 'Dice', "Planechase", "Instructions"]

const GlobalMenu: React.FC = ({ }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const { setTotalPlayers } = useContext(OptionsContext) as OptionsContextProps

    const closeMenu = () => {
        navigation.navigate('Game')
    }

    const resetGame = () => {
        navigation.navigate('StartMenu')
        setTotalPlayers(0)
    }

    const toPlayerOptions = () => {
        navigation.navigate("StartMenu", { screen: "PlayerOptions" })
    }

    const toCoin = () => {
        navigation.navigate("CoinFlipper")
    }

    const toDice = () => {
        navigation.navigate("DiceRoller")
    }

    const toPlane = () => {
        navigation.navigate("Planechase")
    }

    const toInstructions = () => {
        navigation.navigate("Instructions")
    }

    return (
        <View style={styles.menu_container}>
            {/* Close Button */}
            <Pressable
                style={styles.close_icon}
                onPressIn={() => closeMenu()}
            >
                <Svg viewBox='0 0 512 512'
                    style={styles.close_icon}
                >
                    <Path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
                        fill="white"
                    />
                </Svg>
            </Pressable>

            <View style={styles.icons_container}  >
                {options.map(option => {
                    return (
                        <View key={option} style={styles.button_wrapper} >
                            <Pressable style={styles.button_touch} testID="iconPressIn"
                                onPressIn={() =>
                                    option === "New Game" ? resetGame() :
                                        option === 'Players' ? toPlayerOptions() :
                                            option === 'Coin Flip' ? toCoin() :
                                                option === 'Dice' ? toDice() :
                                                    option === "Planechase" ? toPlane() :
                                                        option === "Instructions" ? toInstructions() :
                                                            ''
                                }
                            >
                                {
                                    option === "Planechase" ?
                                        <PlaneswalkerSvg viewBox="-100 0 1300 1300" fillColor="white" />
                                        :
                                        <Svg viewBox={iconData[option].viewBox}
                                        >
                                            {iconData[option].pathData.map((p, i) => {
                                                return (
                                                    <Path key={`${option} path ${i}`} d={p.path}
                                                        fill={p.fill}
                                                    />
                                                )
                                            })}
                                        </Svg>
                                }
                            </Pressable>
                            <Text style={styles.button_text}>{option}</Text>
                        </View>
                    )
                })}
                <Text style={styles.button_text} >Swipe to access this menu. Press/hold icons to interact</Text>
            </View>

        </View >
    )
}

const styles = StyleSheet.create({
    menu_container: {
        backgroundColor: 'black',
        height: '100%',
        width: '100%',
        color: 'white',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    close_icon: {
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 1,
        height: 60,
        width: 60
    },
    icons_container: {
        width: '60%',
        height: '80%',
        justifyContent: 'space-between'
    },
    button_wrapper: {
        height: `${(100 / options.length) - 5}%`,
        width: '100%',
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 1,
        border: '2px solid white',
    },
    button_touch: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 1
    },
    button_text: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Beleren',
        fontSize: textScaler(16)
    },
})

export default GlobalMenu