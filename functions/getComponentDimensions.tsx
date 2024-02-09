import { LayoutChangeEvent } from "react-native";

const getDimensions = (event: LayoutChangeEvent,
    stateFunction: (value: React.SetStateAction<{
        width: number;
        height: number;
    } | undefined>) => void) => {

        const { width, height } = event.nativeEvent.layout
        stateFunction({ width: Math.round(width), height: Math.round(height) })
}

export default getDimensions