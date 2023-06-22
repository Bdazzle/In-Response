import { Text, Image, View, useWindowDimensions, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import planechaseImages, { PlaneswalkerSvg } from '../../constants/PlanechaseImages';
import { GameContext, GameContextProps } from '../../GameContext';
import Svg, { G, Path, Rect } from 'react-native-svg';
import shuffle from '../../functions/shuffler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { textScaler } from '../../functions/textScaler';

const Planechase = ({ }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { setPlanarData, planarData, globalPlayerData } = useContext(GameContext) as GameContextProps
    const { height, width } = useWindowDimensions()
    const dieFaces = ['planeswalker', null, null, null, null, 'chaos']
    const [currentPlane, setCurrentPlane] = useState<string>('')
    const [deck, setDeck] = useState<string[]>([])
    const [discard, setDiscard] = useState<string[]>([])
    const [rollCost, setRollCost] = useState<number>(0)
    const [currentRoll, setCurrentRoll] = useState<string | null>()
    const [dieContainerWidth, setDieContainerWidth] = useState<number>()

    useEffect(() => {
        setCurrentPlane(planarData.currentPlane)
        setDeck(planarData.deck)
        setDiscard(planarData.discard)
    }, [])

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
            let newDeck = deck;
            /* 
            when 1 card left, shuffle discard + last card together for new deck
            */
            if (newDeck.length === 1) {
                newDeck = shuffle([...discard, newDeck[0]])
                setDiscard([])
            } else {
                newDeck = deck.filter(c => c !== currentPlane)
                setDiscard([...discard as string[], currentPlane])
            }
            const newPlane = newDeck[0]
            setCurrentPlane(newPlane)
            setDeck(newDeck)
        }
    }

    const handleNav = () => {
        Object.keys(globalPlayerData).length > 0 ? navigation.navigate('Game') : navigation.navigate('GlobalMenu')
        setPlanarData({
            currentPlane: currentPlane,
            deck: deck,
            discard: discard
        })
    }

    const getDimensions = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout
        if (width !== 0) {
            setDieContainerWidth(width)
        }
    }

    return (
        <View testID='planechase_wrapper'
            style={styles.planechase_wrapper}
        >
            <View testID='planechase_container'
                style={[styles.planechase_container, {
                    height: width,
                    width: height,
                }]}
            >
                {/* Image container */}
                <Pressable testID='plane_image_container'
                    onPressIn={() => handleNav()}
                    style={[styles.image_container, {
                        height: width,
                        width: height * .8, //works for phone
                    }]}
                    accessibilityLabel={Object.keys(globalPlayerData).length > 0 ? "Back to Game" : "back to main menu"}
                >
                    <Image source={planechaseImages.phenomenon[currentPlane] ? planechaseImages.phenomenon[currentPlane] : planechaseImages.planes[currentPlane]}
                        style={{
                            height: height * .8,
                            width: width < 900 ? width : '70%',
                            resizeMode: 'cover',
                            transform: [
                                { rotate: '90deg' },
                            ]
                        }}
                        alt={currentPlane}
                    />
                </Pressable>

                {/* Die Container */}
                <View testID='diecontainer'
                    onLayout={(e) => getDimensions(e)}
                    style={[styles.diecontainer, {
                        height: width,
                        width: height * .2,
                    }]}>
                    <View
                        testID='die_text_container'
                        style={styles.die_text_container}>
                        <Text style={styles.die_text}
                        >Roll them planar bones!</Text>
                        <Pressable style={[styles.die,
                        {
                            width: dieContainerWidth && dieContainerWidth as number * .7,
                            height: dieContainerWidth && dieContainerWidth as number * .7,
                        }]}
                            testID="die"
                            onPressIn={() => rollDie()}
                            accessibilityLabel="planar die roller"
                        >
                            {
                                currentRoll === 'planeswalker' ?
                                // "0 50 600 1100"
                                    <PlaneswalkerSvg viewBox={"0 0 600 1200"} fillColor='white' />
                                    // <Svg viewBox={"0 50 600 1100"}
                                    //     height={'100%'} width={'50%'}
                                    //     >
                                    //         <G transform={"translate(-128.125,398.84217)"}>
                                    //             <G transform={"matrix(4.0816327,0,0,-4.0816327,128.125,815.48356)"}>
                                    //                 <G test-id="g3779">
                                    //                     <G >
                                    //                         <G transform={"translate(145.458,184.2598)"}>
                                    //                             <Path d="m 0,0 c -1.245,32.734 -4.061,45.164 -5.927,45.164 -1.894,0 -2.49,-18.131 -4.979,-34.153 -2.49,-15.985 -6.874,-34.113 -6.874,-34.113 l -11.204,4.268 c 0,0 -3.141,23.131 -4.385,50.851 -1.216,27.721 -2.164,51.931 -5.63,51.931 -3.382,0.029 -4.031,-22.762 -5.276,-52.296 -1.246,-29.517 -5.601,-45.865 -5.601,-45.865 l -10.283,1.433 c 0,0 -4.98,25.602 -6.848,103.807 -0.433,18.509 -4.951,22.223 -4.951,22.223 0,0 -4.52,-3.714 -4.953,-22.223 -1.866,-78.205 -6.874,-103.807 -6.874,-103.807 l -10.257,-1.433 c 0,0 -4.382,16.348 -5.627,45.865 -1.245,29.534 -1.869,52.325 -5.276,52.296 -3.438,0 -4.386,-24.21 -5.659,-51.931 -1.216,-27.72 -4.33,-50.851 -4.33,-50.851 l -11.204,-4.268 c 0,0 -4.382,18.128 -6.872,34.113 -2.489,16.022 -3.113,34.153 -4.979,34.153 -1.868,0 -4.681,-12.43 -5.927,-45.164 -1.245,-32.693 -1.542,-39.084 -1.542,-39.084 0,0 36.777,-15.67 51.093,-56.223 14.343,-40.529 17.969,-75.72 18.077,-79.627 0.188,-6.064 4.33,-6.836 4.33,-6.836 0,0 3.6,0.772 4.33,6.836 0.459,3.879 3.734,39.098 18.075,79.627 14.318,40.553 51.095,56.223 51.095,56.223 0,0 -0.299,6.391 -1.542,39.084"
                                    //                                 fill={"white"}
                                    //                                 fillRule="nonzero"
                                    //                             />
                                    //                         </G>
                                    //                     </G>
                                    //                 </G>
                                    //             </G>
                                    //         </G>
                                    //     </Svg>
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
                        style={[styles.mana_cost_container, {
                            width: dieContainerWidth && dieContainerWidth as number / 2,
                            height: dieContainerWidth && dieContainerWidth as number / 2,
                        }]}
                    >
                        <Text style={[styles.text_style, {
                            fontSize: width < 900 ? textScaler(42) : textScaler(34),//works for tablet
                        }]}>{rollCost}</Text>
                    </View>

                    {/* Reset button */}
                            <Pressable
                            nativeID='reset_button'
                            style={[styles.reset_button ,{
                                height: width < 900 ? 30 : 50,
                                minHeight:90,
                                width:90,
                            }]}
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
    )
}

const styles = StyleSheet.create({
    planechase_wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
            { rotate: '90deg' },
        ]
    },
    planechase_container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'black',
    },
    image_container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    diecontainer: {
        minWidth: 110,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    die: {
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    die_text_container: {
        alignItems: 'center',
        width: '100%',
    },
    die_text: {
        fontFamily: "Beleren",
        color: 'white',
        width: '100%',
        textAlign: 'center',
        fontSize: textScaler(12)
    },
    mana_cost_container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#CAC5C0',
        borderRadius: 60,
    },
    text_style: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Beleren',
    },
    reset_button:{
        width:'20%',
    }
})

export default Planechase