import { StyleSheet, Text, View, ImageBackground, GestureResponderEvent, ImageSourcePropType, Dimensions, Pressable } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useReducer, useState } from 'react';
import Svg, { Path } from 'react-native-svg'
import Animated, { Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GameContext, GameContextProps } from '../GameContext';
import { CompleteDungeonModal } from '../components/DungeonModals';
import { RootStackParamList } from '../navigation';
import { textScaler } from '../functions/textScaler';
import useScreenRotation from '../hooks/useScreenRotation';

type dungeonInfo = {
    name: string | undefined,
    uri: ImageSourcePropType | undefined,
    lastroom_height?: number
}

interface MarkerProps {
    x: number,
    y: number,
    radius: number,
    moveDelay: number,
    touchResponse: (event: GestureResponderEvent) => void
}

const Marker: React.FC<MarkerProps> = ({ x, y, radius, moveDelay, touchResponse }) => {
    const translateX = useDerivedValue<number>(() => { return x })
    const translateY = useDerivedValue<number>(() => { return y })
    const endScale = useSharedValue(0)

    useEffect(() => {
        endScale.value = withRepeat(withTiming(1, {
            duration: 500,
        }), -1, true)
    }, [])

    const containerMoveStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(translateX.value - radius,
                        {
                            duration: moveDelay,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        })
                },
                {
                    translateY: withTiming(translateY.value - radius,
                        {
                            duration: moveDelay,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        })
                }
            ]
        }
    })

    const pulseStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: withTiming(endScale.value, {
                    duration: 500,
                    easing: Easing.linear
                }),
            }]
        }
    })

    return (
        <Animated.View key="pulse_container" onTouchEnd={(e) => touchResponse(e)} style={[styles.pulse_container, containerMoveStyle,
        {
            height: radius * 2,
            width: radius * 2,
        },
        ]}>
            <Animated.View key="pulse_outter" style={[styles.pulse_outter, pulseStyle]}>
                <View key="pulse_inner" style={styles.pulse_inner}></View>
            </Animated.View>
        </Animated.View>
    )
}

type DungeonAction = {
    dungeon: string,
    imageHeight: number
}
//action.imageHeight might need to change to aspect ratio (ratio < 1.5 for phone)
const dungeonReducer = (state: dungeonInfo, action: DungeonAction) => {
    switch (action.dungeon) {
        case "Undercity":
            return {
                name: "Undercity",
                uri: require("../assets/dungeons/Undercity.jpg"),
                lastroom_height: action.imageHeight < 900 ? action.imageHeight * .30 : action.imageHeight * .25
            };
        case "Dungeon of the Mad Mage":
            return {
                name: "Dungeon of the Mad Mage",
                uri: require("../assets/dungeons/Dungeon-of-the-Mad-Mage.jpg"),
                lastroom_height: action.imageHeight < 900 ? action.imageHeight * .29 : action.imageHeight * .25
            };
        case "Tomb of Annihilation":
            return {
                name: "Tomb of Annihilation",
                uri: require("../assets/dungeons/Tomb-of-Annihilation.jpg"),
                lastroom_height: action.imageHeight < 900 ? action.imageHeight * .35 : action.imageHeight * .3
            };
        case "Lost Mines of Phandelver":
            return {
                name: "Lost Mines of Phandelver",
                uri: require("../assets/dungeons/Lost-Mine-of-Phandelver.jpg"),
                lastroom_height: action.imageHeight < 900 ? action.imageHeight * .32 : action.imageHeight * .26
            };
        case "Completed":
            return {
                name: undefined,
                uri: undefined,
                lastroom_height: undefined
            }
        default:
            return state
    }
}

const dungeonList = ["Undercity", "Dungeon of the Mad Mage", "Tomb of Annihilation", "Lost Mines of Phandelver"]

