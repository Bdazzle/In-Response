import { useContext, useEffect, useState } from "react"
import { KeyboardAvoidingView, StyleSheet, View, Pressable, Text, TextInput, NativeSyntheticEvent, TextInputSubmitEditingEventData, FlatList, ScrollView, ActivityIndicator } from "react-native"
import { colorLibrary } from "../../constants/Colors"
import getScryfallData, { getAllCardVersion, getExactCard, getSuggestedCards } from "../../search/getcards"
import { AllScreenNavProps,CombinedCards, ScryResultData } from "../.."
import Svg, { Path, Polygon } from "react-native-svg"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
import { GameContext, GameContextProps } from "../../GameContext"
import collateCardData from "../../functions/cards"
import useDebounce from "../../hooks/useDebounce"
import CardContainer from "../../search/Card"
import sleep from "../../functions/sleep"
import getSets, { addSetSymbolstoCards } from "../../search/getSetIcons"
import { OptionsContext, OptionsContextProps } from "../../OptionsContext"
import { SearchContext, SearchContextProps } from "../../SearchContext"

/* 
fetch order :
multiple cards - get card data w/&include_multilingual=true => get set icon uri;
single card - get exact card => get all variants by oracle_id => get set icon uri;
get rules text for each card;
*/
const SearchScreen: React.FC = ({ }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const { globalPlayerData } = useContext<GameContextProps>(GameContext)
    const [cardData, setCardData] = useState<CombinedCards>()
    const [inputVal, setInputVal] = useState<string>('')//set TextInput val to this to show searched/suggested term in search bar
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const { deviceType } = useContext<OptionsContextProps>(OptionsContext)
    const { cachedCardData, setCachedCardData } = useContext<SearchContextProps>(SearchContext)

    /**
     * clear input stuff when loading component
     */
    useEffect(() => {
        setSuggestions([]);
        setInputVal('')
    }, [])

    /**
     * fetch results w/multilingual flag will match foreign card name w/search terms in them,
     * so have to filter results by suggestions, otherwise returns each foreign card as separate entries
     * @param cards 
     * @param suggestions 
     * @returns 
     */
    const filterBySuggestions = (cards: ScryResultData, suggestions: string[]) => {
        return cards.filter((card) => suggestions.includes(card.name as string))
    }

    /**
     * 
     * @param cardNames = suggestions : string[] on keypad submit. will be 1 name on name press
     * @param cardCache 
     * @returns 
     */
    const checkCache = (cardNames: string[] | string, cardCache: CombinedCards) => {
        if (Array.isArray(cardNames)) {
            const cardObj = cardNames.reduce((acc, name) => {
                if (!acc) {
                    acc = {}
                }
                if (Object.keys(cardCache).includes(name)) {
                    acc[name] = cardCache[name]
                }
                return acc
            }, {} as CombinedCards)
            return cardObj
        }
        else {
            if (Object.keys(cardCache).includes(cardNames)) {
                return { [cardNames]: cardCache[cardNames] }
            }
        }
    }

    /**
     * check suggestion array against cache. if not, fetch
     * if suggestions has a card that's not cached while some of the results are cached,
     * (like if a new card comes out with the search term in it's title), do a new fetch? 
     * @param searchTerm 
     * @returns 
     */
    const fetchCards = async (searchTerm: string) => {
        try {
            setLoading(true)
            /*
            if every suggestion is in Object.keys(card data)
            .every(=> includes) will always return true on an empty array.
            a statement about "all elements" is vacuously true if there are no elements to test.
            */
            if (Object.keys(cachedCardData).length === 0 || (Object.keys(cachedCardData).length > 0 && suggestions.every(c => !Object.keys(cachedCardData).includes(c)))) {
                const cardRes = await getScryfallData(searchTerm)
                const filteredCards = cardRes && filterBySuggestions(cardRes, suggestions)
                const combined = await collateCardData(filteredCards || [])
                if (combined) {
                    const sets = await getSets(combined) as { [key: string]: string; }
                    addSetSymbolstoCards(combined, sets)
                }
                setCachedCardData({ ...cachedCardData, ...combined })//combined has priorety and will overwrite cached keys
                setCardData(combined)
            } 
            else {
                const cachedCards = checkCache(suggestions, cachedCardData)
                if (cachedCards) {
                    setCardData(cachedCards)
                }
            }
            setLoading(false)
        }
        catch (err) {
            console.log('Error getting searched cards:', err);
            return;
        }
    }

    const debouncedFetchCards = useDebounce(fetchCards, 50)

    /**
     * check single word search to cache. if not, fetch.
     * @param searchTerm 
     * @returns 
     */
    const fetchExact = async (searchTerm: string) => {
        try {
            setLoading(true)
            const cachedCards = checkCache(searchTerm, cachedCardData)
            if (cachedCards) {
                setCardData(cachedCards)
            } else {
                const cardRes = await getExactCard(searchTerm)
                await sleep(50)
                /* 
                to get all versions/languages of a card, we have to get oracle_id of the card,
                then fetch variants of that card and it's set symbols
                */
                const versionsRes = cardRes && await getAllCardVersion(cardRes.oracle_id as string)
                const combined = await collateCardData(versionsRes || []);
                if (combined) {
                    const sets = await getSets(combined) as { [key: string]: string; }
                    addSetSymbolstoCards(combined, sets)
                }
                setCachedCardData({ ...cachedCardData, ...combined })//combined has priorety and will overwrite cached keys
                setCardData(combined)
            }
            setLoading(false)
        }
        catch (err) {
            console.log('Error getting card data:', err);
            return;
        }
    }

    const debounceExactFetch = useDebounce(fetchExact, 50)

    const handleSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        const text = event.nativeEvent.text
        if (text && text.length >= 3) {
            debouncedFetchCards(text)
        }
        setInputVal(text)
        setShowSuggestions(false)
    }

    const fetchSuggestion = async (searchTerm: string) => {
        if (searchTerm) {
            try {
                const result = await getSuggestedCards(searchTerm);
                setSuggestions(result || [])
            } catch (error) {
                console.error('Error fetching suggestions:', error)
            }
        }
    }

    const debouncedFetchSuggestions = useDebounce(fetchSuggestion, 50);

    const handleInputChange = (text: string) => {
        setShowSuggestions(true)
        setInputVal(text)
        debouncedFetchSuggestions(text)
    }

    const handleSuggestionPress = (text: string) => {
        setInputVal(text)
        debounceExactFetch(text)
        setShowSuggestions(false)
    }

    const handleBack = () => {
        Object.keys(globalPlayerData).length > 0 ? navigation.navigate('Game') : navigation.navigate('MainMenu')
    }

    return (
        <View style={styles().search_container}>
            {/* Back Button */}
            <Pressable style={styles().back_button}
                onPress={() => handleBack()}
                accessibilityRole="button"
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

            <View testID="input_wrapper" style={styles(deviceType).input_wrapper}>
                <Text style={styles().search_text}>
                    Card Search :
                </Text>
                <KeyboardAvoidingView testID="input_text_wrapper"
                    style={[styles().search_input,
                    suggestions.length > 0 && showSuggestions ? styles().search_suggestion_border :
                        styles().search_border
                    ]} >
                    <TextInput testID="search_input"
                    accessibilityRole="search"
                        value={inputVal}
                        style={styles().input_text}
                        onPress={() => setShowSuggestions(!showSuggestions)}
                        onChangeText={handleInputChange}
                        onSubmitEditing={handleSubmit}>
                    </TextInput>
                </KeyboardAvoidingView>
                <FlatList
                    style={[styles().suggestion_list, {
                        display: showSuggestions ? 'flex' : 'none'
                    }]}
                    data={suggestions}
                    keyExtractor={(item) => item}
                    renderItem={({ item, index }) => (
                        <Pressable key={`${item}_press`}
                        accessibilityRole="button"
                            style={[styles().suggestion,
                            index === suggestions.length - 1 ? styles().last_suggestion :
                                ''
                            ]}
                            onPress={() => handleSuggestionPress(item)}>
                            <Text style={styles().suggestion_text} key={item}>
                                {item}
                            </Text>
                        </Pressable>
                    )}
                />
            </View>
            {loading ?
                <ActivityIndicator size={'large'} color={colorLibrary.vapePurple} />
                :
                <ScrollView testID="result_container"
                    contentContainerStyle={styles().results_container}
                >
                    {cardData && Object.keys(cardData).map((card, index) => {
                        return (
                            <CardContainer name={card} cardData={cardData[card]} key={index} />
                        )
                    })
                    }
                </ScrollView>
            }

        </View>
    )
}

