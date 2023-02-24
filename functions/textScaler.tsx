import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width } = Dimensions.get('window');

//320 is from iphone 5 scale, smallest phone baseline. idk how this number is calculated
// const scale = width / 320;

/*
scale needs to be based of parent size, not screen size,
TODO:change to parentheight instead of width?
*/
export function textScaler(size: number, parentWidth?: number): number {
  const scale = parentWidth !== undefined ? parentWidth / 320 : width / 320
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}


export function lifeTotalScaler(totalPlayers: number, lifeTotal: number): number {
  if (totalPlayers === 1) {
    return String(lifeTotal).length < 3 ? textScaler(235) : textScaler(171)
  } else if (totalPlayers === 2) {
    return String(lifeTotal).length < 3 ? textScaler(180) : textScaler(120)
  } else if (totalPlayers === 3) {
    return String(lifeTotal).length < 3 ? textScaler(140) : textScaler(120)
  } else {
    return String(lifeTotal).length < 3 ? textScaler(140) : textScaler(120)
  }
}

export function counterScaler(totalCounters: number, dimensions?: {height: number, width: number}){
  if(totalCounters === 1){
    //900 = test tablet width
    return width >= 900 ? textScaler(55) : textScaler(80)
  } else if(totalCounters === 2) {
    return textScaler(52)
  } else if(totalCounters === 3){
    return textScaler(36)
  } else if(totalCounters === 4){
    return textScaler(32)
  } else {
    return textScaler(26)
  }
}
