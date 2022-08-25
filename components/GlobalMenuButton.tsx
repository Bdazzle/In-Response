import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react"
import { Pressable } from "react-native"
import Svg, { Path } from "react-native-svg"
import { AllScreenNavProps } from "..";

const GlobalMenuButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();

    const handlePress = () =>{
        navigation.navigate("GlobalMenu")
    }

     return (
            <Pressable style={{
                height:'100%',
                width:'100%'
            }} 
            onPress={() => handlePress()}>
                <Svg viewBox="0 0 512 512">
                    <Path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M192,106.667h128    c11.797,0,21.333,9.557,21.333,21.333s-9.536,21.333-21.333,21.333H192c-11.797,0-21.333-9.557-21.333-21.333    S180.203,106.667,192,106.667z M320,405.333H192c-11.797,0-21.333-9.557-21.333-21.333s9.536-21.333,21.333-21.333h128    c11.797,0,21.333,9.557,21.333,21.333S331.797,405.333,320,405.333z M384,320H128c-11.797,0-21.333-9.557-21.333-21.333    s9.536-21.333,21.333-21.333h256c11.797,0,21.333,9.557,21.333,21.333S395.797,320,384,320z M384,234.667H128    c-11.797,0-21.333-9.557-21.333-21.333S116.203,192,128,192h256c11.797,0,21.333,9.557,21.333,21.333S395.797,234.667,384,234.667    z"
                    fill={"#858585"}
                    />
                </Svg>
            </Pressable>
    )
}

export default GlobalMenuButton