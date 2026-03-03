import { deviceType } from 'expo-device';
import { Dimensions, PixelRatio, Platform } from 'react-native';

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
  const heightPercent = (percent * standardLength) / 111
  //Obsolete with edge-to-edge Android update?
  // const offset: number = width > height ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight!; // iPhone X style SafeAreaView size in portrait
  // const deviceHeight = Platform.OS === "android" ? standardLength - offset : standardLength;
  // const heightPercent = (percent * deviceHeight) / 100;

  return Math.round(heightPercent);
}


// export function textScaler(textLength: number,
//   parentDimensions: { width: number, height: number },
//   maxSize?: number,
//   minSize?: number): number {
//   // Calculate ideal font size based on width and text length
//   const idealFontSizeHeight = parentDimensions.height / (textLength); // Add 1 for line spacing
//   const idealFontSizeWidth: number = parentDimensions.width / textLength;
//   // check if device is tablet, 2, or phone, default
//   // let minFont = !minSize ? 16 : deviceType === 2 ? minSize * 1.3 : minSize
//   // let maxFont = !maxSize ? 36 : deviceType === 2 ? maxSize * 1.4 : maxSize;
//   let minFont = !minSize ? 16 : minSize
//   // let maxFont = !maxSize ? 36 : maxSize;
//   let maxFont = !maxSize ? 36 : deviceType === 2 ? maxSize * 1.1 : maxSize;

//   // Clamp font size within allowed range
//   let bestFitFontSize = Math.min(
//     Math.max(minFont, idealFontSizeHeight),
//     Math.max(minFont, idealFontSizeWidth)
//   );

//   // Check for overflow and adjust font size
//   // bestFitFontSize * textLength > parentDimensions.width || 
//   while (bestFitFontSize > parentDimensions.height || bestFitFontSize > maxFont) {
//     bestFitFontSize--;
//   }

//   return Math.round(bestFitFontSize);
// }

/**
 * Given a string (or its length) and the dimensions of
 * the parent container, return the largest font size that will allow the text
 * to fit without overflowing either the container's width or height.  The
 * algorithm assumes an average character width proportional to the font size
 * (charWidthFactor) and treats the entire container height as
 * available for a single line of text.
 * @param textOrLength either the string itself or its length (number of
 *   characters)
 * @param parentDimensions dimensions of the view that will contain the text
 * @param options optional configuration:
 *   - maxSize: upper bound on returned font size (default 100)
 *   - minSize: lower bound on returned font size (default 4)
 *   - charWidthFactor: average character width / fontSize ratio (default 0.55)
 */
export function fitFontToContainer(
  textOrLength: string | number,
  parentDimensions: { width: number; height: number },
  options?: {
    maxSize?: number;
    minSize?: number;
    charWidthFactor?: number;
  }
): number {
  const length = typeof textOrLength === 'number' ? textOrLength : textOrLength.length;
  const maxSize = deviceType === 1 ? (options?.maxSize ?? 36) : ((options?.maxSize ?? 36) * 1.5);
  const minSize = options?.minSize ?? 4;
  //average character width relative to font size. Beleren font may be abnormally spaced (0.7?).
  const charFactor = options?.charWidthFactor ?? 0.55;

  // estimate the maximum font size allowed by width and by height
  const widthLimited = parentDimensions.width / (length * charFactor);
  const heightLimited = parentDimensions.height; // assume one line

  let best = Math.min(widthLimited, heightLimited, maxSize);
  if (best < minSize) best = minSize;
  return Math.round(best);
}

