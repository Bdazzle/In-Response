import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useEffect, useReducer } from "react"
import { StyleSheet, Pressable, View } from "react-native"
import Svg, { Circle, Path, Polygon } from "react-native-svg"
import { RootStackParamList } from "../../navigation"
import { imageAction, imageReducer, ImageReducerState } from "../../reducers/imageResources"

interface DayNightProps {
    activeCycle: string,
    setActiveCycle: React.Dispatch<React.SetStateAction<string>>
}

const CombinedSvg: React.FC = () => {
    return (
        <View style={styles.combined_container}>
            <Svg testID="night" viewBox="0 0 506 506">
                <Path d="M248.082,0.003C111.07,0.003,0,111.063,0,248.085c0,137.001,111.07,248.07,248.082,248.07  c137.006,0,248.076-111.069,248.076-248.07C496.158,111.062,385.088,0.003,248.082,0.003z"
                    fill="#334D5C"
                />
                <Path d="M322.377,80.781c10.1,22.706,15.721,47.844,15.721,74.298c0,101.079-81.94,183.019-183.019,183.019  c-26.454,0-51.591-5.622-74.298-15.721c28.49,64.053,92.674,108.721,167.298,108.721c101.078,0,183.019-81.94,183.019-183.019  C431.098,173.454,386.43,109.27,322.377,80.781z"
                    fill="#F2C900"
                />
                <Polygon points={"209.824,194.758 214.465,177.15 199.799,187.941 183.881,178.107 190.219,195.371   175.339,207.49 194.323,206.778 200.644,224.693 206.441,206.399 224.826,205.941 "}
                    fill="#F2C900"
                ></Polygon>
                <Polygon points={"101.521,229.699 82.134,229.015 76.043,211.187 69.952,229.015 50.564,229.699 66.187,240.6   60.296,259.651 76.043,247.761 91.789,259.651 85.898,240.6 "}
                    fill="#F2C900"
                ></Polygon>
                <Polygon points={"278.639,68.596 255.368,67.775 248.058,46.377 240.747,67.775 217.476,68.596   236.228,81.682 229.156,104.548 248.058,90.276 266.958,104.548 259.887,81.682 "}
                    fill="#F2C900"
                ></Polygon>
            </Svg>
            <Svg testID="day" viewBox="5 5 138 138"
                style={styles.combined_day}>
                <Circle cx={84.246} cy={84.246} r={34.16} fill="#F6921E" ></Circle>
                <Path d="M85.549,133.599c21.294,7.977,40.501,2.371,40.501,2.371c-15.268-0.273-21.38-3.084-23.699-5.791     c22.74,0.212,38.873-11.626,38.873-11.626c-14.443,4.965-21.149,4.415-24.257,2.662c21.444-7.577,32.554-24.216,32.554-24.216     c-11.874,9.603-18.363,11.378-21.882,10.796c17.559-14.457,22.305-33.891,22.305-33.891     c-7.874,13.084-13.361,16.976-16.868,17.627c11.556-19.585,9.369-39.474,9.369-39.474c-2.922,14.99-6.752,20.522-9.822,22.335     c4.16-22.36-4.696-40.3-4.696-40.3c2.379,15.085,0.675,21.593-1.59,24.35c-3.74-22.434-18.197-36.264-18.197-36.264     c7.394,13.363,8.019,20.06,6.834,23.423c-11.188-19.8-29.506-27.854-29.506-27.854c11.522,10.027,14.4,16.108,14.436,19.673     C82.617,22.645,62.651,21.341,62.651,21.341c14.256,5.484,19.039,10.213,20.292,13.55c-21.296-7.974-40.503-2.369-40.503-2.369     c15.268,0.273,21.382,3.084,23.701,5.791C43.402,38.102,27.27,49.939,27.27,49.939c14.447-4.962,21.149-4.415,24.255-2.662     c-21.443,7.578-32.553,24.218-32.553,24.218c11.876-9.606,18.365-11.383,21.882-10.798     C23.295,75.151,18.547,94.588,18.547,94.588c7.875-13.087,13.363-16.976,16.869-17.63c-11.556,19.591-9.369,39.477-9.369,39.477     c2.922-14.991,6.752-20.521,9.822-22.336c-4.16,22.358,4.697,40.3,4.697,40.3c-2.38-15.087-0.676-21.593,1.59-24.349     c3.74,22.434,18.197,36.264,18.197,36.264c-7.397-13.362-8.02-20.061-6.834-23.424c11.187,19.801,29.503,27.853,29.503,27.853     c-11.521-10.025-14.397-16.107-14.435-19.675c17.286,14.78,37.249,16.082,37.249,16.082     C91.583,141.667,86.8,136.938,85.549,133.599z M67.34,114.029c-4.049-2.458-7.192-5.44-9.169-7.581     c-2.96-3.691-4.895-7.566-6.021-10.255c-1.519-4.483-2.012-8.787-2.149-11.696c0.104-4.734,1.112-8.948,1.978-11.732     c1.72-4.411,4.11-8.024,5.877-10.342c3.121-3.56,6.603-6.138,9.053-7.712c4.153-2.275,8.306-3.507,11.148-4.147     c4.678-0.718,9-0.455,11.89-0.086c4.644,0.925,8.615,2.65,11.207,3.988c4.044,2.453,7.183,5.432,9.162,7.57     c2.965,3.695,4.9,7.575,6.026,10.267c1.519,4.48,2.011,8.785,2.149,11.693c-0.105,4.734-1.114,8.945-1.979,11.728     c-1.716,4.412-4.104,8.023-5.87,10.342c-3.125,3.562-6.606,6.14-9.059,7.717c-4.151,2.273-8.304,3.507-11.147,4.147     c-4.68,0.718-9.001,0.454-11.893,0.085C73.901,117.09,69.93,115.364,67.34,114.029z"
                    fill="#f5d142"
                ></Path>
            </Svg>
        </View>
    )
}

/*
changing cycle has to be done in Game.tsx so it can be changed when reset button is pressed.
*/
const DayNight: React.FC<DayNightProps> = ({ activeCycle, setActiveCycle }) => {
    const [resources, dispatchResources] = useReducer<(state: ImageReducerState, action: imageAction) => ImageReducerState>(imageReducer,
        {
            Svg: ''
        })
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        dispatchResources({ card: activeCycle })
    }, [activeCycle])

    const changeCycle = () => {
        activeCycle === 'day' ? setActiveCycle('night') : setActiveCycle('day')
    }

    const cardLongPress = () => {
        if (activeCycle !== "neutral") {
            navigation.navigate("Card", {
                card: `${activeCycle}Card`,
            })
        }
    }

    return (
        <Pressable onPress={() => changeCycle()}
            onLongPress={() => cardLongPress()}
            style={styles.cycle_pressable}
            accessibilityLabel="Day/Night Cycle"
            accessibilityRole="button"
            accessibilityValue={{text: activeCycle}}
            accessibilityLiveRegion="polite"
        >
            {activeCycle === "neutral" ?
                <CombinedSvg />
                :
                <View>
                    {resources.Svg}
                </View>
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cycle_pressable: {
        width: '100%',
        height: '100%'
    },
    combined_container: {
        width: '100%',
        height: "100%",
        flexDirection: 'row'
    },
    combined_day: {
        zIndex: 10,
        position: 'absolute',
        left: '25%'
    }
})

export default DayNight