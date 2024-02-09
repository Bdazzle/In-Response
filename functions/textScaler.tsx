import { deviceType } from 'expo-device';
import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

//width 600 is largest phone width?
//900 = test tablet width
//320 is from iphone 5 scale, smallest phone baseline. idk how this number is calculated
export function staticTextScaler(size: number): number {
  const scale = width / 320
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}


export function RFPercentage(percent: number) : number {
  const { height, width } = Dimensions.get("window");
  const standardLength = width > height ? width : height;
  const offset: number = width > height ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight!; // iPhone X style SafeAreaView size in portrait

  const deviceHeight = Platform.OS === "android" ? standardLength - offset : standardLength;

  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}


export function textScaler(textLength: number,
  parentDimensions: { width: number, height: number },
  maxSize?: number,
  minSize?: number): number {
  // Calculate ideal font size based on width and text length
  const idealFontSizeHeight = parentDimensions.height / (textLength); // Add 1 for line spacing
  const idealFontSizeWidth: number = parentDimensions.width / textLength;
  // check if device is tablet, 2, or phone, default
  let minFont = !minSize ? 16 : deviceType === 2 ? minSize * 1.4 : minSize
  let maxFont = !maxSize ? 36 : deviceType === 2 ? maxSize * 1.4 : maxSize;

  // Clamp font size within allowed range
  let bestFitFontSize = Math.min(
    Math.max(minFont, idealFontSizeHeight),
    Math.max(minFont, idealFontSizeWidth)
  );
  
  // Check for overflow and adjust font size
  // bestFitFontSize * textLength > parentDimensions.width || 
  while (bestFitFontSize > parentDimensions.height || bestFitFontSize > maxFont) {
    bestFitFontSize--;
  }
  
  // if(textLength === 1)console.log(parentDimensions, idealFontSizeHeight, idealFontSizeHeight, fontSize, minFont, maxFont)
  return Math.round(bestFitFontSize);
  // Check for overflow and shrink font size until it fits
  // while (fontSize * textLength > parentDimensions.height) {
  //   fontSize--;
  //   if (fontSize < minFont) {
  //     return minFont; // Enforce minimum font size
  //   }
  //   else if (fontSize >= maxFont) {
  //     return maxFont; // Enforce minimum font size
  //   }
  // }
  // while (fontSize * textLength <= parentDimension) {
  //   fontSize++;
  //   if (fontSize >= maxFont) {
  //     return maxFont; // Enforce minimum font size
  //   }
  //   else if (fontSize < minFont) {
  //     return minFont; // Enforce minimum font size
  //   } 
  // }

  // return fontSize;
}


export const cNameScaler = (name: string) =>{
  //as name length goes up, font size goes down (proportionally)
  //happens to be 1 to 1 ratio in this instance
  const minLength = 8;
  const startingFont =  deviceType === 1 ? 16 : 30;

  const diff = (name.length - minLength)
  const fontSize = startingFont - diff

  return name.length <= minLength ? startingFont : fontSize
}


