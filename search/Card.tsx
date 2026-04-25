import { StyleSheet, View, Text, Image, Pressable, Animated, useWindowDimensions, Platform } from "react-native"
import { Card, StringProperties, TreatmentImage } from "../index"
import FlipCard from "../components/Flipcard"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { SvgUri } from "react-native-svg"
import useFadeDownAnimation from "../hooks/useFadeDownAnimation"
import { OptionsContext, OptionsContextProps } from "../OptionsContext"
import { colorLibrary } from "../constants/Colors"
import languageKey from "../constants/languageKey"
import { FlatList } from "react-native-gesture-handler"
import ImageDeck from "../components/Deck"

interface CardContainerProps {
    name: string
    cardData: {
        versions: Card[];
        rules: string[]
    }
}

interface SetRowProps {
    cardData: {
        versions: Card[];
        rules: string[]
    }
    handlePress: (card: Card) => void;
}

/**
 * when doing tablet styles, use similar execution to SpeedOverlay
 * set filtering doesn't return foil/surge/etc. versions of cards (test w/ Aberrant)
 * @param param0 
 * @returns 
 */
const SetRow: React.FC<SetRowProps> = ({ cardData, handlePress }) => {
    const [currentLang, setCurrentLang] = useState<string>('en')
    const [pressedSet, setPressedSet] = useState<boolean>(false)
    const [langPress, setLangPressed] = useState<boolean>(false)
    const [setOptions, setSetOptions] = useState<{ [set: string]: string }>({})
    const [currentSet, setCurrentSet] = useState<keyof StringProperties<Card> | ''>('')
    const [langOptions, setLangOptions] = useState<string[]>([])
    const { deviceType } = useContext<OptionsContextProps>(OptionsContext)
    const { opacityVal: setOpacityVal,
        zIndexVal: setZIndexVal,
        translateYVal: setTranslateYVal,
        fadeStyle: setFadeStyle
    } = useFadeDownAnimation()
    const { opacityVal: langOpacityVal,
        zIndexVal: langZIndexVal,
        translateYVal: langTranslateYVal,
        fadeStyle: langFadeStyle } = useFadeDownAnimation()
    const setEntries = setOptions ? Object.entries(setOptions) : []
    // const testSets = 60 //20 is scroll cut off
    // const [testEntries, setTestEntries] = useState<string[]>([...Array(60)].map((_, index) => String(index)))
    const cols = deviceType === 'phone' ? 4 : 6
    // const setsRows = Math.ceil(testSets / cols)
    // const langRows = Math.ceil(langOptions.length / cols)
    // const maxNormalRows = 7
    const btnSize = deviceType === 'phone' ? {
        height: 40,
        width: 80,
    }
        :
        {
            height: 60,
            width: 100,
        };
    const [ogSetsPos, setogSetsPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const { height: screenHeight } = useWindowDimensions()
    const setbtnRef = useRef<View>(null);
    const langbtnRef = useRef<View>(null);
    const [setContainerHeight, setSetContainerHeight] = useState<number>(400)
    /**
     * check for new card data when component loads, 
     * so stale data (from a previoulsy searched card) isn't displayed
     */
    useEffect(() => {
        const initVersion: Card[] = cardData.versions.filter((card) => card.lang === 'en') || cardData.versions[0]
        setCurrentSet(initVersion[0].set_code as keyof StringProperties<Card>)
        setCurrentLang(initVersion[0].lang)

        const sets = cardData.versions.reduce((acc, curr) => {
            const { set_code, icon_svg_uri } = curr
            if (!acc) {
                acc = {}
            }
            if (!acc[set_code as keyof StringProperties<Card>]) {
                acc[set_code] = icon_svg_uri as string
            }
            return acc
        }, {} as { [set_code: string]: string })

        setSetOptions(sets)
        const langOpts = getLanguageOptions(initVersion[0].set_code)
        setLangOptions(langOpts)
    }, [cardData])

    /**
     * get language options for a given set
     */
    const getLanguageOptions = (selectedSet: string) => {
        const languages = cardData.versions.reduce((acc, curr) => {
            if (!acc) {
                acc = []
            }
            if (curr.set_code === selectedSet && !acc.includes(curr.lang as string)) {
                acc.push(curr.lang as string)
            }
            return acc
        }, [] as string[]).sort((a, b) => {//sort languages so the 'en' is first for rendering new cards
            if (a === 'en') return -1;
            if (b === 'en') return 1;
            return 0
        })
        return languages
    }

    const handleSetSelect = (set: string) => {
        console.log('SetSelect', set)
        setPressedSet(!pressedSet)
        setLangPressed(false)
        if (set !== currentSet) {
            const newLanguageOptions = getLanguageOptions(set)
            const currentCard = cardData.versions.filter(card => card.set_code === set && card.lang === newLanguageOptions[0])
            if (currentCard.length > 0) {
                handlePress(currentCard[0])
                setLangOptions(newLanguageOptions)
                setCurrentLang(newLanguageOptions[0])
                setCurrentSet(set as keyof StringProperties<Card>)
            }
            else {
                console.log('No Localized Card found by set')
            }
        }
    }

    const handleLangPress = (lang: string) => {
        setLangPressed(!langPress)
        setPressedSet(false)

        if (lang !== currentLang) {
            const currentCard = cardData.versions.filter(card => card.lang === lang && card.set_code === currentSet)
            if (currentCard.length > 0) {
                handlePress(currentCard[0])
                setCurrentLang(lang)
            } else {
                console.log('No Localized Card found by language')
            }
        }
    }
    

    useEffect(() => {
        pressedSet ? setFadeStyle(1, 1, 0, 50) : setFadeStyle(0, -1, -40, 50)
    }, [pressedSet])

    useEffect(() => {
        langPress ? langFadeStyle(1, 1, 0, 50) : langFadeStyle(0, -1, -40, 50)
    }, [langPress])

    const filteredSets = useMemo(() => {
        return setEntries.filter(([setName]) => setName !== currentSet);
    }, [setEntries, currentSet])

    const filteredLangs = useMemo(() => {
        return langOptions.filter(l => l !== currentLang)
    }, [langOptions, currentLang])


    /**
     * Measure difference between right button edge to right screen edge
     */
    const handleSetBtnLayout = () => {
        setbtnRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setogSetsPos({ x, y })
            const containerSpace = screenHeight - pageY
            setSetContainerHeight(containerSpace)
        });
    }

    return (
        <View testID="sets_container">
            <View testID="btns_row" style={styles().btns_row}>
                <Pressable testID="svg_btn"
                    accessibilityRole="button"
                    accessibilityLabel="change set"
                    accessibilityHint={`current set ${currentSet}`}
                    style={({ pressed }) => [styles(deviceType).svg_btn, {
                        opacity: pressed ? .5 : 1,
                        height: deviceType === 'phone' ? 40 : 60,
                        width: deviceType === 'phone' ? 80 : 100,
                    },]}
                    onPress={() => handleSetSelect(currentSet)}
                    onLayout={() => handleSetBtnLayout()}
                    ref={setbtnRef}
                >
                    {
                        setOptions &&
                        <SvgUri uri={setOptions[currentSet as keyof typeof setOptions]}
                            style={styles(deviceType).set_icon}
                            accessibilityLabel={currentSet}
                        />
                    }
                </Pressable>
                <Pressable testID="svg_container"
                    accessibilityRole="button"
                    accessibilityLabel="languages"
                    accessibilityHint={`current language ${languageKey[currentLang]}`}
                    style={({ pressed }) => [styles(deviceType).svg_container,
                    {
                        opacity: pressed ? .5 : 1,
                        height: deviceType === 'phone' ? 40 : 60,
                        width: deviceType === 'phone' ? 80 : 100
                    },
                    ]}
                    onPress={() => handleLangPress(currentLang)}
                    ref={langbtnRef}
                >
                    <Text style={styles(deviceType).lang_text}>{currentLang}</Text>
                </Pressable>
            </View>

            <Animated.View
                style={{
                    opacity: setOpacityVal,
                    transform: [
                        {
                            translateY: setTranslateYVal
                        },
                    ],
                    zIndex: setZIndexVal,
                    marginLeft: ogSetsPos.x,
                    position: 'absolute',
                    top: btnSize.height,
                    left: 0,
                    transformOrigin: 'top left',
                    width: '90%',

                }}
            >
                <FlatList data={filteredSets}
                    numColumns={cols}
                    keyExtractor={([key, val]) => key}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    style={{
                        height: setContainerHeight,
                    }}
                    contentContainerStyle={{
                        paddingBottom: Object.keys(setOptions).length > 28 ? 0 : btnSize.height * 3,
                    }}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles(deviceType).svg_btn, {
                                width: btnSize.width,
                                height: btnSize.height,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }]}
                            onPress={() => handleSetSelect(item[0])}
                        >
                            <SvgUri
                                uri={item[1]}
                                style={styles(deviceType).set_icon}
                                accessibilityLabel={item[0]}
                            />
                        </Pressable>
                    )}
                />
            </Animated.View>

            <Animated.View testID="lang_buttons_container"
                style={[styles(deviceType).set_button_container, {
                    width: '100%',
                    zIndex: langZIndexVal,
                    position: 'absolute',
                    top: btnSize.height,
                    right: btnSize.width / 2,

                }]}
            >
                <Animated.View style={[styles(deviceType).list_container,
                {
                    opacity: langOpacityVal,
                    transform: [{
                        translateY: langTranslateYVal
                    }],
                }
                ]}
                ><FlatList data={filteredLangs}
                    numColumns={cols}
                    keyExtractor={(item) => item}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                        alignItems: 'flex-end',
                        paddingBottom: Object.keys(setOptions).length > 28 ? 0 : btnSize.height * 3,
                    }}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles(deviceType).svg_btn, {
                                width: btnSize.width,
                                height: btnSize.height,
                            }]}
                            onPress={() => handleLangPress(item)}
                        >
                            <Text style={styles(deviceType).lang_text}>{item}</Text>
                        </Pressable>
                    )}
                    />
                </Animated.View>
            </Animated.View>

        </View>
    )
}

