
import React, { useContext, useEffect, useState } from "react"
import { Image, View, StyleSheet, Pressable, ImageSourcePropType } from "react-native"
import { OptionsContext } from "../../OptionsContext"
import FlipCard from "../counters/Flipcard"
import { GameContext } from "../../GameContext"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../navigation"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface RingProps {
    imageSource: {
        front: ImageSourcePropType,
        back: ImageSourcePropType
    }
}

const TheRing: React.FC<RingProps> = ({ imageSource }) => {
    const { globalPlayerData, dispatchGlobalPlayerData } = useContext(GameContext)
    const { deviceType } = useContext(OptionsContext)
    const [level, setLevel] = useState<number>(0)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Card'>>()

    const levelChange = (num: number) => {
        level === num ? setLevel(num - 1) : setLevel(num)
        dispatchGlobalPlayerData({
            playerID: route.params.playerID as number,
            field: 'the ring',
            value: level
        })
    }

    const closeCard = () => {
        navigation.navigate('Game', { menu: false })
    }

       useEffect(() =>{
        if(globalPlayerData[route.params.playerID as number].theRing){
            setLevel(globalPlayerData[route.params.playerID as number].theRing as number)
        }
       },[])

    /*
    change corners to triangle SVGs?
    may have to calculate ring_overlay_container height as a fraction of the screen size,
    to maintain consistency over devices
    */

    return (
        <View testID="ring_overlay_container"
            style={styles().ring_container}
        >
            <FlipCard front={imageSource.front} back={imageSource.back} />
            <Pressable testID="close"
                onPress={() => closeCard()}
                style={{
                    height: '40%',
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                }}
            ></Pressable>
            <View testID='ring_overlay_wrapper'
                style={deviceType === 'tablet' ?
                    styles().tablet_ring_overlay_wrapper :
                    styles().ring_overlay_wrapper}
            >
                <Pressable testID="level1"
                    onPress={() => levelChange(1)}
                    style={[level >= 1 ? styles().visible_level : styles().hidden_level,
                    styles(deviceType).level1]}
                >
                        <Image
                            source={require('../../assets/cards/ring_overlay/level1.png')}
                            style={{
                                height: '100%',
                                width: '100%'
                            }}
                        />  
                </Pressable>

                <Pressable testID="level2"
                    onPress={() => levelChange(2)}
                    style={[level >= 2 ? styles().visible_level : styles().hidden_level,
                    styles(deviceType).level2]}
                >
                        <Image
                            source={require('../../assets/cards/ring_overlay/level2.png')}
                            style={{
                                height: '100%',
                                width: '100%'
                            }}
                        />
                </Pressable>

                <Pressable testID="level3"
                    onPress={() => levelChange(3)}
                    style={[level >= 3 ? styles().visible_level : styles().hidden_level,
                    styles(deviceType).level3]}
                >
                        <Image 
                        source={require('../../assets/cards/ring_overlay/level3.png')} 
                        style={{
                            height: '100%',
                            width: '100%'
                        }}
                        />
                </Pressable>

                <Pressable testID="level4"
                    onPress={() => levelChange(4)}
                    style={[level === 4 ? styles().visible_level : styles().hidden_level,
                    styles(deviceType).level4]}
                >
                    <Image 
                        source={require('../../assets/cards/ring_overlay/level4.png')} 
                        style={{
                            height: '100%',
                            width: '100%'
                        }}
                        />
                </Pressable>
            </View>
        </View>
    )
}

const styles = (deviceType?: string) => StyleSheet.create({
    ring_container: {
        height: '75%',
        maxWidth: 690,//the width contained card image on tablet
        width: '100%',
        justifyContent: 'center',
    },
    tablet_ring_container: {
        aspectRatio: .75
    },
    tablet_ring_overlay_wrapper: {
        position: 'absolute',
        left: '9%',
        width: '82%',
        height: '43%',
        bottom: '9%',
        alignItems: 'center',
    },
    ring_overlay_wrapper: {
        position: 'absolute',
        left: '8%',
        width: '84%',
        height: '43%',
        bottom: '9%',
        alignItems: 'center',
    },
    visible_level: {
        color: 'black',
        justifyContent: 'center',
        width: '100%'
    },
    hidden_level: {
        opacity: 0,
        width: '100%',
    },
    level1: {
        height: deviceType === 'tablet' ? '21%' : '19%',
    },
    level2: {
        // marginTop: '-1%',
        height: deviceType === 'tablet' ? '23%' : '20%',
    },
    level3: {
        // marginTop: '-1%',
        height: deviceType === 'tablet' ? '29%' : '26%',
    },
    level4: {
        // marginTop: '-1%',
        height: deviceType === 'tablet' ? '26%' : '23%',
    },
})

export default TheRing