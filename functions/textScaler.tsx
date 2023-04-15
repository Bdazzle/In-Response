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

export function counterScaler(totalCountersTypes: number, dimensions?: {height: number, width: number}){
  if(totalCountersTypes === 1){
    //900 = test tablet width
    return width >= 900 ? textScaler(40) : textScaler(60)
  } else if(totalCountersTypes === 2) {
    // return textScaler(52)
    // return textScaler(35)
    return width >= 900 ? textScaler(35) : textScaler(60)
  } else if(totalCountersTypes === 3){
    // return textScaler(36)
    return width >= 900 ? textScaler(35) : textScaler(60)
  } else if(totalCountersTypes === 4){
    // return textScaler(32)
    return width >= 900 ? textScaler(32) : textScaler(60)
  } else {
    // return textScaler(26)
    return width >= 900 ? textScaler(25) : textScaler(35)
  }
}
// width < 900 ? (componentDimensions && (totalPlayers === 4 ? componentDimensions.height * .8 : totalPlayers === 3 ? componentDimensions.height : componentDimensions.height * .7)) : ( componentDimensions && (totalPlayers === 4 ? componentDimensions.height * .8 : totalPlayers === 3 ? componentDimensions.height *.9 : componentDimensions.height * .7)) 
export function cdmgLineHeight(componentHeight : number, totalPlayers: number){
  if( width >= 900) {
    return totalPlayers === 4 ? componentHeight * .75 : totalPlayers === 3 ? componentHeight * .9 : componentHeight * .7
  }
  if (width >= 600 && width < 900 ) {
    return totalPlayers === 4 ? componentHeight *.7 : totalPlayers === 3 ? componentHeight * .9 : componentHeight * .9
  }
  if (width < 600) {
    return totalPlayers === 4 ? componentHeight *.8 : totalPlayers === 3 ? componentHeight : componentHeight * .7
  }
}

// width < 900 ? (componentDimensions && (totalPlayers === 4 ? componentDimensions.height * .8 : totalPlayers === 3 ? componentDimensions.height : componentDimensions.height * .7)) : ( componentDimensions && (totalPlayers === 4 ? componentDimensions.height * .8 : totalPlayers === 3 ? componentDimensions.height *.9 : componentDimensions.height * .7)),
export function cdmgScaler(componentHeight : number, totalPlayers: number){
  if( width >= 900) {
    return totalPlayers === 4 ? componentHeight * .8 : totalPlayers === 3 ? componentHeight * .9 : componentHeight * .7
  }
  if (width >= 600 && width < 900 ) {
    // return totalPlayers === 4 ? componentHeight *.7 : totalPlayers === 3 ? componentHeight * .9 : componentHeight * .9
    return totalPlayers === 4 ? componentHeight *.7 : componentHeight * .9
  }
  if (width < 600) {
    return totalPlayers === 4 ? componentHeight *.8 : totalPlayers === 3 ? componentHeight : componentHeight * .7
  }
}