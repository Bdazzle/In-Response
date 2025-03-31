import { StyleSheet, View, Text, Image, Pressable, Animated, ImageStyle } from "react-native"
import { Card, Rulings, StringProperties } from ".."
import FlipCard from "../components/Flipcard"
import { useContext, useEffect, useState } from "react"
import { SvgUri } from "react-native-svg"
import useFadeDownAnimation from "../hooks/useFadeDownAnimation"
import { OptionsContext, OptionsContextProps } from "../OptionsContext"
import { colorLibrary } from "../constants/Colors"
import languageKey from "../constants/languageKey"

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
    // const buttonSize  = 42;//svg size + margins
    const chunk = 9
    const totalChunks = setOptions ? Math.ceil(Object.entries(setOptions).length / chunk) : 1
    const chunkedSets = [...Array(totalChunks)].map((_, i) => Object.entries(setOptions!).slice(i * chunk, (i + 1) * chunk))
    const { opacityVal: setOpacityVal,
        zIndexVal: setZIndexVal,
        translateYVal: setTranslateYVal,
        fadeStyle: setFadeStyle
    } = useFadeDownAnimation()
    const { opacityVal: langOpacityVal,
        zIndexVal: langZIndexVal,
        translateYVal: langTranslateYVal,
        fadeStyle: langFadeStyle } = useFadeDownAnimation()

        /**
         * check for new card data when component loads, 
         * so stale data (from a previoulsy searched card) isn't displayed
         */
    useEffect(() => {
        setCurrentSet(cardData.versions[0].set_name as keyof StringProperties<Card>)
        setCurrentLang(cardData.versions[0].lang as string)

        const sets = cardData.versions.reduce((acc, curr) => {
            const { set_name, set_icon_svg_uri } = curr
            if (!acc) {
                acc = {}
            }
            if (!acc[set_name as keyof StringProperties<Card>]) {
                acc[set_name] = set_icon_svg_uri as string
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
        }, [] as string[])

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

    return (
        <View testID="sets_container" style={styles().sets_container}>
            <View testID="set_buttons_container"
            >
                <Pressable testID="svg_container"
                    accessibilityRole="button"
                    accessibilityLabel="change set"
                    accessibilityHint={`current set ${currentSet}`}
                    style={({ pressed }) => [styles(deviceType).svg_container, {
                        opacity: pressed ? .5 : 1,
                        zIndex: 2
                    },]}
                    onPress={() => setPressedSet(!pressedSet)}
                >
                    {
                        setOptions &&
                        <SvgUri uri={setOptions[currentSet as keyof typeof setOptions]}
                            style={styles(deviceType).set_icon}
                            accessibilityLabel={currentSet}
                        />
                    }
                </Pressable>
                <Animated.View testID="list_container"
                    style={[styles(deviceType).list_container,
                    {
                        opacity: setOpacityVal,
                        zIndex: setZIndexVal,
                        transform: [{
                            translateY: setTranslateYVal
                        }]
                    }
                    ]}
                >
                    {
                        chunkedSets.map((setArr, c_index) => {
                            return (
                                <Animated.View key={c_index}
                                    style={styles().set_list}
                                >
                                    {
                                        setOptions &&
                                        setArr.filter(set => set[0] !== currentSet).map((set, index) => {
                                            return (
                                                <Pressable key={index}
                                                    accessibilityRole="button"
                                                    onPress={() => handleSetSelect(set[0])}
                                                    style={({ pressed }) => [styles(deviceType).svg_container,
                                                    {
                                                        opacity: pressed ? .5 : 1,
                                                    },
                                                    ]}
                                                >
                                                    <SvgUri uri={set[1] as string} width={40} height={40} accessibilityLabel={set[0]} />
                                                </Pressable>
                                            )
                                        })
                                    }
                                </Animated.View>
                            )
                        })
                    }
                </Animated.View>
            </View>

            <View testID="lang_buttons_container"
            >
                <Pressable testID="svg_container"
                    accessibilityRole="button"
                    accessibilityLabel="languages"
                    accessibilityHint={`current language ${languageKey[currentLang]}`}
                    style={({ pressed }) => [styles(deviceType).svg_container,
                    {
                        opacity: pressed ? .5 : 1,
                    },
                    ]}
                    onPress={() => handleLangPress(currentLang)}
                >
                    <Text style={styles(deviceType).lang_text}>{currentLang}</Text>
                </Pressable>
                {
                    langPress &&
                    <Animated.View style={[styles(deviceType).lang_list,
                    {
                        opacity: langOpacityVal,
                        zIndex: langZIndexVal,
                        transform: [{
                            translateY: langTranslateYVal
                        }]
                    }
                    ]}
                    >
                        {
                            langOptions.filter(l => l !== currentLang).map((abrv, index) => {
                                return (
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel={languageKey[abrv]}
                                        style={({ pressed }) => [styles(deviceType).svg_container, {
                                            opacity: pressed ? .5 : 1,
                                        },]} key={index}
                                        onPress={() => handleLangPress(abrv)}
                                    >
                                        <Text style={styles(deviceType).lang_text}>{abrv}</Text>
                                    </Pressable>
                                )
                            })
                        }
                    </Animated.View>
                }
            </View>

        </View>
    )
}

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
        setCurrentVersion(cardData.versions[0])
    }, [cardData])
 
    const handleVersionChange = (card: Card) => {
        if (card) {
            setCurrentVersion(card)
        }
    }
    /**
     * when current version changes, we need it's set/language images and text,
     * check for printed_text if foreign language is selected, otherwise display oracle_text for EN
     * set images of set/lang version of card.
     */
    useEffect(() => {
        if (currentVersion) {
            if (currentVersion?.card_faces) {
                currentVersion.card_faces[0].printed_text
                setCardFront(currentVersion.card_faces[0].image_uris?.normal)
                setCardBack(currentVersion.card_faces[1].image_uris?.normal)
                if (showFront) {
                    setOracleText(currentVersion.card_faces[0].oracle_text)
                    currentVersion.card_faces[0].printed_text ? setOracleText(currentVersion.card_faces[0].printed_text) : setOracleText(currentVersion.card_faces[0].oracle_text)
                } else {
                    setOracleText(currentVersion.card_faces[1].oracle_text)
                    currentVersion.card_faces[1].printed_text ? setOracleText(currentVersion.card_faces[1].printed_text) : setOracleText(currentVersion.card_faces[1].oracle_text)
                }
            } else {
                setCardFront(currentVersion.image_uris?.normal)
                currentVersion.printed_text ? setOracleText(currentVersion?.printed_text as string) : setOracleText(currentVersion?.oracle_text as string)
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

    useEffect(() => {
        if (cardData.versions[0].card_faces) {
            setCardFront((cardData.versions[0] as Card).card_faces?.[0].image_uris!.normal)
            setCardBack((cardData.versions[0] as Card).card_faces?.[1].image_uris!.normal)
        } else {
            setCardFront((cardData.versions[0].image_uris as Card).normal as string)
        }
    }, [cardData])

    return (
        <View testID="card_container"
            style={styles().card_container}
        >
            <Text style={styles(deviceType).name_text}>{name}</Text>
            {
                cardData.versions[0].card_faces ?
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
                        <Text style={styles(deviceType).rules_header}>Rules</Text>
                        {
                            Object.values(cardData.rules).map((rule, index) => {
                                return <Text key={`rule_${index}`}
                                    style={styles(deviceType).rules_text}>
                                    {`${index + 1}). ${rule.comment}`}
                                </Text>
                            })
                        }
                    </View>
                }
                {/* <View testID="prices">

                            </View> */}
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
            borderColor: colorLibrary.offbluish,
            borderTopWidth: 2,
            borderBottomWidth: 2
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
            width: '100%'
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
        sets_container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            width: '100%',
        },
        list_container: {
            flexDirection: 'row',
            marginTop: deviceType === 'phone' ? 42 : 62,
            display: 'flex',
            position: 'absolute',
            backgroundColor: colorLibrary.bluish,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },
        svg_container: {
            marginTop: 2,
            ...buttonStyles,
            backgroundColor: colorLibrary.lightbluish,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderColor: 'black', borderWidth: 1,
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
        set_list: {
            flexDirection: 'column',
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10
        },
        lang_list: {
            flexDirection: 'column',
            backgroundColor: colorLibrary.bluish,
            marginTop: deviceType === 'phone' ? 42 : 62,
            display: 'flex',
            position: 'absolute',
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10
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