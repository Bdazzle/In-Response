import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react"
import { Text, StyleSheet, View, Pressable } from "react-native"
import { StartMenuStackNavProps } from "../..";
import FadeContainer from "../../components/FadeContainer";
import MenuNavButtons from "../../components/MenuNavButtons";
import { StartMenuStackParamList } from "../../navigation";

export interface ColorMenuProps {
    playerID: number;
    primary: string;
    secondary: string
}

const ColorMenu: React.FC = ({ }) => {
    const navigation = useNavigation<StartMenuStackNavProps>()
    const route = useRoute<RouteProp<StartMenuStackParamList, 'ColorMenu'>>()

    const handleColorSelect = (position: string, currentColor: string) =>{
        navigation.navigate('ColorSelector', {
            playerID: route.params.playerID,
            currentColor: currentColor,
            colorPosition: position
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.options_wrapper}>

                {/* Primary/Background */}
                <View style={styles.option_container}>
                    <Text style={styles.option_label}>Background {'\n'} Color</Text>
                    <Pressable style={styles.color_touch} 
                    onPressIn={() => handleColorSelect('primary', route.params.primary)}
                    accessibilityLabel="background color"
                    >
                        <View style={[styles.color_square, {
                            backgroundColor: route.params.primary,
                        }]}>
                        </View>
                    </Pressable>
                </View>

                {/* Secondary/Text */}
                <View style={styles.option_container}>
                    <Text style={styles.option_label}>Text {'\n'} Color</Text>
                    <Pressable style={styles.color_touch} 
                    onPressIn={() => handleColorSelect('secondary', route.params.secondary)}
                    accessibilityLabel="text color"
                    >
                        <View style={[styles.color_square, {
                            backgroundColor: route.params.secondary,
                        }]}>
                        </View>
                    </Pressable>
                </View>

            </View>

            <FadeContainer style={styles.fade_container}>
                <MenuNavButtons navBack="PlayerOptions" labelBack="Player Options" />
            </FadeContainer>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        alignContent: 'flex-end',
        justifyContent: 'space-between',
    },
    options_wrapper: {
        width: '100%',
        height: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent:'center'
    },
    option_container: {
        height: '30%',
        width: '40%',
        top: '40%',

    },
    option_label: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: "Beleren"
    },
    color_touch: {
        height: '100%',
        width: '100%',
        
    },
    color_square: {
        height: '100%',
        width: '100%',
        borderRadius: 5,
        borderColor:'white',
        borderWidth:.5
    },
    fade_container: {
        height: '20%',
        width: '100%',
        bottom: 0,
    }
})

export default ColorMenu