type TreatmentSort = {
    [set: string]: {
        [lang: string]: Card[]
    }
}
/**
 * split cards (aftermath, fuse, adventure, etc.) have card_faces[text fields], but no image_uri for those faces.
 * mdfc's have all data for both card_faces.
 * add some sort of priorety hierarchy check to load card_face/not card face data first.
 * if card_data.versions[0]: currentVersion.image_uri -> render image, else render card_faces.image_uris.normal
 * if card.printed_text => printed_text => oracle_text, else card_faces => card_faces.printed_text => card_faces.oracle_text
 * text priority printed => oracle, if neither go to card_faces printed => oracle
 * @param param0 
 * @returns 
 */
const CardContainer: React.FC<CardContainerProps> = ({ name, cardData }) => {
    const [showFront, setShowFront] = useState<boolean>(true)
    const [oracleText, setOracleText] = useState<string>('')
    const [cardFront, setCardFront] = useState<string>()
    const [cardBack, setCardBack] = useState<string>()
    const { deviceType } = useContext<OptionsContextProps>(OptionsContext)
    const [currentVersion, setCurrentVersion] = useState<Card>()
    const [cardName, setCardName] = useState<string>()
    const [versionTreats, setVersionTreats] = useState<TreatmentImage[]>()
    /**
     * initialize component with first card in cardData,
     * or when card data changes, so new searches don't have stale data from previous results
     */
    useEffect(() => {
        const initVersion: Card[] = cardData.versions.filter((card) => card.lang === 'en') || cardData.versions[0]
        setCurrentVersion(initVersion[0])
        setCardName(name)
    }, [cardData])

    const handleVersionChange = (card: Card) => {
        if (card) {
            setCurrentVersion(card)
            if (card.printed_name) {
                setCardName(card.printed_name)
            } else {
                setCardName(card.name)
            }
        }
    }


    const checkForFuse = (face1: string, face2: string) => {
        if (face1.slice(face1.lastIndexOf('\n'), face1.length) === face2.slice(face2.lastIndexOf('\n'), face2.length)) {
            return `${face1.slice(0, face1.lastIndexOf('\n'))} // ${'\n'} ${face2}`
        } else {
            return `${face1} // ${'\n'} ${face2}`
        }
    }
    /**
     * when current version changes, we need it's set/language images and text,
     * check for printed_text if foreign language is selected, otherwise display oracle_text for EN
     * set images of set/lang version of card.
     *  printed text > oracle text
        if image_uri and cardfaces, split card, need image, then text from cardfaces
        if image_uri and !cardfaces, normal cards -> get image and text
        if no image_uri, flip card, and need image and text from both cardfaces
     */
    useEffect(() => {
        if (currentVersion) {
            if (currentVersion?.image_uri) {
                setCardFront(currentVersion.image_uri)
                if (currentVersion.card_faces) { // check for split card
                    const cardText = currentVersion.card_faces[0].printed_text ?
                        checkForFuse(currentVersion.card_faces[0].printed_text, currentVersion.card_faces[1].printed_text) :
                        checkForFuse(currentVersion.card_faces[0].oracle_text, currentVersion.card_faces[1].oracle_text)
                    setOracleText(cardText)
                } else { //normal card
                    currentVersion.printed_text ? setOracleText(currentVersion?.printed_text as string) : setOracleText(currentVersion?.oracle_text as string)
                }
            } else {
                //for double faced cards
                if (currentVersion.card_faces) {
                    setCardFront(currentVersion.card_faces[0].image_uri)
                    setCardBack(currentVersion.card_faces[1].image_uri)
                    if (showFront) {
                        currentVersion.card_faces[0].printed_text ? setOracleText(currentVersion.card_faces[0].printed_text) : setOracleText(currentVersion.card_faces[0].oracle_text)
                    } else {
                        currentVersion.card_faces[1].printed_text ? setOracleText(currentVersion.card_faces[1].printed_text) : setOracleText(currentVersion.card_faces[1].oracle_text)
                    }
                }
            }
            // get card version treatments (treatments[], images/card faces)
            const treats = cardData.versions.filter((card: Card) => card.lang === currentVersion?.lang && card.set_code === currentVersion?.set_code)

            const treatsData: TreatmentImage[] = treats.map((t) => {
                if (t.card_faces) {
                    return [t.treatment, t.card_faces]
                } else {
                    return [t.treatment as string[], t.image_uri]
                }
            })
            setVersionTreats(treatsData)
        }
    }, [currentVersion])

    useEffect(() => {
        if (currentVersion?.card_faces) {
            if (showFront) {
                currentVersion.card_faces[0].printed_text ? setOracleText(currentVersion.card_faces[0].printed_text) : setOracleText(currentVersion.card_faces[0].oracle_text)
            } else {
                currentVersion.card_faces[1].printed_text ? setOracleText(currentVersion.card_faces[1].printed_text) : setOracleText(currentVersion.card_faces[1].oracle_text)
            }
        }
    }, [showFront])


    return (
        <View testID="card_container"
            style={styles().card_container}
        >
            {
                cardName && !cardName.includes('//') ? <Text style={styles(deviceType).name_text}>{cardName}</Text> :
                    <Text style={styles(deviceType).name_text}>{cardName}</Text>
            }
            {
                versionTreats && <ImageDeck imageWidth={deviceType === 'phone' ? 220 : 360}
                    imageHeight={deviceType === 'phone' ? 300 : 500}
                    containerStyle={styles(deviceType).image_container} stackSize={3}
                    captions={versionTreats.map(v => v[0].join('\n'))}
                    captionContainerStyle={styles(deviceType).caption_container}
                    cards={
                        versionTreats.map((vt: TreatmentImage, idx: number) => {
                            if (typeof vt[1] === 'string') {
                                return (
                                    <Image
                                        key={idx}
                                        source={{ uri: vt[1] }}
                                        alt={`${name}`}
                                        style={[styles(deviceType).card_image]}
                                    ></Image>
                                )
                            } else {
                                return (
                                    <View testID="flipcard_container"
                                        style={styles(deviceType).flipcard_container}
                                    >
                                        <FlipCard
                                            front={{ uri: vt[1][0].image_uri }}
                                            back={{ uri: vt[1][1].image_uri }}
                                            onFlip={() => setShowFront(!showFront)}
                                            buttonStyle={styles().flip_button}
                                            altBack={name.split('//')[1]}
                                            altFront={name.split('//')[0]}
                                        ></FlipCard>
                                    </View>
                                )
                            }
                        })
                    }
                />
            }

            <View testID="card_info" style={styles().card_info}>

                <SetRow cardData={cardData} handlePress={handleVersionChange} />

                <View style={styles().text_container}>
                    <Text testID="oracle_text" style={styles(deviceType).oracle_text}>
                        {
                            oracleText
                        }
                    </Text>
                </View>
                {
                    <View testID="rules_container" style={styles().text_container}>
                        <Text style={styles(deviceType).rules_header}>
                            Rules
                        </Text>
                        {
                            Object.values(cardData.rules).map((rule, index) => {
                                return <Text key={`rule_${index}`}
                                    style={styles(deviceType).rules_text}>
                                    {`${index + 1}). ${rule}`}
                                </Text>
                            })
                        }
                    </View>
                }
            </View>
        </View>
    )
}


