import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { Easing, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GameContext, GameContextProps } from '../../GameContext';
import Svg, { Defs, LinearGradient, Path, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import { CounterCardProps, DungeonData } from '../..';
import { OptionsContext } from '../../OptionsContext';

interface StaticCounterProps {
    colorTheme: {
        primary: string,
        secondary: string
    },
    playerName: string,
    playerID: number,
    dungeonCompleted: boolean,
}

const staticCounterList = ['dungeon', 'blessing', 'initiative', 'monarch']

const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const StaticCounterContainer: React.FC<StaticCounterProps> = ({ dungeonCompleted, playerName, playerID, colorTheme }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { currentMonarch, setCurrentMonarch, currentInitiative, setCurrentInitiative, globalPlayerData, dispatchGlobalPlayerData } = useContext(GameContext) as GameContextProps
    const { gameType } = useContext(OptionsContext)

    const scales: { [key: string]: SharedValue<number> } = {
        blessing: useSharedValue(.5),
        monarch: useSharedValue(.5),
        initiative: useSharedValue(.5)
    }

    const initiativeScaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(
                        scales.initiative.value
                        , {
                            duration: 50,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        }),
                }
            ],
        }
    })

    const monarchScaleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(
                        scales.monarch.value
                        , {
                            duration: 50,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                        })
                }
            ]
        }
    })

    const activeInitiative = () => {
        currentInitiative !== playerName ? setCurrentInitiative(playerName) : setCurrentInitiative('')
    }

    const activateMonarch = () => {
        currentMonarch !== playerName ? setCurrentMonarch(playerName) : setCurrentMonarch('')
    }

    useEffect(() => {
        scales.initiative.value = currentInitiative === playerName ? 1 : .5;
        scales.monarch.value = currentMonarch === playerName ? 1 : .5;
    }, [currentInitiative, currentMonarch])

    const showDungeon = () => {
        navigation.navigate('Dungeon', {
            playerID: playerID,
            currentDungeon: globalPlayerData[playerID as number].dungeonData?.currentDungeon,
            dungeonCoords: globalPlayerData[playerID as number].dungeonData?.dungeonCoords,
        } as DungeonData)
    }

    /*
    if card is small, make card big (and centered)
    if card is big, make card small
    */
    const cardLongPress = (counterType: string) => {
        navigation.navigate("Card", {
            playerID: playerID as number,
            card: counterType
        } as CounterCardProps)
    }


    return (
        <View testID='static_counter_container' style={styles().static_counter_container}>

            {/* Dungeon */}
            <Pressable style={dungeonCompleted ? styles(gameType).dungeon_complete_touch : styles().dungeon_icon_touch}
                onPress={() => showDungeon()}
                testID="dungeon"
                accessibilityLabel={dungeonCompleted ? `${playerName} Dungeon Completed` : `${playerName} Venture into the Dungeon`}
            >
                {
                    dungeonCompleted &&
                    <Svg viewBox='2 -10 15 30' width={22} height={30} >
                        <Path d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27   c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0   L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                            fill={colorTheme.primary === 'rgba(0,0,0,1)' ? 'white' : 'rgba(0,0,0,1)'} />
                    </Svg>
                }
                {/* Dungeon symbol */}
                <Svg viewBox='0 0 524 524' width={30} height={30} style={{
                    marginLeft: dungeonCompleted ? 0 : 10,
                }}>
                    <Path d="M128.73 195.32l-82.81-51.76c-8.04-5.02-18.99-2.17-22.93 6.45A254.19 254.19 0 0 0 .54 239.28C-.05 248.37 7.59 256 16.69 256h97.13c7.96 0 14.08-6.25 15.01-14.16 1.09-9.33 3.24-18.33 6.24-26.94 2.56-7.34.25-15.46-6.34-19.58zM319.03 8C298.86 2.82 277.77 0 256 0s-42.86 2.82-63.03 8c-9.17 2.35-13.91 12.6-10.39 21.39l37.47 104.03A16.003 16.003 0 0 0 235.1 144h41.8c6.75 0 12.77-4.23 15.05-10.58l37.47-104.03c3.52-8.79-1.22-19.03-10.39-21.39zM112 288H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm0 128H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm77.31-283.67l-36.32-90.8c-3.53-8.83-14.13-12.99-22.42-8.31a257.308 257.308 0 0 0-71.61 59.89c-6.06 7.32-3.85 18.48 4.22 23.52l82.93 51.83c6.51 4.07 14.66 2.62 20.11-2.79 5.18-5.15 10.79-9.85 16.79-14.05 6.28-4.41 9.15-12.17 6.3-19.29zM398.18 256h97.13c9.1 0 16.74-7.63 16.15-16.72a254.135 254.135 0 0 0-22.45-89.27c-3.94-8.62-14.89-11.47-22.93-6.45l-82.81 51.76c-6.59 4.12-8.9 12.24-6.34 19.58 3.01 8.61 5.15 17.62 6.24 26.94.93 7.91 7.05 14.16 15.01 14.16zm54.85-162.89a257.308 257.308 0 0 0-71.61-59.89c-8.28-4.68-18.88-.52-22.42 8.31l-36.32 90.8c-2.85 7.12.02 14.88 6.3 19.28 6 4.2 11.61 8.9 16.79 14.05 5.44 5.41 13.6 6.86 20.11 2.79l82.93-51.83c8.07-5.03 10.29-16.19 4.22-23.51zM496 288h-96c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm0 128h-96c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h96c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zM240 177.62V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V177.62c-5.23-.89-10.52-1.62-16-1.62s-10.77.73-16 1.62zm-64 41.51V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V189.36c-12.78 7.45-23.84 17.47-32 29.77zm128-29.77V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8V219.13c-8.16-12.3-19.22-22.32-32-29.77z"
                        fill={
                            dungeonCompleted ?
                                (colorTheme.primary === 'rgba(0,0,0,1)' ? 'white' : 'rgba(0,0,0,1)')
                                :
                                colorTheme.secondary
                        }
                    />
                </Svg>
            </Pressable>

            {/*The Ring*/}
            <View style={styles().card_container}>
                <Pressable testID='the_ring'
                    accessibilityLabel={`The Ring ${playerName}`}
                    onPress={() => cardLongPress('the ring')}
                    style={styles().card_overlay}
                >
                    <Svg viewBox="256.092 59.688 201.573 202.369"
                        height={40}
                        width={40}
                    >
                        <Defs>
                            <LinearGradient gradientUnits='userSpaceOnUse'
                                x1="16.029" y1="3.987" x2="16.029" y2="28.102"
                                id="gradient-0"
                                gradientTransform="matrix(8.378566, 0, 0, 8.391918, 222.577942, 26.227707)"
                            >
                                <Stop offset={0} stopColor={"rgba(225, 189, 6, 1)"} />
                                <Stop offset={1} stopColor={"rgba(126, 105, 3, 1)"} />
                            </LinearGradient>
                            <LinearGradient gradientUnits="userSpaceOnUse"
                                x1="16.029" y1="3.987" x2="16.029" y2="28.102"
                                id="gradient-2"
                                gradientTransform="matrix(8.378566, 0, 0, 8.391918, 222.577942, 26.227707)"
                            >
                                <Stop offset={0} stopColor={"rgb(250, 239, 126)"} />
                                <Stop offset={1} stopColor={"rgb(207, 130, 5)"} />
                            </LinearGradient>
                            <LinearGradient gradientUnits="userSpaceOnUse"
                                x1="16.861" y1="8.044" x2="16.861" y2="26.096"
                                id="gradient-1"
                                gradientTransform="matrix(8.378566, 0, 0, 8.391918, 222.577942, 26.227707)"
                            >
                                <Stop offset={0} stopColor={"rgba(225, 189, 6, 1)"} />
                                <Stop offset={1} stopColor={"rgba(126, 105, 3, 1)"} />
                            </LinearGradient>
                            <LinearGradient gradientUnits="userSpaceOnUse"
                                x1="14.117" y1="5.801" x2="14.117" y2="22.048"
                                id="gradient-3"
                                gradientTransform="matrix(6.312479, 5.518132, -8.075296, 9.267203, 366.161145, -64.122868)"
                            >
                                <Stop offset={0} stopColor={"rgb(207, 130, 5)"} />
                                <Stop offset={1} stopColor={"rgb(250, 239, 126)"} />
                            </LinearGradient>
                        </Defs>
                        <Path d="M 440.421 84.971 L 437.899 82.445 C 423.664 66.517 402.717 61.465 402.717 61.465 C 377.581 53.929 338.211 70.713 303.029 105.095 C 273.704 132.797 256.092 166.364 256.092 191.54 C 256.092 194.922 256.947 198.262 256.947 201.602 C 258.614 218.386 269.515 236.026 278.706 244.418 C 290.461 256.149 305.509 262.057 322.266 262.057 C 349.924 262.057 382.625 246.088 412.763 217.572 C 459.7 171.416 471.413 116.869 440.421 84.971 Z M 306.364 208.324 C 306.364 197.406 318.077 174.756 343.213 149.581 C 367.536 125.261 392.671 118.539 404.384 116.013 C 398.528 131.983 385.96 151.251 367.536 169.746 C 349.924 186.53 329.832 199.932 312.22 206.654 C 310.553 207.51 308.031 207.51 306.364 208.324 Z M 314.742 116.869 C 342.4 89.167 371.725 75.723 390.149 75.723 C 396.006 75.723 401.05 77.435 404.384 80.775 C 407.761 84.115 409.428 90.837 408.574 98.415 C 398.528 99.229 364.159 105.095 331.499 137.849 C 310.553 158.828 288.752 189.014 290.461 209.994 C 285.417 209.994 280.373 208.324 277.893 205.798 C 276.184 204.128 274.517 201.602 273.704 198.262 C 273.704 198.262 272.849 194.066 272.849 191.54 C 273.704 170.56 289.606 141.189 314.742 116.869 Z M 401.05 204.984 C 360.824 245.274 314.742 256.149 290.461 232.686 C 288.752 230.974 287.085 229.304 285.417 226.778 C 287.085 227.634 289.606 227.634 292.128 227.634 C 299.652 227.634 308.886 225.964 318.077 222.582 C 338.211 215.046 359.97 200.788 379.249 181.478 C 408.574 152.106 425.331 118.539 425.331 94.219 L 428.707 96.703 C 452.134 121.065 440.421 166.364 401.05 204.984 Z"
                            stroke={"url(#gradient-0)"}
                            fill={"rgb(6, 6, 6)"}
                            // fill={globalPlayerData[playerID].colors.secondary}
                            strokeWidth={0}
                        />
                        <Path d="M 428.666 95.637 C 430.19 94.001 469.327 137.471 401.804 204.363 C 392.16 216.556 327.168 270.928 290.545 233.172 L 285.116 227.197 L 292.983 227.189 C 292.045 228.313 316.518 224.504 319.04 221.474 C 318.856 224.285 377.255 188.553 378.738 180.975 C 393.057 172.516 429.286 111.255 425.147 92.918 L 428.666 95.637 Z"
                            strokeWidth={0}
                            stroke={"url(#gradient-1)"}
                            fill={"url(#gradient-2)"}
                        />
                        <Path d="M 291.416 210.758 C 291.416 212.931 277.751 207.317 277.751 206.025 C 277.566 206.209 273.059 198.875 273.545 198.388 C 272.489 199.093 270.554 191.683 271.609 190.978 C 275.07 158.753 306.498 122.945 313.971 115.895 C 316.116 110.759 370.594 69.337 390.015 75.237 C 394.808 75.069 408.44 79.718 405.298 80.238 C 412.411 79.76 411.967 98.23 408.942 99.221 C 390.803 96.233 341.352 127.3 331.809 137.891 C 294.558 179.254 287.931 204.061 291.416 210.758 Z"
                            stroke={"rgb(0, 0, 0)"}
                            strokeWidth={0}
                            fill={"url(#gradient-3)"}
                        />
                    </Svg>
                </Pressable>
            </View>

            {/* Initiative */}
            <View testID={"initiative"}
                style={styles().card_container}>
                <Pressable
                    accessibilityLabel={currentInitiative === playerName ? `${playerName} has the Initiative` : `activate the initiative for ${playerName}`}
                    style={styles().card_overlay}
                    onPress={() => activeInitiative()}
                    onLongPress={() => cardLongPress("initiative")}
                    testID={"initiative_pressable"}
                />
                <AnimatedSvg viewBox="0 0 375 500"
                    style={initiativeScaleStyle}
                >
                    <Path
                        // fill={globalPlayerData[playerID].colors.secondary === "rgba(0,0,0,1)" ? 'white' : 'black'} 
                        fill={
                            globalPlayerData[playerID].colors.primary === "rgba(0,0,0,1)" ? 'white' :
                                currentInitiative === playerName ? 'black' : globalPlayerData[playerID].colors.secondary
                        }
                        d="M187.217,56.432c43.305,0,59.067-49.353,59.067-49.353l118.389,93.202c0,0-7.54,178.814-7.775,185.494   c-0.561,15.715-7.097,30.464-11.282,40.731c-15.108,36.943-72.238,116.75-148.229,165.572h-20.337   c-75.991-48.822-133.12-128.629-148.22-165.572c-4.196-10.269-10.737-25.019-11.287-40.731   c-0.237-6.68-7.777-185.494-7.777-185.494L128.15,7.079C128.15,7.079,143.908,56.432,187.217,56.432z" />
                    <LinearGradient id='SVGID_1_'
                        gradientUnits="userSpaceOnUse"
                        gradientTransform={"matrix(1 0 0 -1 0 501)"}
                        x1={26.2568} y1={247.0918} x2={348.1709} y2={247.0918} >
                        <Stop offset={0} stopColor={"#626E77"} />
                        <Stop offset={0.0069} stopColor={"#647079"} />

                        <Stop offset={0.1352} stopColor={"#8496A1"} />
                        <Stop offset={0.2374} stopColor={"#99ADB9"} />
                        <Stop offset={0.3} stopColor={"#A0B6C2"} />
                        <Stop offset={0.3027} stopColor={"#A1B7C3"} />
                        <Stop offset={0.3597} stopColor={"#ADC6D4"} />
                        <Stop offset={0.4222} stopColor={"#B5CEDE"} />
                        <Stop offset={0.5} stopColor={"#B7D1E1"} />
                        <Stop offset={0.5778} stopColor={"#B5CEDE"} />
                        <Stop offset={0.6403} stopColor={"#ADC6D4"} />
                        <Stop offset={0.6973} stopColor={"#A1B7C3"} />
                        <Stop offset={0.7} stopColor={"#A0B6C2"} />
                        <Stop offset={0.7626} stopColor={"#99ADB9"} />
                        <Stop offset={0.8648} stopColor={"#8496A1"} />
                        <Stop offset={0.9931} stopColor={"#647079"} />
                        <Stop offset={1} stopColor={"#626E77"} />
                    </LinearGradient>
                    <Path
                        fill={currentInitiative === playerName ? "url(#SVGID_1_)" : globalPlayerData[playerID].colors.primary}
                        d="M181.832,476.496C94.47,417.264,43.611,329.907,40.619,312.555   c-1.995-11.566-1.199-21.74,2.396-30.521c8.374,26.324,24.728,56.249,49.063,89.754c26.041,34.727,51.887,59.109,77.539,73.138   h35.199c25.647-14.028,51.498-38.411,77.539-73.138c24.336-33.505,40.694-63.43,49.067-89.754l0,0   c3.581,8.781,4.387,18.955,2.388,30.521c-2.992,17.354-53.853,104.709-141.209,163.941H181.832L181.832,476.496z M187.217,78.588   l-14.958,44.285l-52.658,31.108l-46.672-11.964l32.311,37.104v62.226l-32.311,37.105l47.269-12.58l51.46,31.715l15.559,49.067   l15.559-49.067l51.466-31.715l47.269,12.58l-32.32-37.105v-62.226l32.32-37.104l-46.682,11.964l-52.653-31.108L187.217,78.588   L187.217,78.588z M26.257,127.06c37.517,50.944,39.847,96.612,6.991,136.995l-1.009,1.221L26.257,127.06z M348.171,127.06   l-5.986,138.215l-1.005-1.221C308.33,223.671,310.66,178.004,348.171,127.06L348.171,127.06z M174.05,430.422   c-56.642-39.084-97.133-93.939-121.463-164.55c31.596-43.83,24.089-96.659-22.512-158.478l-1.425-1.875l93.945-74.199   c13.428,27.65,34.675,41.215,63.737,40.704l0.886-0.009l0.886,0.009c29.063,0.512,50.31-13.053,63.732-40.704l93.95,74.199   l-1.421,1.875c-46.605,61.818-54.108,114.647-22.518,158.478c-24.336,70.608-64.82,125.466-121.464,164.55H174.05L174.05,430.422z"
                    />
                    <Polygon
                        fill={"#FFFFFF"}
                        points="123.789,246.728 123.789,173.135 187.217,134.837 250.641,173.135 250.641,246.728    187.217,285.623  " />
                </AnimatedSvg>
            </View>

            {/* Monarch */}
            <View testID={"monarch"}
                style={styles().card_container}>
                <Pressable
                    accessibilityLabel={currentMonarch === playerName ? `${playerName} is the Monarch` : `activate the Monarch for ${playerName}`}
                    style={styles().card_overlay}
                    onPress={() => activateMonarch()}
                    onLongPress={() => cardLongPress("monarch")}
                    testID={"monarch_pressable"}
                />
                <AnimatedSvg viewBox='0 0 512 512' fill={globalPlayerData[playerID].colors.secondary}
                style={monarchScaleStyle}
                >
                    <Defs>
                        <RadialGradient gradientUnits="userSpaceOnUse" cx="254.484" cy="367.256" r="226.878" id="gradient-0">
                            <Stop offset={0} stopColor="rgb(88, 0, 0)" />
                            <Stop offset={1} stopColor="rgb(215, 3, 3)" />
                        </RadialGradient>
                    </Defs>
                    <Path d='M124.536,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322   c-12.876,0-23.314,10.438-23.314,23.322S111.66,178.991,124.536,178.991z' />
                    <Path d='M46.66,211.508c0-12.883-10.454-23.321-23.33-23.321C10.454,188.187,0,198.625,0,211.508   c0,12.884,10.454,23.322,23.33,23.322C36.206,234.83,46.66,224.392,46.66,211.508z' />
                    <Path d='M387.464,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322   c-12.876,0-23.314,10.438-23.314,23.322S374.588,178.991,387.464,178.991z' />
                    <Path d="M488.686,188.187c-12.892,0-23.33,10.438-23.33,23.321c0,12.884,10.438,23.322,23.33,23.322   c12.876,0,23.314-10.438,23.314-23.322C512,198.625,501.562,188.187,488.686,188.187z" />
                    <Rect x="80.101" y="399.236" width="351.815" height="36.296" 
                    fill={currentMonarch === playerName ? "url(#gradient-0)" : globalPlayerData[playerID].colors.secondary}
                    />
                    <Path d='M400.193,272.999c-33.932-23.322-14.839-82.694-14.839-82.694l-19.388-5.661   c-40.721,77.385-100.608,73.761-95.937-12.728v-27.715h33.686v-28.05h-33.686V76.468h-28.058v39.682h-33.702v28.05h33.702v27.715   c4.679,86.49-55.2,90.113-95.938,12.728l-19.371,5.661c0,0,19.076,59.372-14.839,82.694   c-33.932,23.321-63.626-33.923-63.626-33.923l-19.076,8.474L82.13,374.777H429.87l53.008-127.226l-19.076-8.474   C463.802,239.076,434.125,296.32,400.193,272.999z M170.852,321.058c-9.26,0-16.77-7.501-16.77-16.762   c0-9.252,7.51-16.753,16.77-16.753c9.244,0,16.753,7.501,16.753,16.753C187.606,313.557,180.096,321.058,170.852,321.058z    M256.008,312.681c-9.26,0-16.762-7.501-16.762-16.762c0-9.252,7.501-16.753,16.762-16.753c9.252,0,16.753,7.501,16.753,16.753   C272.762,305.18,265.26,312.681,256.008,312.681z M341.164,321.058c-9.26,0-16.753-7.501-16.753-16.762   c0-9.252,7.493-16.753,16.753-16.753c9.26,0,16.753,7.501,16.753,16.753C357.918,313.557,350.425,321.058,341.164,321.058z'
                    fill={currentMonarch === playerName ? "url(#gradient-0)" : globalPlayerData[playerID].colors.secondary}
                    stroke={'black'}
                    />
                </AnimatedSvg>
            </View>
        </View >
    )
}

const minHeight = 40;

const styles = (gameType?: string) => StyleSheet.create({
    /*
    container dimensions should be the height of a scaled up card,
    scaled up = 1.5. original height = 20% = 30% total height
    */
    static_counter_container: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        paddingTop: '1%',
    },
    dungeon_complete_touch: {
        flexDirection: 'row',
        height: '100%',
        width: gameType === 'oathbreaker' ? '20%' : `${100 / staticCounterList.length}%`,//works for commander, pushes cards too far on oathbreaker
        minHeight: minHeight,
        alignItems: 'center',
    },
    dungeon_icon_touch: {
        flexDirection: 'row',
        height: '100%',
        width: '20%',
        minHeight: minHeight,
        alignItems: 'center',
        zIndex: 10,
    },
    card_container: {
        height: '100%',
        width: `${100 / staticCounterList.length}%`,
        minHeight: minHeight,
    },
    card_overlay: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        borderRadius: 5,
        zIndex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
})

export default StaticCounterContainer