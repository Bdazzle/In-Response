import { StyleSheet, View, Text, Image, Pressable, Animated, ImageStyle, LayoutChangeEvent, StyleProp, ViewStyle, useWindowDimensions } from "react-native"
import { Card, Rulings, StringProperties } from "../index"
import FlipCard from "../components/Flipcard"
import { useContext, useEffect, useMemo, useState } from "react"
import { SvgUri } from "react-native-svg"
import useFadeDownAnimation from "../hooks/useFadeDownAnimation"
import { OptionsContext, OptionsContextProps } from "../OptionsContext"
import { colorLibrary } from "../constants/Colors"
import languageKey from "../constants/languageKey"
import ButtonGrid from "../components/ButtonGrid"

interface CardContainerProps {
    name: string
    cardData: {
        versions: Card[];
        rules: Rulings
    }
}

interface SetRowProps {
    cardData: {
        versions: Card[];
        rules: Rulings
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
    // const setEntries = 10
    const cols = 4
    const setsRows = Math.ceil(setEntries.length / cols)
    const langRows = Math.ceil(langOptions.length / cols)
    // const testEntries = [...Array(setEntries)].map((_, index) => String(index))
    const maxNormalRows = 7
    const setsRowDiff = setsRows - maxNormalRows
    const langsRowDiff = langRows - maxNormalRows
    const [setsScale, setSetsScale] = useState<number>(1)
    const [langScale, setLangScale] = useState<number>(1)
    /**
     * scale down button grids by 20% (.2) per row
     * for every row >= 8, reduce sizes by an amount? 1/5 (.2)?
     * if rows-8>0, dimensions * (diff * .2)?
     */
    useEffect(() => {
        if (setsRowDiff > 0) {
            const newScale = 1 - (setsRowDiff * .2)
            setSetsScale(newScale)
        }
        if (langsRowDiff > 0) {
            const newLangScale = 1 - (langsRowDiff * .2)
            setLangScale(newLangScale)
            console.log(langsRowDiff)
        }
    }, [setEntries, langOptions])

    /**
     * check for new card data when component loads, 
     * so stale data (from a previoulsy searched card) isn't displayed
     */
    useEffect(() => {
        const initVersion: Card[] = cardData.versions.filter((card) => card.lang === 'en') || cardData.versions[0]
        setCurrentSet(initVersion[0].set_name as keyof StringProperties<Card>)
        setCurrentLang(initVersion[0].lang)

        const sets = cardData.versions.reduce((acc, curr) => {
            const { set_name, icon_svg_uri } = curr
            if (!acc) {
                acc = {}
            }
            if (!acc[set_name as keyof StringProperties<Card>]) {
                acc[set_name] = icon_svg_uri as string
            }
            return acc
        }, {} as { [set_name: string]: string })

        setSetOptions(sets)
    }, [cardData])

    /**
     * get language options for a given set
     */
    const getLanguageOptions = (selectedSet: string) => {
        const languages = cardData.versions.reduce((acc, curr) => {
            if (!acc) {
                acc = []
            }
            if (curr.set_name === selectedSet && !acc.includes(curr.lang as string)) {
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
        setPressedSet(!pressedSet)
        const newLanguageOptions = getLanguageOptions(set)
        setLangOptions(newLanguageOptions)
        setCurrentLang(newLanguageOptions[0])
        setLangPressed(false)
        setCurrentSet(set as keyof StringProperties<Card>)
        const currentCard = cardData.versions.filter(card => card.set_name === set && card.lang === newLanguageOptions[0])
        handlePress(currentCard[0])
    }

    const handleLangPress = (lang: string) => {
        setLangPressed(!langPress)
        setCurrentLang(lang)
        const currentCard = cardData.versions.filter(card => card.lang === lang && card.set_name === currentSet)
        handlePress(currentCard[0])
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
     * Measure left screen to left button edge
     */
    const [ogSetsPos, setogSetsPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const handleSetBtnLayout = (event: LayoutChangeEvent) => {
        //distance between left screen edge and set button edge (for alignment)
        const { x, y } = event.nativeEvent.layout;
        setogSetsPos({ x, y })
    }

    /**
     * Measure difference between right button edge to right screen edge
     */
    // const [langXOffset, setLangXOffset] = useState<number>(0)
    // const [langY, setLangY] = useState<number>(0)
    // const { width: screenWidth } = useWindowDimensions()
    // const viewRef = useRef<View>(null);
    // const handleLangBtnLayout = (event: LayoutChangeEvent) => {
    // viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
    // const rightEdge = pageX + width;
    // const diff = screenWidth - rightEdge
    // setLangXOffset(Math.floor(diff))
    // const bottomEdge = pageY - height
    // setLangY(bottomEdge)
    // });  
    // }

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
                    onPress={() => setPressedSet(!pressedSet)}
                    onLayout={(e) => handleSetBtnLayout(e)}
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
                // onLayout={(e) => handleLangBtnLayout(e)}
                // ref={viewRef}
                >
                    <Text style={styles(deviceType).lang_text}>{currentLang}</Text>
                </Pressable>
            </View>

            <Animated.View testID="set_buttons_container"
                style={[styles(deviceType).set_button_container, {
                    transform: [
                        { scale: setsScale },
                    ],
                    transformOrigin: 'top left',
                    marginLeft: ogSetsPos.x,
                    zIndex: setZIndexVal,
                }]}
            >
                <Animated.View testID="list_container"
                    style={[styles(deviceType).list_container,
                    {
                        opacity: setOpacityVal,
                        transform: [{
                            translateY: setTranslateYVal
                        }],

                    }
                    ]}
                >
                    {/* <ButtonGrid testID="setsGrid" rows={Math.ceil(setEntries / cols)} cols={cols} entries={testEntries}
                        buttStyle={{
                            ...styles(deviceType).svg_btn,
                            // ...buttonStyles
                        }}
                        innerStyle={styles(deviceType).lang_text as StyleProp<ViewStyle>} onPress={handleLangPress} /> */}
                    <ButtonGrid rows={Math.ceil(Object.keys(setOptions).length / cols)} cols={cols}
                        entries={filteredSets}
                        buttStyle={styles(deviceType).svg_container}
                        innerStyle={styles(deviceType).set_icon}
                        onPress={handleSetSelect} />
                </Animated.View>
            </Animated.View>

            <Animated.View testID="lang_buttons_container"
                style={[styles(deviceType).set_button_container, {
                    alignSelf: 'flex-end',
                    marginRight: ogSetsPos.x,
                    transformOrigin: 'top right',
                    transform: [
                        { scale: langScale },
                    ],
                    zIndex: langZIndexVal,
                }]}
            >

                <Animated.View style={[styles(deviceType).list_container,//lang_list
                {
                    opacity: langOpacityVal,
                    transform: [{
                        translateY: langTranslateYVal
                    }],
                }
                ]}
                >
                    <ButtonGrid rows={Math.ceil((langOptions).length / cols)} cols={cols} entries={filteredLangs}
                        buttStyle={styles(deviceType).svg_container} onPress={handleLangPress}
                        innerStyle={styles(deviceType).lang_text as StyleProp<ViewStyle>} />
                    {/* <ButtonGrid testID="langGrid" rows={Math.ceil(setEntries/ cols)} cols={cols}
                        entries={testEntries}
                        buttStyle={styles(deviceType).svg_btn}
                        innerStyle={styles(deviceType).lang_text as StyleProp<ViewStyle>}
                        onPress={handleLangPress} /> */}
                </Animated.View>
            </Animated.View>
        </View>
    )
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

    /**
     * initialize component with first card in cardData,
     * or when card data changes, so new searches don't have stale data from previous results
     */
    useEffect(() => {
        const initVersion: Card[] = cardData.versions.filter((card) => card.lang === 'en') || cardData.versions[0]
        setCurrentVersion(initVersion[0])
    }, [cardData])

    const handleVersionChange = (card: Card) => {
        if (card) {
            setCurrentVersion(card)
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
                !name.includes('//') ? <Text style={styles(deviceType).name_text}>{name}</Text> :
                    <Text style={styles(deviceType).name_text}>{name}</Text>
            }
            {
                /*if no image_uri, has to be flip card*/
                !cardData.versions[0].image_uri ?
                    <View testID="flipcard_container"
                        style={styles(deviceType).flipcard_container}
                    >
                        <FlipCard
                            front={{ uri: cardFront }}
                            back={{ uri: cardBack }}
                            onFlip={() => setShowFront(!showFront)}
                            buttonStyle={styles().flip_button}
                            altBack={name.split('//')[1]}
                            altFront={name.split('//')[0]}
                        ></FlipCard>
                    </View>
                    :
                    <Image
                        source={{ uri: cardFront }}
                        alt={`${name}`}
                        style={styles(deviceType).card_image}
                    ></Image>
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
            flipcard_container: {
                height: 300,
                width: 220,
            },
            card_image: {
                height: 300,
                width: 220,
                resizeMode: 'cover'
            } as ImageStyle
        }
        :
        {
            flipcard_container: {
                height: 500,
                width: 360,
                borderColor: 'white', borderWidth: 1,
            },
            card_image: {
                height: 500,
                width: 360,
                resizeMode: 'cover'
            } as ImageStyle
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
            backgroundColor: colorLibrary.bluish,
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
            ...buttonStyles,
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
        ...imageStyle,

    })
}
export default CardContainer