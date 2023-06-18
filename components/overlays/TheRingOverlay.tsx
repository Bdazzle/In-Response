
import React, { useContext, useState } from "react"
import { View, Text, StyleSheet, Pressable, ImageSourcePropType, useWindowDimensions } from "react-native"
import { OptionsContext } from "../../OptionsContext"
import { Path, Svg } from "react-native-svg"
import { textScaler } from "../../functions/textScaler"
import FlipCard from "../counters/Flipcard"

interface RingProps {
    imageSource: {
        front: ImageSourcePropType,
        back: ImageSourcePropType
    }
}

const TheRing: React.FC<RingProps> = ({ imageSource }) => {
    const { deviceType } = useContext(OptionsContext)
    const [level, setLevel] = useState<number>(0)

    const levelChange = (num: number) => {
        level === num ? setLevel(num - 1) : setLevel(num)
    }

    /*
    change corners to triangle SVGs?
    may have to calculate ring_overlay_container height as a fraction of the screen size,
    to maintain consistency over devices
    */

    return (
        <View testID="ring_overlay_container"
            style={styles().ring_container}
        >
            <FlipCard front={imageSource.front} back={imageSource.back} />

            <View testID='ring_overlay_wrapper'
                style={deviceType === 'tablet' ?
                    styles().tablet_ring_overlay_wrapper :
                    styles().ring_overlay_wrapper}
            >
                <Pressable testID="level1"
                    onPress={() => levelChange(1)}
                    style={[level >= 1 ? styles().visible_level : styles().hidden_level,
                    styles(deviceType).level1]}
                >
                    <View testID="text-wrapper"
                        style={{
                            flex: 1,
                            backgroundColor: 'white'
                        }}
                    >
                        <Text style={styles(deviceType).overlay_text}>
                            Your Ring-bearer is legendary and can't be blocked by creatures with greater power.
                        </Text>
                    </View>
                </Pressable>

                <Svg testID="bottom-triangle-1"
                    viewBox="0 0 28 18"
                    width={deviceType === 'tablet' ? 26 : 24}
                    height={deviceType === 'tablet' ? 20 : 14}
                    fill={level >= 1 ? "white" : 'none'}
                    style={styles(deviceType).triangle}
                >
                    <Path d={"M2.39019 18.0983L10.6151 3.89171C11.0696 3.10655 11.2969 2.71396 11.5935 2.58211C11.8521 2.4671 12.1474 2.4671 12.4061 2.58211C12.7026 2.71396 12.9299 3.10654 13.3844 3.89171L21.6093 18.0983C22.0655 18.8863 22.2936 19.2803 22.2599 19.6037C22.2305 19.8857 22.0827 20.142 21.8534 20.3088C21.5904 20.5 21.1352 20.5 20.2246 20.5H3.77487C2.86435 20.5 2.40908 20.5 2.14613 20.3088C1.91677 20.142 1.769 19.8857 1.73959 19.6037C1.70588 19.2803 1.93398 18.8863 2.39019 18.0983Z"}
                    />
                </Svg>

                <Pressable testID="level2"
                    onPress={() => levelChange(2)}
                    style={[level >= 2 ? styles().visible_level : styles().hidden_level,
                    styles(deviceType).level2]}
                >
                    <View testID="poly-container"
                        style={styles().polyContainer}>
                        <View testID="left-bar"
                            style={styles(deviceType).leftBar}
                        >
                        </View>
                        <View testID="triangles-wrapper"
                            style={{
                                flexDirection: 'row',
                                justifyContent:'center',
                                width: '5%',
                            }}
                        >
                            <Svg testID="left-triangle"
                                viewBox="-11 1 28 19"
                                fill={level >= 2 ? "white" : 'none'}
                            >
                                <Path d="M 0 0 L 0 20 L 16 20 L 0 0"></Path>
                            </Svg>
                            <Svg testID="right-triangle"
                                viewBox="-11 2 28 18"
                                fill={level >= 2 ? "white" : 'none'}
                                style={{
                                    transform: [
                                        {
                                            rotateY: '180deg'
                                        }
                                    ],
                                }}
                            >
                                <Path d="M 0 0 L 0 20 L 18 20 L 0 0"></Path>
                            </Svg>
                        </View>
                        <View testID="right-bar"
                            style={styles(deviceType).rightBar}></View>
                    </View>
                    <View testID="text-wrapper"
                        style={{
                            flex: 1,
                            backgroundColor: 'white'
                        }}
                    >
                        <Text style={styles(deviceType).overlay_text}>
                            Whenever your Ring-bearer attacks, draw a card, then discard a card.
                        </Text>
                    </View>
                </Pressable>
                <Svg testID="bottom-triangle-2"
                    viewBox="0 0 28 18"
                    width={deviceType === 'tablet' ? 26 : 24}
                    height={deviceType === 'tablet' ? 20 : 14}
                    fill={level >= 2 ? "white" : 'none'}
                    style={styles().triangle}
                >
                    <Path d={"M2.39019 18.0983L10.6151 3.89171C11.0696 3.10655 11.2969 2.71396 11.5935 2.58211C11.8521 2.4671 12.1474 2.4671 12.4061 2.58211C12.7026 2.71396 12.9299 3.10654 13.3844 3.89171L21.6093 18.0983C22.0655 18.8863 22.2936 19.2803 22.2599 19.6037C22.2305 19.8857 22.0827 20.142 21.8534 20.3088C21.5904 20.5 21.1352 20.5 20.2246 20.5H3.77487C2.86435 20.5 2.40908 20.5 2.14613 20.3088C1.91677 20.142 1.769 19.8857 1.73959 19.6037C1.70588 19.2803 1.93398 18.8863 2.39019 18.0983Z"}
                    />
                </Svg>

                <Pressable testID="level3"
                    onPress={() => levelChange(3)}
                    style={[level >= 3 ? styles().visible_level : styles().hidden_level,
                    styles(deviceType).level3]}
                >
                    <View testID="poly-container"
                        style={styles().polyContainer}>
                        <View testID="left-bar"
                            style={styles(deviceType).leftBar}
                        >
                        </View>
                        <View testID="triangles-wrapper"
                            style={{
                                flexDirection: 'row',
                                justifyContent:'center',
                                width: '5%',
                            }}
                        >
                            <Svg testID="left-triangle"
                                viewBox="-11 1 28 19"
                                fill={level >= 2 ? "white" : 'none'}
                            >
                                <Path d="M 0 0 L 0 20 L 16 20 L 0 0"></Path>
                            </Svg>
                            <Svg testID="right-triangle"
                                viewBox="-11 2 28 18"
                                fill={level >= 2 ? "white" : 'none'}
                                style={{
                                    transform: [
                                        {
                                            rotateY: '180deg'
                                        }
                                    ],
                                }}
                            >
                                <Path d="M 0 0 L 0 20 L 18 20 L 0 0"></Path>
                            </Svg>
                        </View>
                        <View testID="right-bar"
                            style={styles(deviceType).rightBar}></View>
                    </View>
                    <View testID="text-wrapper"
                        style={{
                            flex: 1,
                            backgroundColor: 'white'
                        }}
                    >
                        <Text style={styles(deviceType).overlay_text}>
                            Whenever your Ring-bearer becomes blocked by a creature, that creature's controller sacrifices it at end of combat.
                        </Text>
                    </View>
                </Pressable>
                <Svg testID="bottom-triangle-3"
                    viewBox="0 0 28 18"
                    width={deviceType === 'tablet' ? 26 : 24}
                    height={deviceType === 'tablet' ? 20 : 14}
                    fill={level >= 3 ? "white" : 'none'}
                    style={styles().triangle}
                >
                    <Path d={"M2.39019 18.0983L10.6151 3.89171C11.0696 3.10655 11.2969 2.71396 11.5935 2.58211C11.8521 2.4671 12.1474 2.4671 12.4061 2.58211C12.7026 2.71396 12.9299 3.10654 13.3844 3.89171L21.6093 18.0983C22.0655 18.8863 22.2936 19.2803 22.2599 19.6037C22.2305 19.8857 22.0827 20.142 21.8534 20.3088C21.5904 20.5 21.1352 20.5 20.2246 20.5H3.77487C2.86435 20.5 2.40908 20.5 2.14613 20.3088C1.91677 20.142 1.769 19.8857 1.73959 19.6037C1.70588 19.2803 1.93398 18.8863 2.39019 18.0983Z"}
                    />
                </Svg>

                <Pressable testID="level4"
                    onPress={() => levelChange(4)}
                    style={[level === 4 ? styles().visible_level : styles().hidden_level,
                    styles(deviceType).level4]}
                >
                    <View testID="poly-container"
                        style={styles().polyContainer}>
                        <View testID="left-bar"
                            style={styles(deviceType).leftBar}
                        >
                        </View>
                        <View testID="triangles-wrapper"
                            style={{
                                flexDirection: 'row',
                                justifyContent:'center',
                                width: '5%',
                            }}
                        >
                            <Svg testID="left-triangle"
                                viewBox="-11 1 28 19"
                                fill={level >= 2 ? "white" : 'none'}
                            >
                                <Path d="M 0 0 L 0 20 L 16 20 L 0 0"></Path>
                            </Svg>
                            <Svg testID="right-triangle"
                                viewBox="-11 2 28 18"
                                fill={level >= 2 ? "white" : 'none'}
                                style={{
                                    transform: [
                                        {
                                            rotateY: '180deg'
                                        }
                                    ],
                                }}
                            >
                                <Path d="M 0 0 L 0 20 L 18 20 L 0 0"></Path>
                            </Svg>
                        </View>
                        <View testID="right-bar"
                            style={styles(deviceType).rightBar}></View>
                    </View>
                    <View testID="text-wrapper"
                        style={{
                            flex: 1,
                            backgroundColor: 'white'
                        }}
                    >
                        <Text style={styles(deviceType).overlay_text}>
                            Whenever your Ring-bearer deals combat damage to a player, each opponent loses 3 life.
                        </Text>
                    </View>
                    <View testID="bottom-poly"
                        style={styles(deviceType).bottomPolyContainer}>
                        <View testID="bottom-left-wrapper"
                            style={[styles(deviceType).bottomWrapper]}>
                            <View testID="bottom-left-poly"
                                style={[styles(deviceType).bottomPoly]}
                            ></View>
                            <Svg testID="left-bottom-triangle"
                                viewBox="0 2 28 24"
                                width={deviceType === 'tablet' ? 26 : 24}
                                height={deviceType === 'tablet' ? 20 : 12}
                                fill={level >= 3 ? "white" : 'none'}
                                style={{
                                    marginLeft: -13
                                }}
                            >
                                <Path d={"M2.39019 18.0983L10.6151 3.89171C11.0696 3.10655 11.2969 2.71396 11.5935 2.58211C11.8521 2.4671 12.1474 2.4671 12.4061 2.58211C12.7026 2.71396 12.9299 3.10654 13.3844 3.89171L21.6093 18.0983C22.0655 18.8863 22.2936 19.2803 22.2599 19.6037C22.2305 19.8857 22.0827 20.142 21.8534 20.3088C21.5904 20.5 21.1352 20.5 20.2246 20.5H3.77487C2.86435 20.5 2.40908 20.5 2.14613 20.3088C1.91677 20.142 1.769 19.8857 1.73959 19.6037C1.70588 19.2803 1.93398 18.8863 2.39019 18.0983Z"}
                                />
                            </Svg>
                        </View>
                        <View testID="bottom-right-wrapper"
                            style={deviceType === 'tablet' ? styles().bottomWrapper : styles().bottomRightWrapper}>
                            <Svg testID="right-bottom-triangle"
                                viewBox="0 2 28 24"
                                width={deviceType === 'tablet' ? 26 : 24}
                                height={deviceType === 'tablet' ? 20 : 12}
                                fill={level >= 3 ? "white" : 'none'}
                                style={{
                                    transform: [
                                        {
                                            translateX: 13
                                        }
                                    ],
                                }}
                            >
                                <Path d={"M2.39019 18.0983L10.6151 3.89171C11.0696 3.10655 11.2969 2.71396 11.5935 2.58211C11.8521 2.4671 12.1474 2.4671 12.4061 2.58211C12.7026 2.71396 12.9299 3.10654 13.3844 3.89171L21.6093 18.0983C22.0655 18.8863 22.2936 19.2803 22.2599 19.6037C22.2305 19.8857 22.0827 20.142 21.8534 20.3088C21.5904 20.5 21.1352 20.5 20.2246 20.5H3.77487C2.86435 20.5 2.40908 20.5 2.14613 20.3088C1.91677 20.142 1.769 19.8857 1.73959 19.6037C1.70588 19.2803 1.93398 18.8863 2.39019 18.0983Z"}
                                />
                            </Svg>
                            <View testID="bottom-right-poly"
                                style={styles(deviceType).bottomPoly}></View>
                        </View>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

const styles = (deviceType?: string) => StyleSheet.create({
    ring_container: {
        height: '75%',
        maxWidth: 690,//the width contained card image on tablet
        width: '100%',
        justifyContent: 'center',
    },
    tablet_ring_container: {
        aspectRatio: .75
    },
    tablet_ring_overlay_wrapper: {
        position: 'absolute',
        left: '9%',
        width: '82%',
        height: '43%',
        bottom: '9%',
        alignItems: 'center',
    },
    ring_overlay_wrapper: {
        position: 'absolute',
        left: '8%',
        width: '84%',
        height: '43%',
        bottom: '9%',
        alignItems: 'center',
    },
    visible_level: {
        color: 'black',
        justifyContent: 'center',
        width: '100%'
    },
    hidden_level: {
        opacity: 0
    },
    level1: {
        height: deviceType === 'tablet' ? '18%' : '16%',
    },
    level2: {
        marginTop: '-2%',
        height: deviceType === 'tablet' ? '22%' : '19%',
    },
    level3: {
        marginTop: '-2%',
        height: deviceType === 'tablet' ? '28%' : '25%',
    },
    level4: {
        marginTop: '-2%',
        height: deviceType === 'tablet' ? '29%' : '25%',
    },
    overlay_text: {
        fontFamily: 'Mplantin',
        fontSize: deviceType === 'tablet' ? textScaler(9) : textScaler(13),
        paddingHorizontal: 10,
        backgroundColor: 'white',
        width: '100%'
    },
    triangle: {
        marginTop: -3.5,
        transform: [
            {
                rotate: '180deg'
            }
        ]
    },
    polyContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    leftBar:{
        width: '48%',
        backgroundColor: 'white',
        height: deviceType === 'tablet' ? 15 : 9,
    },
    rightBar:{
        width: '47%',
        backgroundColor: 'white',
        height: deviceType === 'tablet' ? 15 : 9,
    },
    bottomPolyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomWrapper: {
        flexDirection: 'row',
        width: deviceType === 'tablet' ? '44%' : '45%',
    },
    bottomRightWrapper: {
        flexDirection: 'row',
        width: '48%'
    },
    bottomPoly: {
        flex: 1,
        backgroundColor: 'white',
        height: deviceType === 'tablet' ? 16 : 9,
    },

    // corner: {
    //     width: 0,
    //     height: 0,
    //     backgroundColor: "transparent",
    //     borderStyle: "solid",
    //     borderBottomWidth: deviceType === 'tablet' ? 16 : 9,
    //     borderBottomColor: "white",
    // },
    // leftCorner: {
    //     borderRightWidth: deviceType === 'tablet' ? 11 : 5,
    //     borderRightColor: "transparent",
    // },
    // rightCorner: {
    //     borderLeftWidth: deviceType === 'tablet' ? 11 : 5,
    //     borderLeftColor: "transparent",
    // },
})

export default TheRing