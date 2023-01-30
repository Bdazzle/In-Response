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

    const resetGame = () => {
        navigation.navigate('StartMenu', { screen: "Life"})
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