import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react"
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { StartMenuStackNavProps } from "../..";
import FadeContainer from "../../components/FadeContainer";
import MenuNavButtons from "../../components/MenuNavButtons";
import { OptionsContext, OptionsContextProps } from "../../OptionsContext";

/* 
const [list,chunkSize] = [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 6]
[...Array(Math.ceil(list.length / chunkSize))].map(_ => list.splice(0,chunkSize))
*/
const TotalPlayers = () => {
    const navigation = useNavigation<StartMenuStackNavProps>()
    const { setTotalPlayers, totalPlayers } = useContext(OptionsContext) as OptionsContextProps
    const options = [...Array(4)].map((_, i: number) => i + 1)
    const chunk = 2
    const totalChunks = Math.ceil(options.length / chunk)
    const chunkedOptions = [...Array(totalChunks)].map((_) => options.splice(0, chunk))

    const handleSelectPlayers = (val: string | number) => {
        setTotalPlayers(Number(val))
        navigation.navigate("PlayerOptions")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title_text} >Total Players</Text>
            <View style={styles.options_wrapper}>
                {chunkedOptions.map((chunks: number[], index: number) => {
                    return <View key={index} style={styles.options_subcontainer}>
                        {chunks.map((c: number) => {
                            return <Pressable key={c}
                                style={styles.option_touch}
                                onPressIn={() => handleSelectPlayers(c)}
                            >
                                <Text key={`${c}_text`} 
                                style={totalPlayers === c ? styles.selected_option : styles.option_text} 
                                >{c}</Text>
                            </Pressable>
                        })}
                    </View>
                })}
            </View>
                <FadeContainer style={styles.fade_container}>
                    <MenuNavButtons 
                    navTo = {totalPlayers > 0 ? "PlayerOptions" : undefined}
                    labelTo ={ totalPlayers > 0 ? "Player Options" : undefined} 
                    navBack="Life" labelBack="Life Totals" 
                    />
                </FadeContainer>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
    },
    title_text: {
        color: 'white',
        textAlign: 'center',
        marginTop: '20%',
        fontSize: 40,
        fontFamily: "Beleren"
    },
    option_touch: {
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 2,
        width: '30%',

    },
    option_text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 36,
        fontFamily: "Beleren"
    },
    options_wrapper: {
        alignContent: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '50%'
    },
    options_subcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    input_wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },
    input_text: {
        color: 'white',
        textAlign: 'center',
        width: '33%',
        fontSize: 70,
        borderBottomColor: 'white',
        borderWidth: 2,
        fontFamily: "Beleren"
    },
    input_container: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    fade_container: {
        height: '20%',
        width: '100%',
    },
    selected_option :{
        backgroundColor:'white',
        color: 'black',
        textAlign: 'center',
        fontSize: 36,
        fontFamily:'Beleren'
    }
})

export default TotalPlayers