const styles = (deviceType = 'phone') => {
    return StyleSheet.create({
        search_container: {
            width: '100%',
            backgroundColor: colorLibrary.bluish,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
        },
        input_wrapper: {
            width: '80%',
            marginLeft: '10%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: deviceType === 'phone' ? '30%' : '15%',
        },
        search_text: {
            fontFamily: 'Beleren',
            color: 'white',
            fontSize: 36,
        },
        search_input: {
            borderColor: 'white',
            borderWidth: 1,
            width: '100%',
            height: 80,
            backgroundColor: colorLibrary.offbluish,
        },
        search_border: {
            borderRadius: 15
        },
        search_suggestion_border: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
        },
        input_text: {
            fontFamily: 'Beleren',
            color: 'white',
            fontSize: 36,
            height: '100%'
        },
        suggestion_list: {
            width: '100%'
        },
        suggestion: {
            backgroundColor: colorLibrary.offbluish,
            padding: 2,
            borderBottomColor: 'white',
            borderBottomWidth: 1,
        },
        suggestion_text: {
            fontFamily: 'Beleren',
            color: 'white',
            fontSize: 24,
        },
        last_suggestion: {
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            borderBottomColor: 'none',
            borderBottomWidth: 0
        },
        back_button: {
            position: "absolute",
            left: 0,
            top: 0,
            width: 100,
            height: 100,
        },
        results_container: {
            width: '100%',
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '30%',
        },
        card_container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        flipcard_container: {
            height: 300,
            width: 200,
        },
        card_image: {
            height: 300,
            width: 200,
            resizeMode: 'cover'
        }
    })
}

export default SearchScreen