const styles = (deviceType?: string) => {
    const imageStyle = deviceType === 'phone' ?
        {
            image_dimensions: {
                height: 300,
                width: 220,
            },
            flipcard_container: {
                height: 300,
                width: 220,
            },
        }
        :
        {
            image_dimensions: {
                height: 500,
                width: 360,
            },
            flipcard_container: {
                height: 500,
                width: 360,
                borderColor: 'white', borderWidth: 1,
            },
        };

    const buttonStyles = deviceType === 'phone' ? {
        height: 40,
        width: 80,
    }
        :
        {
            height: 60,
            width: 100,
        };

    const setIconStyles = deviceType === 'phone' ? {
        width: 40,
        height: 40
    }
        :
        {
            width: 60,
            height: 60
        };

    return StyleSheet.create({
        card_container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
            borderColor: colorLibrary.offbluish,
            borderTopWidth: 2,
            borderBottomWidth: 2,
        },
        flip_button: {
            borderColor: 'white',
            borderRadius: 50,
            borderWidth: 1,
            maxWidth: 80,
            maxHeight: 78,
            width: '22%',
            height: '15%',
            zIndex: 10,
            backgroundColor: 'black',
            bottom: '-10%',
            position: 'absolute'
        },
        name_text: {
            fontFamily: 'Beleren',
            color: 'white',
            fontSize: deviceType === 'phone' ? 24 : 42,
        },
        card_info: {
            width: '100%',
        },
        text_container: {
            display: 'flex',
            flexDirection: 'column',
            borderColor: colorLibrary.offbluish,
            borderBottomWidth: 1,
            paddingLeft: 5,
            paddingRight: 5
        },
        rules_header: {
            fontFamily: 'Beleren',
            alignSelf: 'center',
            fontSize: deviceType === 'phone' ? 20 : 34,
            textDecorationLine: 'underline'
        },
        oracle_text: {
            fontFamily: 'Beleren',
            color: 'white',
            fontSize: deviceType === 'phone' ? 18 : 28
        },
        rules_text: {
            color: 'black',
            fontSize: deviceType === 'phone' ? 18 : 28
        },
        set_button_container: {
            position: 'absolute',
            top: '100%'
        },
        options_container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            width: '100%',
        },
        set_list: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },
        list_container: {
            flexDirection: 'row',
            display: 'flex',
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },
        btns_row: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
        },
        svg_btn: {
            marginTop: 2,
            backgroundColor: colorLibrary.lightbluish,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderColor: 'black',
            borderWidth: 1,
            zIndex: 2,
        },
        svg_container: {
            ...buttonStyles,
            marginTop: 2,
            backgroundColor: colorLibrary.lightbluish,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderColor: 'black',
            borderWidth: 1,
        },
        lang_btn_container: {
            marginTop: 2,
            backgroundColor: colorLibrary.lightbluish,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderColor: 'black',
            borderWidth: 1,
        },
        set_icon: {
            ...setIconStyles
        },
        lang_text_container: {
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            margin: 2
        },
        lang_text: {
            fontFamily: 'Beleren',
            color: 'black',
            fontSize: deviceType === 'phone' ? 24 : 32
        },
        image_container: {
            marginTop: 50,
            marginBottom: 20,
            justifyContent: 'center',
            ...imageStyle.image_dimensions,
        },
        card_image: {
            resizeMode: 'cover',
            position: 'absolute',
            ...Platform.select({
                ios: {
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 5,
                },
            }),
            borderColoe: 'black', borderWidth: 1,
            ...imageStyle.image_dimensions
        },
        caption_container: {
            width: '100%',
            position: 'absolute',
            bottom: -70,
            height: 70,
            alignSelf: 'baseline',
        },
        ...imageStyle,

    })
}
export default CardContainer