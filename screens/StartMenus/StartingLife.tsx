import React, { useContext } from "react"
import { View, StyleSheet, Text, KeyboardAvoidingView, TextInput, Pressable } from 'react-native';
import MenuNavButtons from "../../components/MenuNavButtons";
import FadeContainer from "../../components/FadeContainer";
import { useNavigation } from "@react-navigation/native";
import { StartMenuStackNavProps } from "../..";
import { OptionsContext, OptionsContextProps } from "../../OptionsContext";

/* 
const [list,chunkSize] = [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 6]
[...Array(Math.ceil(list.length / chunkSize))].map(_ => list.splice(0,chunkSize))
*/
const LifeMenu = () => {
    const navigation = useNavigation<StartMenuStackNavProps>()
    const { setStartingLife, startingLife, setGameType, gameType } = useContext(OptionsContext) as OptionsContextProps
    const options = [20, 40, 60, 80, 100]
    const chunk = 2
    const totalChunks = Math.ceil(options.length / chunk)
    const chunkedOptions = [...Array(totalChunks)].map((_) => options.splice(0, chunk))

    const handleSelectTotal = (val: string | number) => {
        setStartingLife(Number(val))
        navigation.navigate("TotalPlayers")
    }

    const handleOptionDefault  = (val: string) =>{
        setGameType(val)
        val === "commander" ? setStartingLife(40) : setStartingLife(20)
        navigation.navigate("TotalPlayers")
    }

    return (
        <View style={styles.container}>
            <View testID="gametype_container" 
            style={styles.gametype_container}
            >
                <Text style={styles.title_text}>Game Type</Text>
                <View style={styles.game_options_wrapper}>
                    <Pressable 
                    onPressIn={() => handleOptionDefault('commander')}
                        style={gameType ==='commander' ? styles.selected_game_option : styles.game_option}
                    >
                        <Text style={ gameType ==='commander' ? styles.selected_option : styles.option_text} >Commander</Text>
                    </Pressable>
                    <Pressable 
                    onPressIn={() => handleOptionDefault('normal')}
                        style={gameType ==='normal' ? styles.selected_game_option : styles.game_option}
                    >
                        <Text style={ gameType ==='normal' ? styles.selected_option : styles.option_text}>Normal</Text>
                    </Pressable>
                    <Pressable 
                    onPressIn={() => handleOptionDefault('oathbreaker')}
                        style={gameType ==='oathbreaker' ? styles.selected_game_option : styles.game_option}
                    >
                        <Text style={ gameType ==='oathbreaker' ? styles.selected_option : styles.option_text}>Oathbreaker</Text>
                    </Pressable>
                </View>
            </View>

            <Text style={styles.title_text} >Starting Life Total</Text>
            <View style={styles.options_wrapper}>
                {chunkedOptions.map((chunks: number[], index: number) => {
                    {
                        return index !== chunkedOptions.length - 1 ? <View key={index} style={styles.options_subcontainer}>
                            {chunks.map((c: number) => {
                                return <Pressable key={c}
                                    style={startingLife === c ? styles.selected_option_touch : styles.option_touch}
                                    onPressIn={() => handleSelectTotal(c)}
                                >
                                    <Text key={`${c}_text`} 
                                    style={startingLife === c ? styles.selected_option : styles.option_text} 
                                    >{c}</Text>
                                </Pressable>
                            })}
                        </View> :
                            <View key={index} style={styles.options_subcontainer}>
                                {chunks.map((c: number) => {
                                    return <Pressable key={c}
                                        style={styles.option_touch}
                                        onPressIn={() => handleSelectTotal(c)}
                                    >
                                        <Text key={`${c}_text`} testID={`${c}_text`} 
                                        style={startingLife === c ? styles.selected_option : styles.option_text} 
                                        >{c}</Text>
                                    </Pressable>
                                })}
                                <KeyboardAvoidingView testID="life_input_view" style={styles.input_container}  >
                                    <View testID="life_input_touch" style={styles.input_wrapper}>
                                        <TextInput testID="life_input" style={styles.input_text}
                                        accessibilityLabel="Input custom starting life total"
                                        editable={true}
                                            keyboardType='numeric'
                                            onSubmitEditing={(e) => handleSelectTotal(e.nativeEvent.text)}
                                        ></TextInput>
                                    </View>
                                </KeyboardAvoidingView>
                            </View>
                    }
                })}
            </View>

            {startingLife > 0 &&
                <FadeContainer style={styles.fade_container}>
                    <MenuNavButtons navTo="TotalPlayers" labelTo="Total Players"/>
                </FadeContainer>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
    },
    gametype_container:{
        width:'100%',
        height:'40%',
        justifyContent: 'space-evenly'
    },
    title_text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 40,
        fontFamily:'Beleren'
    },
    game_options_wrapper:{
        width:'100%',
        height:'80%',
        justifyContent: 'space-evenly',
        alignItems:'center'
    },
    game_option:{
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 2,
        width:'80%',
        minHeight:80,
        justifyContent:'center',
    },
    selected_game_option:{
        backgroundColor:'white',
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 2,
        width:'80%',
        minHeight:80,
        justifyContent:'center',
    },
    option_touch: {
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 2,
        width: '30%',
        alignItems:'center',
        justifyContent:'center',
        minHeight:80,
    },
    selected_option_touch:{
        backgroundColor:'white',
        borderColor: 'white',
        borderRadius: 5,
        borderWidth: 2,
        width: '30%',
        alignItems:'center',
        justifyContent:'center',
        minHeight:80,
    },
    option_text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 36,
        fontFamily:'Beleren',
    },
    selected_option :{
        backgroundColor:'white',
        color: 'black',
        textAlign: 'center',
        fontSize: 36,
        fontFamily:'Beleren',
    },
    options_wrapper: {
        alignContent: 'center',
        justifyContent: 'space-evenly',
        width: '70%',
        height: '37%'
    },
    options_subcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        minHeight:80,
        alignItems:'center'
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
        width: '100%',
        fontSize: 36,
        borderBottomColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 2,
        fontFamily:'Beleren'
    },
    input_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '33%',
        minHeight:80
    },
    fade_container: {
        height: '20%',
        width: '100%',
    },
    
})

export default LifeMenu