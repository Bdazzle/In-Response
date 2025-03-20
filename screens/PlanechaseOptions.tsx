import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useState } from "react"
import { View, Text, Pressable, StyleSheet, useWindowDimensions, StatusBar, ImageSourcePropType } from "react-native"
import { AllScreenNavProps } from "..";
import getComponentDimensions from "../functions/getComponentDimensions";
import { textScaler } from "../functions/textScaler";
import { GameContext, GameContextProps } from "../GameContext";
import { planechaseSets } from "../constants/PlanechaseImages";

/**
 * I have Planechase Anthology images in app already, 
 * so have that option button load from planechaseimages instead of fetching
 * 
 * May have to add a set key to PlanarDeck to remove cards from current deck from unselecting set option
 * check planecahse assets. might be able to cut them to make app size smaller. Have at least one deck for offline use
 * @param param0 
 * @returns 
 */
const PlanechaseOptions: React.FC = ({ }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const { planarData, setPlanarData } = useContext<GameContextProps>(GameContext)
    const [selections, setSelections] = useState<string[]>(['opca'])
    const [containerDimensions, setContainerDimensions] = useState<{ height: number, width: number }>({ height: 666, width: 230 });
    const { height } = useWindowDimensions()
    const statusBarHeight = StatusBar.currentHeight;

    const handleSelect = (input: string) => {
        if (!selections.includes(input)) {
            setSelections([...selections, input])
        } else {
            setSelections(selections.filter(s => s !== input))
        }
    }

    const handleLoad = () => {
        navigation.navigate("PlanarDeck", {
            options: selections
        })
    }

    const resetDeck = () => {
        setPlanarData({
            currentPlane: ['', '' as ImageSourcePropType],
            deck: [],
            discard: [],
        }),
            setSelections([])
    }

    return (
        <View testID="screen_container" style={[styles.screen_container, {
            height: height + (statusBarHeight || 0)
        }]}>
            <Text style={[styles.option_text, styles.title_text]}>
                Choose which decks to use
            </Text>
            <View testID="options_container" style={styles.options_container}
                onLayout={(e) => getComponentDimensions(e, setContainerDimensions)}
            >
                {
                    Object.entries(planechaseSets).map(opt => {
                        return <Pressable testID="set_pressable" key={opt[0]}
                            accessibilityRole="button"
                            style={({ pressed }) => [styles.option_button, {
                                opacity: pressed ? .5 : 1,
                                backgroundColor: selections.includes(opt[0]) ? 'white' : 'black'
                            }]}
                            onPress={() => handleSelect(opt[0])}
                        >
                            <Text
                                style={[selections.includes(opt[0]) ? styles.active_option_text : styles.option_text,
                                {
                                    fontSize: containerDimensions ? textScaler(Object.keys(planechaseSets).length, containerDimensions, 24, 18) : 18
                                }
                                ]}
                            >
                                {opt[1]}
                            </Text>
                        </Pressable>

                    })
                }
            </View>
            {
                planarData.deck.length > 0 &&
                <Pressable onPress={resetDeck}
                accessibilityRole="button"
                    style={({ pressed }) => [styles.option_button, styles.load_button, {
                        opacity: pressed ? .5 : 1,
                    }]}>
                    <Text style={[styles.option_text, {
                        fontSize: containerDimensions ? textScaler(10, containerDimensions, 30, 18) : 18
                    }]}>
                        Reset Deck
                    </Text>
                </Pressable>
            }
            <Pressable onPress={handleLoad}
                style={({ pressed }) => [styles.option_button, styles.load_button, {
                    opacity: pressed ? .5 : 1,
                }]}
                accessibilityRole="button"
            >
                <Text style={[styles.option_text, {
                    fontSize: containerDimensions ? textScaler(9, containerDimensions, 30, 18) : 18
                }]}>
                    Load Deck
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    screen_container: {
        backgroundColor: 'black',
        width: '100%',
        color: 'white',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    options_container: {
        height: '60%',
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    option_button: {
        height: `${(100 / Object.keys(planechaseSets).length) - 5}%`,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    option_text: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Beleren',
    },
    title_text: {
        fontSize: 32,
        width: '80%',
        paddingTop: '5%',
    },
    active_option_text: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'Beleren',
    },
    load_button: {
        width: '60%',
        maxHeight: '8%'
    }
})

export default PlanechaseOptions