export const cdmgScaler = (dmgtotal: number, totalPlayers: number, playerID: number, isPressed: boolean) : number =>{
  /*
  damage total check order: 0-9 : 10-19 : 20+
  starting with pressed(zoomed)/single digit font size,
  enlarge font size if >=10 and not pressed(zoomed) for better visibility when no adjusting
  */
  let fontSize: number;

  switch(totalPlayers){
    case 2 :{
      if(deviceType === 1){
        fontSize = dmgtotal < 10 ? RFPercentage(9) : dmgtotal >= 10 && dmgtotal < 20 ? RFPercentage(5.2) : RFPercentage(4.8)
      } 
      else {
        fontSize = dmgtotal < 10 ? RFPercentage(11) : dmgtotal >= 10 && dmgtotal < 20 ? RFPercentage(7) : RFPercentage(6.4)
      }
      return isPressed || dmgtotal < 10 ? fontSize : fontSize * 1.5
    };

    case 3 :{
      if(playerID === 3){
        if(deviceType === 1){
          fontSize = dmgtotal < 10 ? RFPercentage(9) : dmgtotal >= 10 && dmgtotal < 20 ? RFPercentage(5.5) : RFPercentage(4.8)
        }
        else {
          fontSize = dmgtotal < 10 ? RFPercentage(9) : dmgtotal >= 10 && dmgtotal < 20 ? RFPercentage(7) : RFPercentage(6.5)
        } 
        return isPressed || dmgtotal < 10 ? fontSize : fontSize * 1.5
      } 
      else {
        if( deviceType === 1){
          return RFPercentage(6.2)
        }
        else {
          fontSize = dmgtotal < 10 ? RFPercentage(8.5) : dmgtotal >= 10 && dmgtotal < 20 ? RFPercentage(6.5) : RFPercentage(6)
          return isPressed || dmgtotal < 10 ? fontSize : fontSize * 1.2
        }
      }
    };

    case 4 :{
      if(deviceType === 1) {
        fontSize = dmgtotal < 10 ? RFPercentage(5.5) : dmgtotal >= 10 && dmgtotal < 20 ? RFPercentage(5) : RFPercentage(4.5)
        return isPressed || dmgtotal < 10 ? fontSize : fontSize * 1.2
      }
      else {
        fontSize = dmgtotal < 10 ? RFPercentage(7) : dmgtotal >= 10 && dmgtotal < 20 ? RFPercentage(5) : RFPercentage(4.5)
        return isPressed || dmgtotal < 10 ? fontSize : fontSize * 1.5
      }
    }
    
    default:{
      return 16
    }
  }
}


export function cdmgLineHeight(dimension: { width: number, height: number }, totalPlayers: number, damage: number) {
  //tablet
  if (deviceType === 2) {
    if (damage < 10) {
      return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * 1.2
    } 
    else if (damage >= 10 && damage < 20) {
      return totalPlayers === 4 ? dimension.height * 1.1 : totalPlayers === 3 ? dimension.height * 1.15 : dimension.height
    } 
    else {
      return totalPlayers === 4 ? dimension.height * 1.1 : totalPlayers === 3 ? dimension.height * 1.15 : dimension.height
    }
  }
  if (width >= 600 && width < 900) {
    return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * .8
  }
  //phone
  if (deviceType === 1) {
    if (dimension.height < dimension.width) {
      /* wide containers*/
      if (damage < 10) {
        return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * 1.2
      } else if (damage >= 10 && damage < 20) {
        return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height
      } else {
        return totalPlayers === 4 ? dimension.height * 1.1 : totalPlayers === 3 ? dimension.height * 1.1 : dimension.height
      }
    } else {
      /* tall containers*/
      if (damage < 10) {
        return totalPlayers === 4 ? dimension.height * 1.3 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * 1.1
      } else if (damage >= 10 && damage < 20) {
        return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * .9 : dimension.height * .8
      } else {
        return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * .9 : dimension.height * .8
      }
    }
  }
}


export const handleTaxSize = (totalPlayers: number, id: number, text: string, gameType: string) => {
  if (totalPlayers === 2) {
    return text.length >= 2 ? RFPercentage(7) : RFPercentage(11)
  }
  else if (totalPlayers === 3) {
    if (id === 3) {
      return text.length >= 2 ? RFPercentage(7) : RFPercentage(8.5)
    }
    else {
      return deviceType === 1 ? RFPercentage(7) : RFPercentage(8.5)
    }
  }
  else {
    return text.length >= 2 ? RFPercentage(6) : RFPercentage(7)
  }
}


export function taxLineHeight(componentHeight: number, playerID: number, totalPlayers: number, gameType: string) {
  if (deviceType === 2) {
    if (totalPlayers === 3) {
      return gameType === 'oathbreaker' ? componentHeight : componentHeight * 1.2
    } else {
      return gameType === 'oathbreaker' ? componentHeight * .8 : componentHeight * 1.1
    }
  }
  if (width >= 600 && width < 900) {
    return componentHeight * .9
  }
  else {
    if (gameType === 'commander') {
      return totalPlayers === 4 ? componentHeight * 1.2 : totalPlayers === 3 ? componentHeight * 1.2 : componentHeight * 1.12
    } else {
      return totalPlayers === 4 ? componentHeight * 1 : totalPlayers === 3 ? componentHeight * 1 : componentHeight *.8
    }
  }
}
