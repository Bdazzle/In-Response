import React, { useContext, useEffect, useRef, useState } from "react"
import { Animated, Easing, Pressable, StyleSheet, Text, View, LayoutChangeEvent, ColorValue } from 'react-native';
import { GameContext, GameContextProps } from "../GameContext"
import Svg, { Path } from "react-native-svg";
import { cdmgLineHeight, cdmgScaler, cNameScaler, handleTaxSize, taxLineHeight, textScaler } from "../functions/textScaler";
import getDimensions from "../functions/getComponentDimensions";

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
position is index order(starts @ 0) from top to bottom of individual commander damage trackers, 
componentHeight is height of element being scaled
*/
function scaleY(totalPlayers: number, position: number, componentHeight: number): number {
    switch (totalPlayers) {
        case 2: {
            return -componentHeight * .2
        };
        case 3: {
            return position === 0 ? componentHeight/4 : -componentHeight * 1
        }
        case 4: {
            return position === 0 ? componentHeight / 1.5
                :
                position === 1 ? -componentHeight / 3
                    :
                    -componentHeight * 1.6
        }
        default: return componentHeight
    }
}

/*
scale and translateY need to change depending on number of players and opponentID
Commander damage number display only works if opponent name is 1 line
*/
const Tracker: React.FC<TrackerProps> = ({ playerID, position, oppponentID, opponentName, scaleTracker,
    showScale,
    componentDimensions }) => {
    const { globalPlayerData, dispatchGlobalPlayerData } = useContext(GameContext) as GameContextProps
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const [textWrapperDimensions, setTextWrapperDimensions] = useState<{ width: number, height: number }>({ width: 75, height: 33 })
    const totalPlayers = Object.keys(globalPlayerData).length

    const handleDamageChange = (val: number) => {
        if (val < 0) {
            val = 0
        }
        dispatchGlobalPlayerData({
            playerID: playerID as number,
            field: 'commanderDamage',
            subField: oppponentID,
            value: val
        })
    }

    let scaleVal = useRef(new Animated.Value(1)).current
    let translateXVal = useRef(new Animated.Value(0)).current
    let translateYVal = useRef(new Animated.Value(0)).current
    
    useEffect(() => {
        const scaleTarget = isPressed === false ? 1 : totalPlayers === 3 ? 3 : 3.5
        const targetXVal = isPressed === false ? 0 : componentDimensions!.width * 2.25
        const targetYVal = isPressed === false ? 0 : scaleY(totalPlayers, position, componentDimensions!.height)
        
        Animated.parallel([
            Animated.timing(
                translateXVal, {
                toValue: targetXVal,
                duration: 100,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true
            }
            ),
            Animated.timing(
                translateYVal, {
                toValue: targetYVal,
                duration: 100,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true
            }
            ),
            Animated.timing(scaleVal, {
                toValue: scaleTarget,
                duration: 100,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true
            })
        ]).start()  
    }, [isPressed])

    const handlePress = () => {
        setIsPressed(!isPressed)
        scaleTracker(!showScale)
    }
    /*for damage modal functionality */
    useEffect(() => {
        if (showScale === false) {
            setIsPressed(false)
        }
    }, [showScale])

    const scaleStyles = {
        transform: [
            {
                translateX: translateXVal
            },
            {
                translateY: translateYVal
            },
            {
                scale: scaleVal
            },
        ],
    }

    const trackerDims = () : number =>{
        return totalPlayers === 4 ? 100 : totalPlayers == 3 ? 80 : 35
    }

    return (
        <Animated.View testID={`${opponentName}_damage_container`}
            aria-expanded={Number(scaleVal) > 1 ? true : false}
            style={
                [
                    scaleStyles,
                    {
                        backgroundColor: globalPlayerData[oppponentID].colors.primary,
                        height: `${trackerDims() / (totalPlayers - 1)}%`,
                        zIndex: isPressed === true ? 10 : 0,
                        borderRadius: 5,
                    }
                ]}
            collapsable={false}
        >
            <Pressable testID={`${opponentName}_pressable`}
                style={styles().player_pressable}
                onPress={() => handlePress()}
                accessibilityLabel={`Commander damage from ${opponentName}`}
                accessibilityHint="press to enlarge, and add or subtract"
            >
                <View>
                    <Text
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={[styles(globalPlayerData[oppponentID].colors.secondary).all_text,
                        {
                            fontSize: totalPlayers === 3 && playerID !== 3 ?
                                cNameScaler(opponentName) * 1.2
                                :
                                totalPlayers === 4 ?
                                    cNameScaler(opponentName)
                                    :
                                    cNameScaler(opponentName) * 1.2,
                            height: '30%',
                        }
                        ]}
                        accessibilityLabel={`opponent ${opponentName}`}
                    >
                        {opponentName}
                    </Text>
                    <View
                        style={styles().damage_row}
                    >
                        {/*C damage plus*/}
                        {
                            isPressed &&
                            <Pressable
                                testID={`${opponentName}_plus`}
                                onPress={() => handleDamageChange(globalPlayerData[playerID!].commander_damage![oppponentID] + 1)}
                                onLongPress={() => handleDamageChange(globalPlayerData[playerID!].commander_damage![oppponentID] + 10)}
                                delayLongPress={300}
                                style={({ pressed }) => [styles().damage_pressable, {
                                    height: '100%',
                                    position: 'absolute',
                                    zIndex: 10,
                                    opacity: pressed ? .5 : 1,
                                }]}
                                accessibilityLabel="Add Commander Damage"
                                accessibilityHint={`Add commander damage from ${opponentName}`}
                            >
                                <Svg viewBox='0 0 600 600'
                                    style={{
                                        width: componentDimensions && componentDimensions.width / 3,
                                        height: componentDimensions?.height && componentDimensions.height / 2,
                                    }}
                                    accessibilityLabel="plus icon"
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
                            /*Player Damage total*/
                            globalPlayerData[playerID!] &&
                            <View nativeID="cdmgTotalWrapper"
                                onLayout={(event) => getDimensions(event, setTextWrapperDimensions)}
                                style={styles().cdmgTotalWrapper}
                            >
                                <Text
                                    style={[styles(globalPlayerData[oppponentID].colors.secondary).all_text,
                                    textWrapperDimensions && {
                                        fontSize: cdmgScaler(globalPlayerData[playerID!].commander_damage![oppponentID], totalPlayers, playerID, isPressed),
                                        lineHeight: textWrapperDimensions && cdmgLineHeight(
                                            textWrapperDimensions,
                                            totalPlayers,
                                            globalPlayerData[playerID!].commander_damage![oppponentID]
                                        ),
                                        paddingRight: '2%'
                                    }]}
                                    accessibilityLiveRegion="polite"
                                    accessibilityLabel={`${globalPlayerData[playerID!].commander_damage![oppponentID]} commander damage from ${opponentName}`}
                                >
                                    {globalPlayerData[playerID!].commander_damage![oppponentID]}
                                </Text>
                            </View>
                        }
                        {/*C damage minus*/}
                        {
                            isPressed &&
                            <Pressable
                                testID={`${opponentName}_minus`}
                                onPress={() => handleDamageChange(globalPlayerData[playerID!].commander_damage![oppponentID] - 1)}
                                onLongPress={() => handleDamageChange(globalPlayerData[playerID!].commander_damage![oppponentID] - 10)}
                                delayLongPress={300}
                                style={({ pressed }) => [styles().damage_pressable, {
                                    height: '100%',
                                    position: 'absolute',
                                    zIndex: 10,
                                    marginLeft: '75%',
                                    opacity: pressed ? .5 : 1,
                                }]}
                                accessibilityLabel="Subtract Commander Damage"
                                accessibilityHint={`subtract commander damage from ${opponentName}`}
                            >
                                <Svg viewBox='0 0 360 360'
                                    style={{
                                        width: componentDimensions && componentDimensions.width / 3.5,
                                        height: componentDimensions?.height && componentDimensions.height / 2,
                                    }}
                                    accessibilityLabel='minus icon'
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
                </View>
            </Pressable>
        </Animated.View >
    )
}

const CommanderDamage: React.FC<CommanderDamageProps> = ({ playerID, scaleTracker, showScale, gameType }) => {
    const { globalPlayerData, reset } = useContext(GameContext) as GameContextProps
    const [tax, setTax] = useState<number>(0)
    const [spellTax, setSpellTax] = useState<number>(0)
    const [pressDimensions, setPressDimensions] = useState<{ width: number, height: number }>()
    const totalPlayers = Object.keys(globalPlayerData).length

    useEffect(() => {
        if (reset === true) {
            setTax(0)
            setSpellTax(0)
        }
    }, [reset])

    const getDimensions = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout
        if (width !== 0 && height !== 0) {
            setPressDimensions({ width: width, height: height })
        }
    }

    const taxDimensions = () =>{
        return totalPlayers === 4 ? '20%' : '25%'
    }

    return (
        <View style={[styles().cdamage_container,{
            marginTop:totalPlayers === 2 ? 5 : 0,
        }]}
        >
            <Pressable style={[styles(globalPlayerData[playerID].colors.secondary, gameType).tax,{
                height: gameType === 'oathbreaker' ? '35%' : taxDimensions(),
            }]}
                onPress={() => setTax(tax + 1)}
                onLongPress={() => setTax(tax - 1)}
                onLayout={(e) => getDimensions(e)}
                accessibilityLabel={`Adjust ${globalPlayerData[playerID].screenName} Commander Tax`}
            >
                {
                    gameType === 'oathbreaker' ?
                        <View style={styles().oath_tax_text_wrapper}>
                            <Text
                                accessibilityLabel={`${globalPlayerData[playerID].screenName} commander tax`}
                                style={[styles(globalPlayerData[playerID].colors.secondary, gameType).tax_text,
                                {
                                    fontSize: pressDimensions ? textScaler(3, pressDimensions, undefined, 18) : 16
                                }
                                ]}>
                                Tax
                            </Text>
                        </View>
                        :
                        <View style={styles().tax_text_wrapper}
                            accessibilityLabel={`${globalPlayerData[playerID].screenName} commander tax`}
                        >
                            <Text style={[styles(globalPlayerData[playerID].colors.secondary, gameType).tax_letter, {
                                fontSize: pressDimensions ? textScaler(1, { ...pressDimensions, height: pressDimensions?.height * .3 }) : 16
                            }]}
                                accessible={false}
                            >T</Text>
                            <Text style={[styles(globalPlayerData[playerID].colors.secondary, gameType).tax_letter, {
                                fontSize: pressDimensions ? textScaler(1, { ...pressDimensions, height: pressDimensions?.height * .3 }) : 16
                            }]}
                                accessible={false}
                            >a</Text>
                            <Text style={[styles(globalPlayerData[playerID].colors.secondary, gameType).tax_letter, {
                                fontSize: pressDimensions ? textScaler(1, { ...pressDimensions, height: pressDimensions?.height * .3 }) : 16,
                                paddingBottom: 10
                            }]}
                                accessible={false}
                            >x</Text>
                        </View>
                }
                {/* Commander Tax  */}
                <Text
                    numberOfLines={1}
                    accessibilityLabel={`${globalPlayerData[playerID].screenName} ${tax} commander tax`}
                    style={[styles(globalPlayerData[playerID].colors.secondary).tax_total,
                    pressDimensions && {
                        fontSize: handleTaxSize(totalPlayers, playerID, String(tax), gameType),
                        lineHeight: taxLineHeight(pressDimensions.height, totalPlayers, gameType),
                        paddingLeft: gameType === 'commander' ? 3 : 0,
                    }]}>
                    {tax}
                </Text>
            </Pressable>
            {
                gameType === 'commander' ?
                    <View testID="trackers_container"
                        style={styles().tracker_container}
                    >
                        {
                    Object.keys(globalPlayerData).filter((pID: string) => Number(pID) !== playerID)
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
                        }
                    </View>
                    :
                    /* Spell Tax */
                    <Pressable style={[styles(globalPlayerData[playerID].colors.secondary, gameType).tax,{
                        height: '35%'
                    }]}
                        onPress={() => setSpellTax(spellTax + 1)}
                        onLongPress={() => setSpellTax(spellTax - 1)}
                        onLayout={(e) => getDimensions(e)}
                        accessibilityLabel={`Adjust ${globalPlayerData[playerID].screenName} spell Tax`}
                    >
                        <View style={styles().oath_tax_text_wrapper}>
                            <Text
                                accessibilityLabel={`${globalPlayerData[playerID].screenName} spell tax`}
                                style={[styles(globalPlayerData[playerID].colors.secondary, gameType).tax_text,
                                {
                                    fontSize: pressDimensions ? textScaler('Spell Tax'.length,
                                        pressDimensions,
                                        36,
                                        totalPlayers === 2 ? pressDimensions.height / "spell".length : (pressDimensions.height / "spell".length + 4)) : 16
                                }
                                ]}>
                                Spell Tax
                            </Text>
                        </View>
                        <Text
                            accessibilityLabel={`${globalPlayerData[playerID].screenName} ${spellTax} spell tax`}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles(globalPlayerData[playerID].colors.secondary).tax_total,
                            pressDimensions && {
                                fontSize: handleTaxSize(totalPlayers, playerID, String(spellTax), gameType),
                                lineHeight: pressDimensions && taxLineHeight(pressDimensions.height, totalPlayers, gameType),
                                paddingLeft: totalPlayers === 3 && playerID === 2 ? 4 : 0
                            }]}>
                            {
                                spellTax
                            }
                        </Text>
                    </Pressable>
            }
        </View>
    )
}

