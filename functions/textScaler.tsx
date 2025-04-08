import { deviceType } from 'expo-device';
import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

/*
deviceType codes:
0 = "UNKNOWN"
1 = "PHONE"
2 = "TABLET"
3 = "DESKTOP"
4 = "TV"
*/

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

export function RFPercentage(percent: number): number {
  // const { height, width } = Dimensions.get("window");
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
  // let minFont = !minSize ? 16 : deviceType === 2 ? minSize * 1.3 : minSize
  // let maxFont = !maxSize ? 36 : deviceType === 2 ? maxSize * 1.4 : maxSize;
  let minFont = !minSize ? 16 : minSize
  // let maxFont = !maxSize ? 36 : maxSize;
  let maxFont = !maxSize ? 36 : deviceType === 2 ? maxSize * 1.1 : maxSize;

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
}

export const lifeTextScaler = (totalPlayers: number, playerID: number, lifeTotal: number, dimensions: { width: number, height: number }) => {
  let textSize = 180;
  if (deviceType === 1) {//phone
    if (totalPlayers === 2) {
      textSize = textScaler(lifeTotal, dimensions, dimensions.width / 2, dimensions.width / 2)
    } else if (totalPlayers === 3) {
      if (playerID !== 3) {
        textSize = textScaler(lifeTotal, dimensions, dimensions.width / 3, dimensions.width / 3.5)
      } else {
        textSize = textScaler(lifeTotal, dimensions, dimensions.width / 2.5, dimensions.width / 2)
      }
    }
    if (totalPlayers === 4) {
      textSize = textScaler(lifeTotal, dimensions, dimensions.width / 2.75, dimensions.width / 2)
    }
  } else {//all others
    if (totalPlayers === 2) {
      textSize = textScaler(lifeTotal, dimensions, dimensions.width / 2, dimensions.width / 2)
    } else if (totalPlayers === 3) {
      if (playerID !== 3) {
        textSize = textScaler(lifeTotal, dimensions, dimensions.width / 3, dimensions.width / 3.5)
      } else {
        textSize = textScaler(lifeTotal, dimensions, dimensions.width / 3, dimensions.width / 2)
      }
    }
    if (totalPlayers === 4) {
      textSize = textScaler(lifeTotal, dimensions, dimensions.width / 2.75, dimensions.width / 2)
    }
  }
  return textSize
}

export const cNameScaler = (name: string) => {
  //as name length goes up, font size goes down (proportionally)
  //happens to be 1 to 1 ratio in this instance
  const minLength = 8;
  const startingFont = deviceType === 1 ? 30 : 60;

  const diff = (name.length - minLength)
  const fontSize = startingFont - diff

  return name.length <= minLength ? startingFont : fontSize
}

/* 
acts a little off on long phones (width * 2 < height)
*/
export const cdmgScaler = (dmgtotal: number, totalPlayers: number, playerID: number, isPressed: boolean): number => {

  let fontSize: number;

  switch (totalPlayers) {
    case 2: {
      if (deviceType === 1) {//phone
        fontSize = dmgtotal < 10 ? RFPercentage(9.5) : RFPercentage(8.5)
        return isPressed && dmgtotal >= 10 ? fontSize * .9 : fontSize
      }
      else {
        fontSize = RFPercentage(8.5)
      }
      return fontSize
    };

    case 3: {
      if (playerID === 3) {
        if (deviceType === 1) {//phone
          fontSize = dmgtotal < 10 ? RFPercentage(8.75) : RFPercentage(8.5)
        }
        else {
          fontSize = RFPercentage(8.5)
        }
      }
      else {
        if (deviceType === 1) {//phone
          fontSize = RFPercentage(6.4)
        }
        else {
          fontSize = RFPercentage(8)
        }
      }
      return fontSize
    };

    case 4: {
      if (deviceType === 1) {//phone
        fontSize = RFPercentage(5.5)
      }
      else {
        fontSize = RFPercentage(7)
      }
      return fontSize
    }

    default: {
      return 16
    }
  }
}


export function cdmgLineHeight(dimension: { width: number, height: number }, totalPlayers: number, damage: number) {
  //tablet
  if (deviceType === 2) {
    return dimension.height * 1.05
  }
  if (width >= 600 && width < 900) {
    return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * .8
  }
  //phone
  if (deviceType === 1) {
    if (dimension.height < dimension.width) {
      /* wide containers, which seems to be all containers on my phone, samsung s22*/
      if (damage < 10) {
        return totalPlayers === 2 ? dimension.height * 1.05 : dimension.height * 1.08
      }
      else {
        return totalPlayers === 4 ? dimension.height * 1.08 : totalPlayers === 3 ? dimension.height * 1.08 : dimension.height * 1.05
      }
    } else {
      /* tall containers*/
      if (damage < 10) {
        return totalPlayers === 4 ? dimension.height * 1.3 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * 1.1
      }
      else {
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
      /*acts weird on long phones*/
      if (width * 2 < height) {
        return deviceType === 1 ? RFPercentage(6.5) : RFPercentage(8.5)
      }
      else {
        return deviceType === 1 ? RFPercentage(7) : RFPercentage(8.5)
      }
    }
  }
  else {
    return text.length >= 2 ? RFPercentage(6) : RFPercentage(7)
  }
}

/*removed arg playerID: number, */
export function taxLineHeight(componentHeight: number, totalPlayers: number, gameType: string) {
  if (deviceType === 2) {
    if (totalPlayers === 3) {
      return gameType === 'oathbreaker' ? componentHeight : componentHeight * 1.2
    } else {
      return gameType === 'oathbreaker' ? componentHeight * .8 : componentHeight * 1.2
    }
  }
  if (width >= 600 && width < 900) {
    return componentHeight * .9
  }
  else {
    if (gameType === 'commander') {
      return totalPlayers === 4 ? componentHeight * 1.2 : totalPlayers === 3 ? componentHeight * 1.2 : componentHeight * 1.12
    } else {
      return totalPlayers === 4 ? componentHeight * 1 : totalPlayers === 3 ? componentHeight * 1 : componentHeight * .8
    }
  }
}

export const counterTextScaler = (totalPlayers: number, playerID: number, counterTotal: number | undefined,
  containerDimensions: { width: number, height: number }
) => {
  if (counterTotal) {
    let maxSize;

    if( deviceType === 1) {
      maxSize = totalPlayers === 4 ? containerDimensions.height / 1.4 :
      totalPlayers === 3 && playerID !== 3 ? containerDimensions.height / 1.35 :
        containerDimensions.height / 1.25
    }
    else {
      maxSize = totalPlayers === 4 ? containerDimensions.height / 1.4 :
      totalPlayers === 3 && playerID !== 3 ? containerDimensions.height / 1.4 :
        containerDimensions.height / 1.4
    }

    return textScaler(
      String(counterTotal).length,
      containerDimensions,
      maxSize, 18
    )
  }
}