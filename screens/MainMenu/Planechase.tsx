import { Text, Image, View, useWindowDimensions, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import planechaseImages, { PlaneswalkerSvg } from '../../constants/PlanechaseImages';
import { GameContext, GameContextProps } from '../../GameContext';
import Svg, { G, Path, Rect } from 'react-native-svg';
import shuffle from '../../functions/shuffler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { staticTextScaler, textScaler } from '../../functions/textScaler';
import { Dimensions } from '../..';
import { OptionsContext, OptionsContextProps } from '../../OptionsContext';

/*
deck + discard will work as history.
new plane handled by handlePlaneswalk, for die result or next button,
prev button will show last plane in discard (discard.length -1)
*/
const Planechase: React.FC = ({ }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { setPlanarData, planarData, globalPlayerData } = useContext<GameContextProps>(GameContext)
    const { deviceType } = useContext<OptionsContextProps>(OptionsContext)
    const dieFaces = ['planeswalker', null, null, null, null, 'chaos']
    const [currentPlane, setCurrentPlane] = useState<string>('')
    const [deck, setDeck] = useState<string[]>([])
    const [discard, setDiscard] = useState<string[]>([])
    const [rollCost, setRollCost] = useState<number>(0)
    const [currentRoll, setCurrentRoll] = useState<string | null>()
    const [dieContainerWidth, setDieContainerWidth] = useState<number>()
    const [currentHistory, setCurrentHistory] = useState<number>(0)

    useEffect(() => {
        setCurrentPlane(planarData.currentPlane)
        setDeck(planarData.deck)
        setDiscard(planarData.discard)
    }, [])

    const handlePlaneswalk = () => {
        let newDeck = deck;
        /* 
        when 1 card left, shuffle discard + last card together for new deck
        */
        if (newDeck.length === 1) {
            const filterDeck = discard.filter(c => c !== undefined)
            newDeck = shuffle([...filterDeck, newDeck[0]])
            setDiscard([])
        } else {
            newDeck = deck.filter(c => c !== currentPlane)
            setDiscard([...discard as string[], currentPlane])
        }
        const newPlane = newDeck[0]
        setCurrentPlane(newPlane)
        setDeck(newDeck)
    }
    /*
    1) if planeswalker, 
        currentplane -> discard,  
        new random card from deck,
        filter new card from deck
    2) if deck.length === 0, deck === discard, discard === []
    */
    const rollDie = () => {
        const random = Math.floor(Math.random() * dieFaces.length)
        const result = dieFaces[random]
        setCurrentRoll(result)
        setRollCost(rollCost + 1)
        if (result === 'planeswalker') {
            handlePlaneswalk()
        }
    }

    const handleNav = () => {
        Object.keys(globalPlayerData).length > 0 ? navigation.navigate('Game', { menu: false }) : navigation.navigate('GlobalMenu')
        setPlanarData({
            currentPlane: currentPlane,
            deck: deck,
            discard: discard
        })
    }

    const getDieDimensions = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout
        if (width !== 0) {
            setDieContainerWidth(width)
        }
    }

    /*
    go through discard, starting from end.
    history cannot be greater than discard size.
    */
    const handleBackPlane = () => {
        if (currentHistory < discard.length) {
            const nextHistory = currentHistory + 1
            setCurrentHistory(nextHistory)
            const lastPlane = discard[discard.length - nextHistory]
            setCurrentPlane(lastPlane)
        }

    }


    const handleNextPLane = () => {
        /*
        if going through discard, go back toward current plane
        */
        if (currentHistory > 0) {
            const nextHistory = currentHistory - 1
            setCurrentHistory(nextHistory)
            const lastPlane = discard[discard.length - nextHistory]
            if (lastPlane !== undefined) {
                setCurrentPlane(lastPlane)
            }
        } else {
            /*
            if @ current plane, new random plane
            */
            handlePlaneswalk()
        }
    }

    return (
        <View style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black'
        }}>
            <View testID='planechase_wrapper'
                style={styles.planechase_wrapper}
            >
                <View testID='planechase_container'
                    style={styles.planechase_container}
                >
                    <View nativeID='image_container'
                        style={styles.image_container}
                    >
                        <Pressable nativeID='planechase_back'
                            accessibilityLabel='back plane.'
                            style={[styles.plane_nav_button, styles.plane_nav_back]}
                            onPressOut={() => handleBackPlane()}
                        >
                            <Svg viewBox='0 0 20 20'>
                                <Path stroke={'black'}
                                    d='M13 4l-6 6 6 6'
                                />
                            </Svg>
                        </Pressable>
                        {/* Image button */}
                        <Pressable testID='plane_image_button'
                            onPressIn={() => handleNav()}
                            style={styles.image_button}
                            accessibilityLabel={Object.keys(globalPlayerData).length > 0 ? "Back to Game" : "back to main menu"}
                        >
                            <Image source={planechaseImages.phenomenon[currentPlane] ? planechaseImages.phenomenon[currentPlane] : planechaseImages.planes[currentPlane]}
                                style={styles.plane_image}
                                alt={currentPlane}
                            />
                        </Pressable>

                        <Pressable nativeID='planechase_next'
                            accessibilityLabel='next plane.'
                            style={[styles.plane_nav_button, styles.plane_nav_next]}
                            onPressOut={() => handleNextPLane()}
                        >
                            <Svg viewBox='0 0 20 20'>
                                <Path stroke={'black'}
                                    d='M7 16l6-6-6-6'
                                />
                            </Svg>
                        </Pressable>
                    </View>

                    {/* Die Container */}
                    <View testID='diecontainer'
                        onLayout={(e) => getDieDimensions(e)}
                        style={styles.diecontainer}>
                        <View
                            testID='die_text_container'
                            style={styles.die_text_container}
                        >
                            <Text style={styles.die_text}>
                                Roll them planar bones!
                            </Text>
                            <Pressable style={styles.die}
                                testID="die"
                                onPressIn={() => rollDie()}
                                accessibilityLabel="planar die roller"
                            >
                                {
                                    currentRoll === 'planeswalker' ?
                                        <PlaneswalkerSvg viewBox={"0 0 600 1200"} fillColor='white' />
                                        : currentRoll === 'chaos' ?
                                            <Svg viewBox='-50 -100 700 700'
                                                accessibilityLabel='Chaos'
                                            >
                                                <G transform={"translate(-41.263568,-24.637031)"} >
                                                    <Path d="m 421.97231,24.637031 c -183.83967,8.4 21.26494,164.969709 -82.41985,247.499589 0,0 -0.014,0.028 -0.0279,0.028 -0.006,-0.028 -0.0196,-0.0391 -0.035,-0.0503 -0.51002,0.20408 -0.96004,0.44004 -1.46503,0.64496 -72.61987,29.39505 -153.4747,-88.57484 -155.82971,35.3798 38.34993,-57.5298 55.83488,-1.36486 118.87477,-4.88492 C 270.45464,343.70423 285.46464,411.5739 234.41973,422.61885 141.16991,442.78386 72.935055,329.42404 78.620016,258.27417 91.245009,100.26459 215.06975,28.429727 338.02453,35.834683 175.27484,3.2447686 37.310135,137.37951 41.35011,276.51915 c 4.640014,159.54973 89.28481,237.6346 219.20453,248.1246 183.83964,-8.38988 -21.26495,-164.9798 82.41992,-247.49948 0.008,0 0.014,-0.028 0.028,-0.028 0.014,0.028 0.0196,0.0391 0.0349,0.0503 0.51,-0.20409 0.95999,-0.44005 1.46998,-0.64497 72.61487,-29.39505 153.47966,88.57459 155.82469,-35.38007 -38.34491,57.5298 -55.83491,1.36513 -118.87475,4.88491 30.61492,-40.44978 15.61493,-108.31966 66.65484,-119.35465 93.25483,-20.16496 161.47967,93.18472 155.79471,164.33458 C 591.29195,449.02636 467.46217,520.85111 344.50744,513.44615 507.25712,546.03612 645.22182,411.90122 641.17681,272.75168 636.54183,113.2119 551.88703,35.137045 421.97231,24.637059 z"
                                                        fill={"white"}
                                                    />
                                                </G>
                                            </Svg>
                                            :
                                            <Svg viewBox='0 0 24 24'>
                                                <Rect x={4} y={4} width={16} height={16} rx={2} stroke={'white'} strokeWidth={1} strokeLinecap={'round'} ></Rect>
                                            </Svg>
                                }
                            </Pressable>
                        </View>
                        <View testID='mana_cost_container'
                            style={styles.mana_cost_container}
                        >
                            <Text style={[styles.text_style, {
                                fontSize: dieContainerWidth ? textScaler(String(rollCost).length,
                                    { height: dieContainerWidth! / 2, width: dieContainerWidth! / 2 },
                                    deviceType === 'phone' ? 60 : 80,
                                ) : 18
                            }]}>
                                {rollCost}
                            </Text>
                        </View>

                        {/* Reset button */}
                        <Pressable
                            nativeID='reset_button'
                            style={styles.reset_button}
                            onPress={() => setRollCost(0)}
                            accessibilityLabel="reset roll mana cost"
                        >
                            <Svg viewBox='0 0 25 25'
                                height={'100%'}
                            >
                                <Path d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9"
                                    stroke={"white"}
                                ></Path>
                            </Svg>
                        </Pressable>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    planechase_wrapper: {
        height: '95%',
        width: '100%',
    },
    planechase_container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'black',
        height: '100%',
        width: '100%',
    },
    image_container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        width: '100%',
    },
    image_button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    plane_image: {
        resizeMode: 'contain',
        transform: [
            { rotate: '180deg' },
        ],
        height: '100%',
        width: '100%'
    },
    plane_nav_button: {
        height: 90,
        width: 90,
        backgroundColor: `hsla(44, 0%, 100%, .5)`,
        zIndex: 1,
        transform: [
            { rotate: '90deg' },
        ],
    },
    plane_nav_next: {
        top: -90
    },
    plane_nav_back: {
        top: 90
    },
    diecontainer: {
        minWidth: 110,
        borderWidth: 1,
        borderColor: 'white',
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '20%',
    },
    die: {
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '70%'
    },
    die_text_container: {
        alignItems: 'center',
        width: '30%',
        maxWidth: 200,
        transform: [
            { rotate: '90deg' },
        ],
    },
    die_text: {
        fontFamily: "Beleren",
        color: 'white',
        width: '100%',
        textAlign: 'center',
        fontSize: staticTextScaler(12)
    },
    mana_cost_container: {
        width: '20%',
        height: '50%',
        maxWidth: 125,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#CAC5C0',
        borderRadius: 60,
        transform: [
            { rotate: '90deg' },
        ],
    },
    text_style: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Beleren',
    },
    reset_button: {
        width: 90,
    }
})

export default Planechase