export const lifeTextScaler = (totalPlayers: number, playerID: number, lifeTotal: number, dimensions: { width: number, height: number }) => {
  let textSize = 180;
  if (deviceType === 1) {//phone
    if (totalPlayers === 2) {
        textSize = fitFontToContainer(String(lifeTotal).length, dimensions, { maxSize: dimensions.width / 2, minSize: dimensions.width / 2 })
    } else if (totalPlayers === 3) {
      if (playerID !== 3) {
        textSize = fitFontToContainer(String(lifeTotal).length, { ...dimensions, width: dimensions.width / 4 }, { maxSize: dimensions.width / 4, minSize: dimensions.width / 4 })
      } else {
        textSize = fitFontToContainer(String(lifeTotal).length, { ...dimensions, width: dimensions.width / 2.5 }, { maxSize: dimensions.width / 2, minSize: dimensions.width / 2.5 })
      }
    }
    if (totalPlayers === 4) {
      textSize = fitFontToContainer(String(lifeTotal).length, { ...dimensions, width: dimensions.width / 3 }, { maxSize: dimensions.width / 2, minSize: dimensions.width / 3 })
    }
  } else {//all others
    if (totalPlayers === 2) {
      textSize = fitFontToContainer(String(lifeTotal).length, { ...dimensions, width: dimensions.width / 2 }, { maxSize: dimensions.width / 2, minSize: dimensions.width / 2 })
    } else if (totalPlayers === 3) {
      if (playerID !== 3) {
        textSize = fitFontToContainer(String(lifeTotal).length, { ...dimensions, width: dimensions.width / 3 }, { maxSize: dimensions.width / 3.5, minSize: dimensions.width / 3 })
      } else {
        textSize = fitFontToContainer(String(lifeTotal).length, { ...dimensions, width: dimensions.width / 3 }, { maxSize: dimensions.width / 2, minSize: dimensions.width / 3 })
      }
    }
    if (totalPlayers === 4) {
      textSize = fitFontToContainer(String(lifeTotal).length, { ...dimensions, width: dimensions.width / 2.75 }, { maxSize: dimensions.width / 2, minSize: dimensions.width / 2.75 })
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
        // return totalPlayers === 2 ? dimension.height * 1.05 : dimension.height * 1.08
        return totalPlayers === 2 ? dimension.height * 1.05 : dimension.height
      }
      else {
        return totalPlayers === 4 ? dimension.height * 1.05 : totalPlayers === 3 ? dimension.height * 1.08 : dimension.height * 1.05
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


export const handleTaxSize = (totalPlayers: number, id: number, text: number, dimension: { width: number, height: number }, gameType?: string) => {
  if (totalPlayers === 2) {
    if (text < 10) {
      return fitFontToContainer(String(text).length, dimension, { maxSize: dimension.width * 1.2, minSize: dimension.height })
    } else {
      return fitFontToContainer(String(text).length, dimension, { maxSize: dimension.width * .75})
    }
  }
  else if (totalPlayers === 3) {
    if (id === 3) {
      if (text < 10) {
        return fitFontToContainer(String(text).length, dimension, { maxSize: dimension.height})
      }
      else {
        return fitFontToContainer(String(text).length, dimension, { maxSize: dimension.height * .8, minSize: dimension.height * .8 })
      }
    }
    else {
      if (gameType === "oathbreaker") {
        return fitFontToContainer(String(text).length, dimension, { maxSize: dimension.height + 5})
      } else {
        return fitFontToContainer(String(text).length, dimension, { maxSize: dimension.height + 10 })
      }
    }
  }
  else {
    if (gameType === "oathbreaker") {
     return fitFontToContainer(String(text).length, dimension) + 5
    } else {
      return fitFontToContainer(String(text).length, dimension) + 10
    }

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

    if (deviceType === 1) {
      maxSize = totalPlayers === 4 ? containerDimensions.height / 1.4 :
        totalPlayers === 3 && playerID !== 3 ? containerDimensions.height / 1.35 :
          containerDimensions.height / 1.25
    }
    else {
      maxSize = totalPlayers === 4 ? containerDimensions.height / 1.4 :
        totalPlayers === 3 && playerID !== 3 ? containerDimensions.height / 1.4 :
          containerDimensions.height / 1.4
    }
    return fitFontToContainer(String(counterTotal).length, containerDimensions, { maxSize: maxSize, minSize: 18})
  }
}
