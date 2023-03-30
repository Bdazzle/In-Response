import React, { useContext, useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, View, LayoutChangeEvent, ColorValue } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GameContext, GameContextProps } from "../GameContext"
import Svg, { Path } from "react-native-svg";
import { textScaler } from "../functions/textScaler";

interface CommanderDamageProps {
    playerID: number,
    scaleTracker: React.Dispatch<React.SetStateAction<boolean>>,
    showScale: boolean,
    gameType: string
}

interface TrackerProps {
    playerID: number;
    position: number;
    oppponentID: number;
    opponentName: string;
    scaleTracker: React.Dispatch<React.SetStateAction<boolean>>,
    showScale: boolean,
    componentDimensions: { width: number, height: number } | undefined
}

/*
position is index order(starts @ 0) from top to bottom, 
componentHeight is height of element being scaled
*/
function scaleY(totalPlayers: number, position: number, componentHeight: number): number {
    switch (totalPlayers) {
        case 2: {
            return -componentHeight
        };
        case 3: {
            return position === 0 ? componentHeight / 4 : -componentHeight
        }
        case 4: {
            return position === 0 ? componentHeight / 1.5
                :
                position === 1 ? -componentHeight / 3
                    :
                    -componentHeight * 1.4
        }
        default: return componentHeight
    }
}

