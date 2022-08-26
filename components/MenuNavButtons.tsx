import { useNavigation } from "@react-navigation/native";
import React from "react"
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg'
import { AllScreenNavProps } from "..";
import { textScaler } from "../functions/textScaler";
import { RootStackParamList, StartMenuStackParamList } from "../navigation";

interface MenuNavProps {
    labelTo?: string
    labelBack?: string
    navTo?: keyof StartMenuStackParamList | keyof RootStackParamList;
    navToOptions?: object;
    navBack?: keyof StartMenuStackParamList | keyof RootStackParamList;
    navBackOptions?: object
}

const MenuNavButtons: React.FC<MenuNavProps> = ({ labelTo, labelBack, navBack, navTo, navToOptions, navBackOptions }) => {
    const navigation = useNavigation<AllScreenNavProps>()

    const handleNext = () => {
        if (navTo !== undefined) {
            navigation.navigate(navTo, navToOptions)
        }
    }

    const handleBack = () => {
        if (navBack !== undefined) {
            navigation.navigate(navBack, navBackOptions)
        }
    }

    return (
        <View style={styles.buttons_container}
            testID="button_container" >
            <View testID="arrow_button_wrapper"
                style={styles.buttons_wrapper}>
                {/* Back */}
                {navBack !== undefined &&
                    <TouchableOpacity style={styles.back_touchable}
                        onPress={() => handleBack()}
                        testID="back_press"
                    >
                        <Svg viewBox="-50 -50 600 600" style={{
                            height:'100%',
                            width:'100%',
                            // borderColor:'white',
                            // borderWidth:1,
                            transform: [
                                { rotate: '180deg' }
                            ]
                        }} >
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
                        <Text style={styles.label_text}>{labelBack}</Text>
                    </TouchableOpacity>
                }
                {/* Next*/}
                {navTo !== undefined &&
                    <TouchableOpacity style={styles.next_touchable}
                        testID="next_press"
                        onPress={() => handleNext()}
                    >
                        <Svg viewBox="-50 -50 600 600"
                        style={{
                            height:'100%',
                            width:'100%',
                            // borderColor:'white',
                            // borderWidth:1,
                        }}
                         >
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
                        <Text style={styles.label_text}>{labelTo}</Text>
                    </TouchableOpacity>
                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    buttons_container: {
        width: '100%',
    },
    buttons_wrapper: {
        height: '60%',
        width: '100%',
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    next_touchable: {
        width: '40%',
    },
    back_touchable: {
        width: '40%',
        justifyContent: 'flex-start'
    },
    label_text: {
        color: 'white',
        fontFamily: 'Beleren',
        fontSize: textScaler(18),
        textAlign: 'center'
    }
})

export default MenuNavButtons