/* 
Dungeon screen rotates to face player, this causes the marker to have inverted/opposite values when rotated 180
*/
const Dungeon: React.FC = ({ }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Dungeon'>>()
    const { dispatchGlobalPlayerData, globalPlayerData } = useContext(GameContext) as GameContextProps
    const [currentDungeon, dispatchDungeon] = useReducer<(state: dungeonInfo, action: DungeonAction) => dungeonInfo>(dungeonReducer,
        {
            name: undefined,
            uri: undefined,
            lastroom_height: undefined
        }
    )
    const [marker_coords, setMarker_coords] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [promptComplete, setPromptComplete] = useState<boolean>(false)
    const [flipped, setFlipped] = useState<boolean>(false)
    const [rotate] = useScreenRotation(Object.keys(globalPlayerData).length, route.params.playerID)
    const marker_radius = 75
    const { width, height } = Dimensions.get('screen')

    /* set saved coordinates, else center marker to top */
    useEffect(() => {
        if (route.params.currentDungeon) {
            setMarker_coords({
                x: route.params.dungeonCoords!.x,
                y: route.params.dungeonCoords!.y,
            })
            dispatchDungeon({dungeon: route.params.currentDungeon, imageHeight: height})
        }
        else {
            setMarker_coords({
                x: width / 2,
                y: marker_radius
            })
        }
    }, [])

    const markerDrag = (event: GestureResponderEvent) => {
        if (flipped) {
            setMarker_coords({
                x: width - event.nativeEvent.pageX,
                y: height - event.nativeEvent.pageY - 70,
            })
        }
        else {
            setMarker_coords({
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY
            })
        }
    }


    const markerRelease = (event: GestureResponderEvent) =>{
        const Ythreshold = height - (currentDungeon.lastroom_height as number)
        if(event.nativeEvent.pageY >= Ythreshold){
            setPromptComplete(true)
        }
    }
    /*
    on dungeon complete, have to reset dungeon data, and set dungeonComplete to true  
    in globalPlayerData for active player.
    reset marker coords to x = width/2, y = top of page (0) + marker radius
    */
    const completeDungeon = () => {
        dispatchDungeon({dungeon: "Completed", imageHeight:0})
        dispatchGlobalPlayerData({
            field: 'complete dungeon',
            playerID: route.params.playerID,
            value: true
        })
        setPromptComplete(false)
        setMarker_coords({
            x: width / 2,
            y: marker_radius
        })
    }

    const cancelCompleteModal = () => {
        setPromptComplete(false)
    }

    /*
    save dungeon name and coordinates to globalPlayerData on screen close/navigating away
    */
    const closeDungeon = () => {
        dispatchGlobalPlayerData({
            playerID: route.params.playerID,
            field: 'dungeon',
            value: {
                currentDungeon: currentDungeon.name,
                dungeonCoords: {
                    x: marker_coords.x,
                    y: marker_coords.y
                }
            }
        })
        navigation.navigate('Game')
    }

    const cancelDungeon = () => {
        dispatchDungeon({dungeon: "Completed", imageHeight:0})
        setPromptComplete(false)
    }
    
    return (
        <View style={[styles.dungeon_container,
        rotate && {
            transform: [rotate]
        }
        ]}>
            {
                currentDungeon.name === undefined ?
                    <>
                        <Pressable style={styles.close_icon}
                            onPressIn={() => closeDungeon()}
                        >
                            <Svg height="60" width="60" viewBox='0 0 512 512'
                                style={styles.close_icon}
                            >
                                <Path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
                                    fill="black"
                                />
                            </Svg>
                        </Pressable>
                        <View style={{
                            height: '100%',
                            width: '100%'
                        }}>
                            {dungeonList.map((d: string) => {
                                return (
                                    <Pressable key={d} style={styles.dungeon_button}
                                        onPressIn={() => dispatchDungeon({ dungeon : d, imageHeight : height })}>
                                        <Text style={styles.dungeon_name_text}>
                                            {d}
                                        </Text>
                                    </Pressable>
                                )
                            })
                            }
                        </View>
                    </>
                    :
                    <>
                        {/*Back to game/Close*/}
                        <Pressable style={styles.close_icon}
                            onPressIn={() => closeDungeon()}>
                            <Svg height="60" width="60" viewBox='0 0 512 512'
                                style={styles.close_icon}>
                                <Path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
                                    fill="white"
                                />
                            </Svg>
                        </Pressable>
                        {
                            promptComplete && <CompleteDungeonModal OnAccept={completeDungeon} OnCancel={cancelCompleteModal} />
                        }

                        {/* Cancel Dungeon */}
                        <Pressable style={styles.cancel_icon}
                            onPressIn={() => cancelDungeon()}
                        >
                            <Svg viewBox='0 0 512 512' style={{ height: '100%', width: '100%' }}>
                                <Path d="M193.571 26.027l35.192 83.99c14.877 7.658 33.121 6.696 47.488-1.279l40.283-85.976c-45.582-7.268-84.512-4.945-122.963 3.265zm137.3 7.606l-32.038 71.38c12.536 12.349 37.237 18.872 47.033 15.448l31.172-64.691c-12.422-8.392-27.428-15.886-46.168-22.137zm-154.86-1.97c-21.814 6.55-40.982 16.35-56.099 28.591 14.941 15.844 28.861 34.184 38.194 52.832 24.477 6.133 35.479-6.849 47.475-18.55zm-74.245 34.831c-36.541 32.91-66.523 76.42-78.068 125.215l65.957 3.353c12.006-30.53 24.552-56.284 54.231-72.755-9.883-20.24-23.626-39.403-42.12-55.813zm292.503-.29l-31.852 61.044c32.54 21.007 43.572 41.348 52.597 69l72.464-8.43c-9.612-55.894-42.206-107.047-93.209-121.614zm-52.233 137.2c4.757 12.937-15.842 29.7-9.07 39.428-4.011.85-8.874 1.642-14.385-8.957-1.126 12.49 2.172 19.603 12.168 29.209-2.682.783-8.045 2.75-12.08.566-1.24 7.386 10.867 13.863 20.725 14.832l8.392-2.175c-6.09-1.106-7.881-3.315-10.627-6.13 2.97-1.32 12.554-7.117 2.149-14.751 12.634-2.752 6.035-14.89 4.14-21.862 7.525 7.798 15.243 22.54 21.862 7.084 4.176 12.604 6.561 12.12 13.614 9.107 1.054 9.196-2.957 14.791-8.792 22.518l12.494-4.992c6.018-5.026 20.16-25.502 6.428-35.5 2.603 12.443-5.563 14.388-18.672-10.937-4.377 30.773-12.236-7.49-28.346-17.44zm-321.668 2.108v66.242l72.842-11.858 1.592-49.873zm143.486.363c3.732 8.72-14.487 45.226-18.865 14.453-13.109 25.325-23.908 24.26-21.304 11.817-13.732 9.998-1.347 33.458 4.671 38.484l11.229 3.001c-5.835-7.727-11.565-13.614-10.512-22.81 7.053 3.013 10.492 5.604 14.668-7 6.618 15.456 17.32-4.378 24.846-12.175-1.554 11.494-6.282 22.427 7.303 25.197-9.13 10.082 1.899 19.99-12.694 22.812l8.393 2.176c9.857-.97 20.385-10.606 19.144-17.992-4.035 2.183-7.818 3.376-10.5 2.594 9.996-9.607 10.662-21.46 9.536-33.95-5.511 10.6-7.917 11.738-11.752 13.698 6.77-9.728-5.927-32.285-14.163-40.305zm327.512 1.172l-77.57 5.687 1.156 79.192 75.524 2.842zM98.313 279.81l-79.955 9.779 1.202 99.754 83.54 1.152zm280.659 7.347l-28.332 7.031 21.455 68.315 16.125-5.043zm-246.961 3.348l-9.248 70.303 16.125 5.043 21.455-68.315zM412.269 310.3v83.58l79.166-8.031 2.289-75.55zm84.605 91.656l-88.934 9.947-1.16 80.727 90.674.586zm-395.822 2.002l-81.848 2.322-4.658 86.184h90z"
                                    fill="white"
                                />
                            </Svg>
                        </Pressable>

                        {/* Dungeon Image/pointer */}
                        <View style={styles.dungeon_wrapper}
                            onTouchMove={(e) => markerDrag(e)}
                        >
                            <Marker touchResponse={markerRelease} x={marker_coords.x} y={marker_coords.y} radius={marker_radius} moveDelay={200} />
                            <Marker touchResponse={markerRelease} x={marker_coords.x} y={marker_coords.y} radius={marker_radius * .33} moveDelay={500} />
                            <Marker touchResponse={markerRelease} x={marker_coords.x} y={marker_coords.y} radius={marker_radius * .66} moveDelay={350} />
                            <View style={styles.image_container}>
                                    <ImageBackground
                                        testID='dungeon_image'
                                        source={currentDungeon.uri as ImageSourcePropType}
                                        resizeMode="contain"
                                        resizeMethod='scale'
                                        style={styles.dungeon_image}
                                    >
                                        <Pressable key="lastroom"
                                            onPressOut={() => setPromptComplete(true)}
                                            style={[styles.lastroom, {
                                                //height needs to change depending on aspect ratio for phone() vs tablet
                                                height: currentDungeon.lastroom_height as number
                                            }]}>
                                        </Pressable>
                                    </ImageBackground>
                            </View>
                        </View>
                    </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    dungeon_name_text: {
        fontFamily: 'Beleren',
        fontSize: textScaler(24)
    },
    dungeon_container: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 20,
    },
    dungeon_wrapper: {
        backgroundColor: "black",
        width: '100%',
        height: '100%'
    },
    close_icon: {
        position: "absolute",
        right: 0,
        zIndex: 1
    },
    cancel_icon: {
        position: "absolute",
        left: 0,
        zIndex: 1,
        width: 60,
        height: 60
    },
    image_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        zIndex: -1,
    },
    lastroom: {
        width: '100%',
    },
    dungeon_image: {
        width:'100%',
        flex: 1,
        justifyContent: "flex-end",
    },
    dungeon_button: {
        flex: 1,
        height: '10%',
        width: 'auto',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },
    pulse_container: {
        position: 'absolute',
        top: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    pulse_inner: {
        borderRadius: 50,
        backgroundColor: "rgba(62, 182, 247,0.5)",
        height: "100%",
        width: "100%",
        borderColor: "rgba(262, 182, 247,0.5)",
        shadowColor: 'rgba(62, 182, 247,0.5)',
        shadowRadius: 20,
    },
    pulse_outter: {
        width: "70%",
        height: "70%",
        borderRadius: 50,
        borderColor: "rgba(62, 182, 247,0.5)",
        shadowColor: 'rgba(62, 182, 247,0.5)',
        borderWidth: 2,
        shadowRadius: 20,
        shadowOpacity: 1,
    }
})

export default Dungeon