import { LayoutChangeEvent } from "react-native";

const getDimensions = (event: LayoutChangeEvent, stateFunction: (value: React.SetStateAction<{
        width: number;
        height: number;
    }>) => void) => {

        const { width, height } = event.nativeEvent.layout
        if(height !==0 && width !==0){
            stateFunction({ width: Math.round(width), height: Math.round(height) })
        }

}

export default getDimensions