/*
scale and translateY need to change depending on number of players and opponentID
Commander damage number display only works if opponent name is 1 line
*/
const Tracker: React.FC<TrackerProps> = ({ playerID, position, oppponentID, opponentName, scaleTracker, showScale, componentDimensions }) => {
    const { globalPlayerData, dispatchGlobalPlayerData } = useContext(GameContext) as GameContextProps
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const scaleVal = useSharedValue(0)
    const translateXVal = useSharedValue(0)
    const translateYVal = useSharedValue(0)
    const totalPlayers = Object.keys(globalPlayerData).length

    const handleDamageChange = (val: number) => {
        dispatchGlobalPlayerData({
            playerID: playerID as number,
            field: 'commanderDamage',
            subField: oppponentID,
            value: val
        })
    }

    useEffect(() => {
        scaleVal.value = isPressed === false ? 1 : 3.5
        translateXVal.value = isPressed === false ? 0 : componentDimensions!.width * 2
        translateYVal.value = isPressed === false ? 0 : scaleY(Object.keys(globalPlayerData).length, position, componentDimensions!.height)
    }, [isPressed])

    const handlePress = () => {
        setIsPressed(!isPressed)
        scaleTracker(!showScale)
    }

    useEffect(() => {
        if (showScale === false) {
            setIsPressed(false)
        }
    }, [showScale])

    const scaleStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(translateXVal.value, {
                        duration: 100,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    })
                },
                {
                    translateY: withTiming(translateYVal.value, {
                        duration: 100,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    })
                },
                {
                    scale: withTiming(scaleVal.value, {
                        duration: 100,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    })
                },
            ],
        }
    })

    return (
        <Animated.View testID={`${opponentName}_damage_container`}
            style={[scaleStyles,
                {
                    backgroundColor: globalPlayerData[oppponentID].colors.primary,
                    height: `${75 / (totalPlayers - 1)}%`,
                    maxHeight: totalPlayers === 2 ? `25%` : totalPlayers === 3 ? `30%` : `33%`,// 100/maximum # of potential players - 1
                    margin: '2%',
                    zIndex: isPressed === true ? 10 : 0,
                    borderRadius: 5,
                }
            ]}>
            <Pressable testID={`${opponentName}_pressable`}
                style={styles().player_pressable}
                onPress={() => handlePress()}
            >
                {({ pressed }) => (
                    <>
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={styles(globalPlayerData[oppponentID].colors.secondary).all_text}
                        >
                            {opponentName}
                        </Text>
                        <View
                            style={styles().damage_row}
                        >
                            {
                                isPressed &&
                                <Pressable
                                    testID={`${opponentName}_plus`}
                                    onPress={() => handleDamageChange(globalPlayerData[playerID!].commander_damage![oppponentID] + 1)}
                                    onLongPress={() => handleDamageChange(globalPlayerData[playerID!].commander_damage![oppponentID] + 10)}
                                    delayLongPress={300}
                                    style={styles().damage_pressable}
                                >
                                    <Svg viewBox='-50 0 600 600'
                                        style={{
                                            width: componentDimensions && componentDimensions.width / 5,
                                            height: componentDimensions?.height && componentDimensions.height / 2,
                                        }}
                                    >
                                        <Path d="M491.841,156.427c-19.471-45.946-51.936-85.013-92.786-112.637C358.217,16.166,308.893-0.007,256,0    c-35.254-0.002-68.946,7.18-99.571,20.158C110.484,39.63,71.416,72.093,43.791,112.943C16.167,153.779-0.007,203.104,0,256    c-0.002,35.255,7.181,68.948,20.159,99.573c19.471,45.946,51.937,85.013,92.786,112.637C153.783,495.834,203.107,512.007,256,512    c35.253,0.002,68.946-7.18,99.571-20.158c45.945-19.471,85.013-51.935,112.638-92.785C495.834,358.22,512.007,308.894,512,256    C512.002,220.744,504.819,187.052,491.841,156.427z M460.413,342.257c-16.851,39.781-45.045,73.723-80.476,97.676    c-35.443,23.953-78.02,37.926-123.936,37.933c-30.619-0.002-59.729-6.218-86.255-17.454    c-39.781-16.851-73.724-45.044-97.677-80.475C48.114,344.495,34.14,301.917,34.133,256c0.002-30.62,6.219-59.731,17.454-86.257    c16.851-39.781,45.045-73.724,80.476-97.676C167.506,48.113,210.084,34.14,256,34.133c30.619,0.002,59.729,6.218,86.255,17.454    c39.781,16.85,73.724,45.044,97.677,80.475c23.953,35.443,37.927,78.02,37.934,123.939    C477.864,286.62,471.648,315.731,460.413,342.257z"
                                            fill={globalPlayerData[oppponentID].colors.secondary}
                                        />
                                        <Path d="M389.594,239.301H272.699V122.406c0-9.222-7.477-16.699-16.699-16.699c-9.222,0-16.699,7.477-16.699,16.699v116.895    H122.406c-9.222,0-16.699,7.477-16.699,16.699s7.477,16.699,16.699,16.699h116.895v116.895c0,9.222,7.477,16.699,16.699,16.699    c9.222,0,16.699-7.477,16.699-16.699V272.699h116.895c9.222,0,16.699-7.477,16.699-16.699S398.817,239.301,389.594,239.301z"
                                            fill={globalPlayerData[oppponentID].colors.secondary}
                                        />
                                    </Svg>
                                </Pressable>
                            }
                            {
                                globalPlayerData[playerID!] && <Text
                                    style={[styles(globalPlayerData[oppponentID].colors.secondary).all_text,
                                    {
                                        fontSize: componentDimensions && (totalPlayers === 4 ? componentDimensions.height * .8 : totalPlayers === 3 ? componentDimensions.height : componentDimensions.height * .7), //works on phone
                                        lineHeight: componentDimensions && (totalPlayers === 4 ? componentDimensions.height * .8 : totalPlayers === 3 ? componentDimensions.height : componentDimensions.height * .7),
                                        width: isPressed ? '60%' : 'auto',
                                    }]}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >
                                    {globalPlayerData[playerID!].commander_damage![oppponentID]}
                                </Text>
                            }
                            {
                                isPressed &&
                                <Pressable
                                    testID={`${opponentName}_minus`}
                                    onPress={() => handleDamageChange(globalPlayerData[playerID!].commander_damage![oppponentID] - 1)}
                                    onLongPress={() => handleDamageChange(globalPlayerData[playerID!].commander_damage![oppponentID] - 10)}
                                    delayLongPress={300}
                                    style={styles().damage_pressable}
                                >
                                    <Svg viewBox='0 0 360 360'
                                        style={{
                                            width: componentDimensions && componentDimensions.width / 5,
                                            height: componentDimensions?.height && componentDimensions.height / 2,
                                        }}
                                    >
                                        <Path d="M281.633,48.328C250.469,17.163,209.034,0,164.961,0C120.888,0,79.453,17.163,48.289,48.328   c-64.333,64.334-64.333,169.011,0,233.345C79.453,312.837,120.888,330,164.962,330c44.073,0,85.507-17.163,116.671-48.328   c31.165-31.164,48.328-72.599,48.328-116.672S312.798,79.492,281.633,48.328z M260.42,260.46   C234.922,285.957,201.021,300,164.962,300c-36.06,0-69.961-14.043-95.46-39.54c-52.636-52.637-52.636-138.282,0-190.919   C95,44.042,128.901,30,164.961,30s69.961,14.042,95.459,39.54c25.498,25.499,39.541,59.4,39.541,95.46   S285.918,234.961,260.42,260.46z"
                                            fill={globalPlayerData[oppponentID].colors.secondary}
                                        />
                                        <Path d="M254.961,150H74.962c-8.284,0-15,6.716-15,15s6.716,15,15,15h179.999c8.284,0,15-6.716,15-15S263.245,150,254.961,150z"
                                            fill={globalPlayerData[oppponentID].colors.secondary}
                                        />
                                    </Svg>
                                </Pressable>
                            }
                        </View>
                    </>
                )}
            </Pressable>
        </Animated.View>
    )
}

