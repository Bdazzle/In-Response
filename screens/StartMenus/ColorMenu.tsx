import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react"
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native"
import { StartMenuStackNavProps } from "../..";
import FadeContainer from "../../components/FadeContainer";
import MenuNavButtons from "../../components/MenuNavButtons";
import { StartMenuStackParamList } from "../../navigation";


export interface ColorMenuProps {
    playerID: number;
    primary: string;
    secondary: string
}

const ColorMenu: React.FC<ColorMenuProps> = ({ }) => {
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

                {/* Primary */}
                <View style={styles.option_container}>
                    <Text style={styles.option_label}>Background {'\n'} Color</Text>
                    <TouchableWithoutFeedback style={styles.color_touch} 
                    onPress={() => handleColorSelect('primary', route.params.primary)}
                    >
                        <View style={[styles.color_square, {
                            backgroundColor: route.params.primary,
                        }]}>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                {/* Secondary */}
                <View style={styles.option_container}>
                    <Text style={styles.option_label}>Text {'\n'} Color</Text>
                    <TouchableWithoutFeedback style={styles.color_touch} 
                    onPress={() => handleColorSelect('secondary', route.params.secondary)}
                    >
                        <View style={[styles.color_square, {
                            backgroundColor: route.params.secondary,
                        }]}>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </View>

            <FadeContainer style={styles.fade_container}>
                <MenuNavButtons navBack="PlayerOptions" />
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