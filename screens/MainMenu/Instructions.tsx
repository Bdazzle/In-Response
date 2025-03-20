import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"
import { Image, Text, StyleSheet, View, Pressable, ImageSourcePropType, useWindowDimensions, ScrollView } from "react-native"
import Svg, { Path, Polygon } from "react-native-svg"
import { AllScreenNavProps } from "../.."
import { staticTextScaler } from "../../functions/textScaler"
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';

type InstructionItem = {
    id: string,
    image: ImageSourcePropType
}

const instructionalImages = [
    {
        id: 'Buttons',
        image: require("../../assets/instructions/app-instructions.png")
    }, {
        id: 'Counters',
        image: require("../../assets/instructions/counters-instructions.png")
    }, {
        id: 'Card Screens',
        image: require("../../assets/instructions/card-example.png")
    }
] as InstructionItem[]

interface PreviewProps {
    item: InstructionItem,
    dimensions: {
        width: number,
        height: number
    }
}

const Preview: React.FC<PreviewProps> = ({ item, dimensions }) => {

    return (
        <View style={styles.instruction_container}>
            <Text style={styles.sub_header}>{item.id}</Text>
            <ReactNativeZoomableView
                maxZoom={30}
                contentWidth={dimensions.width * .7}
                initialZoom={1}
                doubleTapZoomToCenter={true}
                bindToBorders={true}
                pinchToZoomOutSensitivity={0}
                style={{
                    width: dimensions.width * .7,
                    borderColor:'white',borderWidth:1
                }}
            >
                <Image source={item.image} style={{
                    width: dimensions.width * .7,
                    height: dimensions.height * .5,
                    resizeMode: 'contain',
                }}></Image>
            </ReactNativeZoomableView>
        </View>
    )
}

const Instructions: React.FC = ({ }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AllScreenNavProps>>();
    const { height, width } = useWindowDimensions();

    const handleBack = () => {
        navigation.navigate('MainMenu')
    }

    return (
        <View style={styles.screen}>
            {/* Back Button */}
            <View testID="header"
                style={styles.header}
            >
                <Pressable style={styles.back_button}
                    onPress={() => handleBack()}
                    accessibilityLabel="back to menu"
                    accessibilityRole="button"
                >
                    <Svg viewBox="0 0 800 800" style={{
                        width: 80,
                        height: 80,
                        transform: [
                            { rotate: '180deg' }
                        ]
                    }}>
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
                </Pressable>
                <Text style={styles.header_text} >Instructions</Text>
            </View>
            <Text style={{
                paddingTop: 25,
                paddingHorizontal: 10,
                fontSize: staticTextScaler(22),
                color: 'white',
                textAlign: 'center',
                fontFamily: 'Beleren',
            }} >
                Swipe in game screen to go back to main menu. Press/hold icons to interact
            </Text>
            <ScrollView contentContainerStyle={styles.content}>
                {instructionalImages.map((item, i) => {
                    return (
                        <Preview key={i} item={item} dimensions={{ height: height, width: width }} />
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "black",
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: 1
    },
    content: {
        marginTop: '5%',
        width: '100%',
        paddingBottom: '40%',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
    },
    back_button: {
        width: 80,
        height: 80,
    },
    header_text: {
        fontSize: staticTextScaler(36),
        color: 'white',
        fontFamily: 'Beleren',
    },
    instruction_container: {
        padding: 10,
        paddingLeft:20,
        paddingRight:20,
    },
    sub_header: {
        fontSize: staticTextScaler(24),
        color: 'white',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontFamily: 'Beleren',
    },
})

export default Instructions