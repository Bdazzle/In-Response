import React, { useContext, useEffect } from "react"
import { Text, StyleSheet, KeyboardAvoidingView, NativeSyntheticEvent, TextInput, View, Pressable, TextInputSubmitEditingEventData, ColorValue } from "react-native"
import MenuNavButtons from "../../components/MenuNavButtons"
import { GameContext, GameContextProps } from "../../GameContext"
import { ColorTheme, StartMenuStackNavProps } from "../.."
import FadeContainer from "../../components/FadeContainer"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OptionsContext, OptionsContextProps } from "../../OptionsContext"
import Svg, { Path } from "react-native-svg"

interface ColorSquareParams {
    primary: string,
    secondary: string,
    playerID: number,
    playerName: string
}

const ColorSquare: React.FC<ColorSquareParams> = ({ primary, secondary, playerID, playerName }) => {
    const navigation = useNavigation<StartMenuStackNavProps>()

    const showColorMenu = () => {
        navigation.navigate('ColorMenu', {
            playerID: playerID,
            primary: primary,
            secondary: secondary
        })
    }

    return (
        <Pressable
            nativeID={`${playerID}_color_press`}
            style={styles.color_touch}
            onPress={() => showColorMenu()}
            accessibilityLabel={`${playerName} color options`}
            accessibilityRole="button"
        >
            <View style={[styles.color_square_inner, {
                backgroundColor: primary,
                borderColor: secondary,
            }]}>
                <Svg fill={secondary as ColorValue} height={'100%'} width={'100%'} viewBox="0 0 128 128">
                    <Path d="M111.84 15.36H16.16c-1.24 0-2.24 1-2.24 2.24v17.99c0 1.24 1 2.24 2.24 2.24h34.65v80.73c0 1.24 1 2.24 2.24 2.24h21.9c1.24 0 2.24-1 2.24-2.24V37.83h34.65c1.24 0 2.24-1 2.24-2.24V17.6c0-1.24-1-2.24-2.24-2.24z"></Path>
                </Svg>
            </View>
        </Pressable>
    )
}

interface PlayerRowParams {
    playerID: number;
}

const PlayerRow: React.FC<PlayerRowParams> = ({ playerID }) => {
    const { globalPlayerData, dispatchGlobalPlayerData } = useContext(GameContext) as GameContextProps

    const storeName = async (val: string) => {
        try {
            await AsyncStorage.setItem(`${String(playerID)} screenName`, val)
            console.log(`saved ${val} to playerID ${playerID}`)
        }
        catch (e) {
            console.info(`error storing player ${playerID} screen name -> ${e}`)
        }
    }

    const handleNameChange = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        e.preventDefault()
        storeName(e.nativeEvent.text)
        dispatchGlobalPlayerData({
            playerID: playerID,
            field: 'screenName',
            value: e.nativeEvent.text
        })
    }

    /*
    maybe move this to a context? somewhere higher up in app hierarchy?
    */
    useEffect(() => {
        (async () => {
            try {
                const savedColors = await AsyncStorage.getItem(`${String(playerID)} colors`)
                if (savedColors) {
                    const parsedColors = JSON.parse(savedColors as string)
                    dispatchGlobalPlayerData({
                        field: 'colors',
                        value: parsedColors as ColorTheme,
                        playerID: playerID
                    })
                }

                const sn = await AsyncStorage.getItem(`${String(playerID)} screenName`)
                if (sn) {
                    dispatchGlobalPlayerData({
                        playerID: playerID,
                        field: 'screenName',
                        value: sn
                    })
                }

            }
            catch (e) {
                console.log(`error getting saved player names`, e)
            }
        })()
    }, [])

    return (
        <KeyboardAvoidingView style={styles.row_wrapper} >
            <ColorSquare primary={globalPlayerData[playerID].colors.primary}
                secondary={globalPlayerData[playerID].colors.secondary}
                playerID={playerID}
                playerName={globalPlayerData[playerID].screenName}
            />
            <Pressable style={styles.name_toucheable}
                accessibilityRole="button"
                accessibilityHint={`Change ${globalPlayerData[playerID]} name`}
            >
                <TextInput style={styles.player_name}
                    accessibilityLabel="textbox"
                    defaultValue={globalPlayerData[playerID].screenName}
                    onSubmitEditing={(e) => handleNameChange(e)}
                    onEndEditing={(e) => handleNameChange(e)}
                ></TextInput>
            </Pressable>
        </KeyboardAvoidingView>
    )
}

/*
creating global player object is handled in game context as totalPlayers is updated
*/
const PlayerOptions = ({ }) => {
    const { totalPlayers } = useContext(OptionsContext) as OptionsContextProps
    const { globalPlayerData } = useContext(GameContext) as GameContextProps

    return (
        <View style={styles.container}
            testID="player_options"
        >
            <Text style={styles.title_text} >Player Names</Text>

            {Object.keys(globalPlayerData).map((p: string) => {
                /*   
                check to see if playerID <= totalPlayers 
                so that saved stuff doesn't get set to nonexistent player object.
                Error caused a player to be created w/only screenName field
                */
                return Number(p) <= totalPlayers && <PlayerRow playerID={Number(p)} key={`Player ${p}`} />
            })}
            <FadeContainer style={styles.fade_container}>
                <MenuNavButtons navTo="Game" navBack="TotalPlayers" labelBack="Total Players" labelTo="Start Game" />
            </FadeContainer>
        </View>
    )
}

const styles = StyleSheet.create({
    title_text: {
        color: 'white',
        textAlign: 'center',
        marginTop: '5%',
        fontSize: 40,
        fontFamily: "Beleren"
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'space-between',
        alignContent: 'space-around',
    },
    row_wrapper: {
        padding: 5,
        height: '15%',
        width: '100%',
        flexDirection: 'row',
        alignContent: 'space-around',
        justifyContent: 'space-around',
    },
    name_toucheable: {
        width: '65%',
        borderBottomColor: 'white',
        borderWidth: 2,
    },
    player_name: {
        height: '100%',
        color: 'white',
        width: '100%',
        fontSize: 30,
        fontFamily: "Beleren"
    },
    color_touch: {
        height: '100%',
        width: '25%',
    },
    color_square_inner: {
        borderRadius: 5,
        borderWidth: 2,
        height: '100%',
    },
    fade_container: {
        height: '20%',
        width: '100%',
    }
})

export default PlayerOptions