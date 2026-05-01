import { useState } from 'react'
import { LayoutChangeEvent, StyleProp, Text, TextStyle } from 'react-native'

interface FitTextProps {
    text: string,
    style: StyleProp<TextStyle>,
    containerDimensions : {
        height : number,
        width: number
    }
}

const FitText : React.FC<FitTextProps> = ({ text, style, containerDimensions }) => {
  const [fontSize, setFontSize] = useState<number>(100);
  const [finalSize, setFinalSize] = useState<number>();

  const onMeasure = (e : LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    
    // Scale down proportionally to fit
    const widthRatio = containerDimensions.width / width;
    const heightRatio = containerDimensions.height / height;
    const ratio = Math.min(widthRatio, heightRatio, 1);
    
    setFinalSize(Math.floor(100 * ratio));
  };
  
  if (finalSize) {
    return <Text style={[style, { fontSize: finalSize }]}>{text}</Text>;
  }

  return (
    <Text
      style={[style, { fontSize: 36, opacity: 0, position: 'absolute' }]}
      onLayout={onMeasure}
    >
      {text}
    </Text>
  );
};

export default FitText