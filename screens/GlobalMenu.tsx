import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet, Text } from "react-native"
import { RectButton } from 'react-native-gesture-handler'
import { AllScreenNavProps } from "../index"
import { fitFontToContainer } from "../functions/textScaler"
import { OptionsContext, OptionsContextProps } from "../OptionsContext"
import getComponentDimensions from "../functions/getComponentDimensions"
import iconData, { PlaneswalkerSvg } from "../images/staticResources"
import { GameContext, GameContextProps } from "../GameContext"
import { SafeAreaView } from "react-native-safe-area-context"

const options = ['New Game', 'Coin Flip', 'Dice', "Planechase", "Instructions", "Card Search"]

const GlobalMenu: React.FC = ({ }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const { setTotalPlayers, totalPlayers } = useContext<OptionsContextProps>(OptionsContext)
    const { planarData } = useContext<GameContextProps>(GameContext)
    const [containerDimensions, setContainerDimensions] = useState<{ height: number, width: number }>({ height: 666, width: 230 });
    const [visibleOptions, setVisibleOptions] = useState<string[]>(options)

    const resetGame = () => {
        navigation.navigate('StartMenu', { screen: "Life" })
        setTotalPlayers(0)
    }

    /*
    when no game is created, PlayerOptions screen is blank. only add option if players exist
    */
    useEffect(() => {
        if (totalPlayers > 0) {
            setVisibleOptions(['New Game', 'Players', 'Coin Flip', 'Dice', "Planechase", "Instructions", "Card Search"])
        } else {
            return
        }
    }, [totalPlayers])

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
        if (planarData.deck.length > 0) {
            navigation.navigate("Planechase", { screen: "PlanarDeck" })
        } else {
            navigation.navigate("Planechase")
        }

    }

    const toInstructions = () => {
        navigation.navigate("Instructions")
    }

    const toSearch = () => {
        navigation.navigate("Search")
    }

    return (
        <SafeAreaView style={styles.menu_container}>
            <View style={styles.icons_container}
                onLayout={(e) => getComponentDimensions(e, setContainerDimensions)}
            >
                {visibleOptions.map(option => {
                    return (
                        //button for and from gesture-handler
                        <RectButton
                            key={option}
                            style={styles.button_wrapper}
                            testID={`${option}-button`}
                            accessibilityRole="button"
                            onPress={() =>
                                option === "New Game" ? resetGame() :
                                    option === 'Players' && totalPlayers > 0 ? toPlayerOptions() :
                                        option === 'Coin Flip' ? toCoin() :
                                            option === 'Dice' ? toDice() :
                                                option === "Planechase" ? toPlane() :
                                                    option === "Instructions" ? toInstructions() :
                                                        option === "Card Search" ? toSearch() :
                                                            ''
                            }
                        >
                            <View style={styles.button_touch} testID="iconWrapper">
                                {
                                    option === "Planechase" ?
                                        <PlaneswalkerSvg viewBox="-150 -50 1300 1300" fillColor="white" />
                                        :
                                        iconData[option]

                                }
                            </View>
                            <Text nativeID={option} style={[styles.button_text, {
                                fontSize: containerDimensions ? fitFontToContainer(option, containerDimensions, { maxSize: 24, minSize: 18 }) : 18
                            }]}>
                                {option}
                            </Text>
                        </RectButton>
                    )
                })}
                <Text style={[styles.button_text, {
                    fontSize: containerDimensions ? fitFontToContainer(55 / 4, containerDimensions, {maxSize: 24 }) : 18
                }]} >
                    Swipe to access this menu. Press/hold icons to interact
                </Text>
            </View>
        </SafeAreaView>
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
        justifyContent: 'space-between',
    },
    button_wrapper: {
        height: `${(100 / options.length) - 5}%`,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_touch: {
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 1,
        height: '100%',
        width: '30%',
    },
    button_text: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Beleren',
    },
    active_button_text: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'Beleren',
        backgroundColor: 'white'
    },
})

export default GlobalMenu