const CommanderDamage: React.FC<CommanderDamageProps> = ({ playerID, scaleTracker, showScale, gameType }) => {
    const { globalPlayerData, reset } = useContext(GameContext) as GameContextProps
    const [tax, setTax] = useState<number>(0)
    const [tax2, setTax2] = useState<number>(0)
    const [pressDimensions, setPressDimensions] = useState<{ width: number, height: number }>()

    useEffect(() => {
        if (reset === true) {
            setTax(0)
            setTax2(0)
        }
    }, [reset])

    const getDimensions = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout
        if (width !== 0 && height !== 0) {
            setPressDimensions({ width: width, height: height })
        }
    }

    return (
        <View style={styles().cdamage_container}
        >
            <Pressable style={styles(globalPlayerData[playerID].colors.secondary, gameType).tax}
                onPress={() => setTax(tax + 1)}
                onLongPress={() => setTax(tax - 1)}
                onLayout={(e) => getDimensions(e)}
            >
                {
                    gameType === 'oathbreaker' ?
                        <View style={styles().oath_tax_text_wrapper}>
                            <Text style={styles(globalPlayerData[playerID].colors.secondary, gameType).tax_text}>Tax</Text>
                        </View>
                        :
                        <View style={styles().tax_text_wrapper}>
                            <Text style={styles(globalPlayerData[playerID].colors.secondary, gameType).tax_text}
                            >T</Text>
                            <Text style={styles(globalPlayerData[playerID].colors.secondary, gameType).tax_text}
                            >a</Text>
                            <Text style={[styles(globalPlayerData[playerID].colors.secondary, gameType).tax_text, {
                                paddingBottom: 5
                            }]}
                            >x</Text>
                        </View>
                }

                <Text
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    style={[styles(globalPlayerData[playerID].colors.secondary).tax_total,
                    {
                        fontSize: pressDimensions?.height,
                        lineHeight: pressDimensions?.height
                    }]}>{tax}</Text>
            </Pressable>
            {gameType === 'commander' ? Object.keys(globalPlayerData).filter((pID: string) => Number(pID) !== playerID)
                .map((id, index) => {
                    return <Tracker key={`${globalPlayerData[Number(id)].screenName}_tracker`}
                        playerID={playerID}
                        opponentName={globalPlayerData[Number(id)].screenName}
                        oppponentID={Number(id)}
                        position={index}
                        scaleTracker={scaleTracker}
                        showScale={showScale}
                        componentDimensions={pressDimensions}
                    />
                })
                :
                <Pressable style={styles(globalPlayerData[playerID].colors.secondary, gameType).tax}
                    onPress={() => setTax2(tax2 + 1)}
                    onLongPress={() => setTax2(tax2 - 1)}
                    onLayout={(e) => getDimensions(e)}
                >
                    <View style={styles().oath_tax_text_wrapper}>
                        <Text style={styles(globalPlayerData[playerID].colors.secondary, gameType).tax_text}>Spell Tax</Text>
                    </View>
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles(globalPlayerData[playerID].colors.secondary).tax_total,
                            {
                                fontSize: pressDimensions?.height,
                                lineHeight: pressDimensions?.height
                            }]}>{tax2}</Text>
                </Pressable>
            }
        </View>
    )
}

const styles = (textColor?: ColorValue | undefined, gameType?: string) => StyleSheet.create({
    cdamage_container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        marginLeft: 5,
        paddingBottom: 5,
    },
    tax: {
        paddingLeft: '8%',
        height: gameType === 'oathbreaker' ? '30%' : '25%',
        width: '100%',
        flexDirection: gameType === 'commander' ? 'row' : 'column',
        marginBottom: gameType === 'oathbreaker' ? 20 : 0,
        alignItems:'center',
    },
    tax_text_wrapper: {
        width: '15%',
        justifyContent: 'center',
        height: '100%'
    },
    oath_tax_text_wrapper: {
        justifyContent: 'center',
        width: '100%',
    },
    tax_text: {
        fontFamily: 'Beleren',
        fontSize: gameType === 'commander' ? textScaler(12) : textScaler(12),//works for phone
        color: textColor,
    },
    tax_total: {
        color: textColor,
        fontFamily: 'Beleren',
        letterSpacing: -2,
        height: '100%',
        width: '100%',
    },
    damage_row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    damage_pressable: {
        justifyContent: 'center',
    },
    player_pressable: {
        height: '100%'
    },
    all_text: {
        textAlign: 'center',
        fontFamily: 'Beleren',
        fontSize: textScaler(12),
        color: textColor
    }
})

export default CommanderDamage