const styles = (textColor?: ColorValue | undefined, gameType?: string) => StyleSheet.create({
    cdamage_container: {
        height: '100%',
        width: '100%',
        marginLeft: 5,
        paddingBottom: 5,
    },
    tax: {
        paddingLeft: '10%',
        width: '90%',
        minHeight: 40,
        flexDirection: gameType === 'commander' ? 'row' : 'column',
        marginBottom: gameType === 'oathbreaker' ? 20 : 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tax_text_wrapper: {
        marginLeft: '10%',
        width: '20%',
        justifyContent: 'center',
        height: '100%',
    },
    oath_tax_text_wrapper: {
        justifyContent: 'center',
        width: '100%',
        marginTop: '15%',
    },
    tax_text: {
        fontFamily: 'Beleren',
        color: textColor,
        textAlignVertical: 'top',
    },
    tax_letter: {
        fontFamily: 'Beleren',
        color: textColor,
    },
    tax_total: {
        color: textColor,
        fontFamily: 'Beleren',
        letterSpacing: -2,
        height: '100%',
        width: '100%',
        textAlignVertical: 'top',
    },
    tracker_container:{
        height: '80%',
        width: '100%',
    },
    damage_row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '75%',
    },
    damage_pressable: {
        justifyContent: 'center',
        width: '25%',
    },
    cdmgTotalWrapper: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    player_pressable: {
        height: '100%',
        width: '100%'
    },
    all_text: {
        textAlign: 'center',
        fontFamily: 'Beleren',
        color: textColor,
        flexGrow: 1
    }
})

export default CommanderDamage