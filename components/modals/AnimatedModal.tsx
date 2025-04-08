import React, { useEffect, useRef, useState } from "react";
import { Text, View, Pressable, StyleSheet, Modal, Animated, Easing } from "react-native";
import Svg, { Path } from "react-native-svg";
import getDimensions from "../../functions/getComponentDimensions";

interface ModalProps {
    visible: boolean;
    modalTitle: string
    close: () => void;
    accept?: () => void;
    decline?: () => void;
    rotate?: string
}

const AnimatedModal: React.FC<ModalProps> = ({ visible, modalTitle, close, accept, decline, rotate }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [pressDimensions, setPressDimensions] = useState<{ width: number, height: number }>({ width: 380, height: 750 })
    const modalScaleVal = useRef(new Animated.Value(0)).current;
    const [fontSize, setFontSize] = useState<number>(16)

    const modalStyle = {
        transform: [
            {
                scale: modalScaleVal,
            },
        ],
    };

    useEffect(() => {
        if (visible === true) {
            setModalVisible(true)
            handleAnimation()
        }
    }, [visible, modalVisible])

    const handleAnimation = () => {
        Animated.parallel([
            Animated.timing(modalScaleVal, {
                toValue: 1,
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: false,
            }),
        ]).start();
    };

    const hideModal = () => {
        setModalVisible(false)
        modalScaleVal.setValue(0)
        handleAnimation()
    }

    const handlePress = (func?: () => void) => {
        hideModal();
        if (func) {
            func();
        }
    }

    useEffect(() => {
        setFontSize(pressDimensions.width / 9)
    }, [pressDimensions])

    return (
        <Modal visible={modalVisible} transparent onRequestClose={() => { handlePress(close) }}>
            <Pressable nativeID="modalBackdropPress"
                style={[styles.backdrop,
                rotate !== undefined && {
                    transform: [{ rotate: rotate }]
                }]}
                onPress={() => handlePress(close)}
                onLayout={(e) => getDimensions(e, setPressDimensions)}
                accessibilityRole="button"
                accessibilityLabel="modal background"
                accessibilityHint="Close modal"
            >
                <Animated.View testID='modalContent'
                    style={[styles.reset_modal, modalStyle]}
                >
                    <View
                        style={styles.modal} >
                        <Text
                            numberOfLines={2}
                            style={[styles.modal_text, {
                                fontSize:fontSize
                            }]}>
                            {modalTitle}
                        </Text>
                        {accept &&
                            <View style={styles.button_container}>
                                {accept &&
                                    <Pressable style={styles.modal_buttons} onPress={() => handlePress(accept)}
                                        accessibilityLabel="confirm Reset Game"
                                        accessibilityRole="button"
                                    >
                                        <Svg key="check" viewBox='0 0 18 18'>
                                            <Path d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27   c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0   L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                                                fill="green" />
                                        </Svg>
                                    </Pressable>
                                }
                                {decline &&
                                    <Pressable style={styles.modal_buttons}
                                        onPress={() => handlePress(decline)}
                                        accessibilityLabel="Close reset game"
                                        accessibilityRole="button"
                                    >
                                        <Svg key="cross" viewBox='0 0 56 56'>
                                            <Path d="M45.363,36.234l-13.158-13.16l12.21-12.21c2.31-2.307,2.31-6.049,0-8.358c-2.308-2.308-6.05-2.307-8.356,0l-12.212,12.21   L11.038,1.906c-2.309-2.308-6.051-2.308-8.358,0c-2.307,2.309-2.307,6.049,0,8.358l12.81,12.81L1.732,36.831   c-2.309,2.31-2.309,6.05,0,8.359c2.308,2.307,6.049,2.307,8.356,0l13.759-13.758l13.16,13.16c2.308,2.308,6.049,2.308,8.356,0   C47.673,42.282,47.672,38.54,45.363,36.234z"
                                                fill="red" />
                                        </Svg>
                                    </Pressable>
                                }
                            </View>
                        }
                    </View>
                </Animated.View>
            </Pressable>
        </Modal >


    )
}

const styles = StyleSheet.create({
    backdrop: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    reset_modal: {
        backgroundColor: 'black',
        width: '60%',
        height: '30%',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
    },
    modal: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal_text: {
        color: "white",
        fontFamily: "Beleren",
        textAlign: 'center',
    },
    button_container: {
        flexDirection: 'row',
        width: '100%',
        height: '35%',
        justifyContent: "space-around",
        flex: 1
    },
    modal_buttons: {
        width: '20%',
    },
})

export default AnimatedModal