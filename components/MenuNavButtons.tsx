import { useNavigation } from "@react-navigation/native";
import React from "react"
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg'
import { AllScreenNavProps } from "..";
import {  RootStackParamList, StartMenuStackParamList } from "../navigation";


interface MenuNavProps {
    navTo?: keyof StartMenuStackParamList | keyof RootStackParamList;
    navToOptions?: object;
    navBack?: keyof StartMenuStackParamList | keyof RootStackParamList;
    navBackOptions?: object
}

const MenuNavButtons: React.FC<MenuNavProps> = ({ navBack, navTo, navToOptions, navBackOptions }) => {
    const navigation = useNavigation<AllScreenNavProps>()

    const handleNext = () => {
        if(navTo !== undefined ){
            navigation.navigate(navTo, navToOptions)
        }
    }

    const handleBack = () => {
        if (navBack !== undefined) {
            navigation.navigate(navBack, navBackOptions)
        }
    }

    return (

        <View style={[styles.buttons_container]}>
            {/* Back */}
            {navBack !== undefined &&
                <TouchableOpacity style={styles.back_touchable}
                    onPress={() => handleBack()}
                >
                    {/* -367 */}
                    <Svg viewBox="-200 -420 900 900" >
                        <Path d="M206.78,341.58v-47.04l-81.44,47.04V153.42l81.44,47.04v-47.04l40.72,23.52V0   C110.81,0,0,110.81,0,247.5S110.81,495,247.5,495V318.06L206.78,341.58z"
                            fill={"#6D2C93"}
                        />
                        <Path d="M247.5,0v176.94l122.16,70.56L247.5,318.06V495C384.19,495,495,384.19,495,247.5S384.19,0,247.5,0z"
                            fill={"#3D1952"}
                        />
                        <Polygon points={"125.34,247.5 125.34,341.58 206.78,294.54 206.78,341.58 247.5,318.06 369.66,247.5  "}
                            fill={"#9CDD05"}
                        />
                        <Polygon points={"206.78,200.46 125.34,153.42 125.34,247.5 369.66,247.5 247.5,176.94 206.78,153.42  "}
                            fill={"#B2FA09"}
                        />
                    </Svg>
                </TouchableOpacity>
            }
            {/* Next*/}
            { navTo !== undefined &&
                <TouchableOpacity style={styles.next_touchable}
                    onPress={() => handleNext()}
                >
                    <Svg viewBox="-200 150 900 900">
                        <Path d="M206.78,341.58v-47.04l-81.44,47.04V153.42l81.44,47.04v-47.04l40.72,23.52V0   C110.81,0,0,110.81,0,247.5S110.81,495,247.5,495V318.06L206.78,341.58z"
                            fill={"#6D2C93"}
                        />
                        <Path d="M247.5,0v176.94l122.16,70.56L247.5,318.06V495C384.19,495,495,384.19,495,247.5S384.19,0,247.5,0z"
                            fill={"#3D1952"}
                        />
                        <Polygon points={"125.34,247.5 125.34,341.58 206.78,294.54 206.78,341.58 247.5,318.06 369.66,247.5  "}
                            fill={"#9CDD05"}
                        />
                        <Polygon points={"206.78,200.46 125.34,153.42 125.34,247.5 369.66,247.5 247.5,176.94 206.78,153.42  "}
                            fill={"#B2FA09"}
                        />
                    </Svg>
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    buttons_container: {
        height:'100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    next_touchable: {
        width: '50%',
        height: '50%',
    },
    back_touchable: {
        width: '50%',
        transform: [
            { rotate: '180deg' }
        ]
    }
})

export default MenuNavButtons