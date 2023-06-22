import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width } = Dimensions.get('window');


//width 600 is largest phone width?
//900 = test tablet width
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

export function counterScaler(deviceType: string, totalCountersTypes: number) {
  if (totalCountersTypes === 1) {
    return deviceType === 'tablet' ? textScaler(40) : textScaler(60)
  } else if (totalCountersTypes === 2) {
    return deviceType === 'tablet' ? textScaler(35) : textScaler(60)
  } else if (totalCountersTypes === 3) {
    return deviceType === 'tablet' ? textScaler(35) : textScaler(60)
  } else if (totalCountersTypes === 4) {
    return deviceType === 'tablet' ? textScaler(32) : textScaler(60)
  } else {
    return deviceType === 'tablet' ? textScaler(25) : textScaler(35)
  }
}

export function cdmgLineHeight(deviceType: string, componentHeight: number, totalPlayers: number) {
  if (deviceType === 'tablet') {
    return totalPlayers === 4 ? componentHeight * .75 : totalPlayers === 3 ? componentHeight * .9 : componentHeight * .7
  }
  if (width >= 600 && width < 900) {
    return totalPlayers === 4 ? componentHeight * .7 : totalPlayers === 3 ? componentHeight * .9 : componentHeight * .9
  }
  if (deviceType === 'phone') {
    return totalPlayers === 4 ? componentHeight * .8 : totalPlayers === 3 ? componentHeight : componentHeight * .8
  }
}

export function cdmgScaler(deviceType: string, componentHeight: number, totalPlayers: number) {
  if (deviceType === 'tablet') {
    return totalPlayers === 4 ? componentHeight * .8 : totalPlayers === 3 ? componentHeight * .9 : componentHeight * .7
  }
  if (width >= 600 && width < 900) {
    return totalPlayers === 4 ? componentHeight * .7 : totalPlayers === 3 ? componentHeight * .9 : componentHeight * .9
  }
  if (deviceType === 'phone') {
    return totalPlayers === 4 ? componentHeight * .85 : totalPlayers === 3 ? componentHeight : componentHeight * .8
  }
}

export function taxLineHeight( deviceType: string, componentHeight : number, playerID : number, totalPlayers : number, gameType: string) {
  if (deviceType === 'tablet') {
    return totalPlayers === 3 && playerID === 3 ? (gameType === 'oathbreaker' ? componentHeight : componentHeight * 1.1 ) : componentHeight * .9
  }
  if (width >= 600 && width < 900) {
    return componentHeight * .9
  }
  if (deviceType === 'phone') {
    return gameType === 'commander' ? componentHeight * 1.1 : componentHeight * .9
  }
}

export function taxScaler(deviceType: string, dimension: { height: number, width: number } , totalPlayers: number, taxTotal: number, gameType: string) {
  // if (width < 600) {
  //   /* 
  //   width check for devices that are rectangular (like phones) for player 3 during 3 player games,
  //   which has dimensions different from other players. 
  //   Checks parent dimensions
  //   */
  //   if (dimension.width < 60) {
  //     if (gameType === 'oathbreaker') {
  //       if (taxTotal < 10) {
  //         return totalPlayers === 4 ? dimension.width : totalPlayers === 3 ? dimension.width : dimension.height * .7
  //       } else if (taxTotal >= 10 && taxTotal < 20) {
  //         return dimension.width * .95
  //       } else {
  //         return dimension.width * .825
  //       }
  //     }
  //     else {
  //       if (taxTotal < 10) {
  //         return totalPlayers === 4 ? dimension.width * .9 : totalPlayers === 3 ? dimension.width * .9 : dimension.height * .9
  //       } else if (taxTotal >= 10 && taxTotal < 20) {
  //         return dimension.width * .85
  //       } else {
  //         return dimension.width * .75
  //       }
  //     }
  //   }

  //   else {
  //     if (taxTotal < 10) {
  //       return totalPlayers === 3 ? dimension.width * .69 : dimension.width * .8
  //     } else {
  //       return totalPlayers === 4 ? dimension.width * .9 : totalPlayers === 3 ? dimension.width * .69 : dimension.width * .8
  //     }
  //   }
  // }
  // /* 
  // check for tablets, which uses width because square
  // */
  // if (width >= 900) {
  //   if (gameType === 'oathbreaker') {
  //     return taxTotal < 10 ? dimension.width * .95 : (taxTotal >= 10 && taxTotal < 20) ? dimension.width * .9 : dimension.width * .8
  //   } else {
  //     if (taxTotal < 10) {
  //       return totalPlayers === 4 ? dimension.width : totalPlayers === 3 ? dimension.width * .8 : dimension.width
  //     } else if (taxTotal >= 10 && taxTotal < 20) {
  //       return dimension.width * .85
  //     } else {
  //       return dimension.width * .75
  //     }
  //   }
  // }
  if (deviceType === 'phone') {
    /* 
    width check for devices that are rectangular (like phones) for player 3 during 3 player games,
    which has dimensions different from other players. 
    Checks parent dimensions
    */
    if (dimension.width < 60) {
      if (gameType === 'oathbreaker') {
        if (taxTotal < 10) {
          return totalPlayers === 4 ? dimension.width : totalPlayers === 3 ? dimension.width : dimension.height * .7
        } else if (taxTotal >= 10 && taxTotal < 20) {
          return dimension.width * .95
        } else {
          return dimension.width * .825
        }
      }
      else {
        if (taxTotal < 10) {
          return totalPlayers === 4 ? dimension.width * .9 : totalPlayers === 3 ? dimension.width * .9 : dimension.height * .9
        } else if (taxTotal >= 10 && taxTotal < 20) {
          return dimension.width * .85
        } else {
          return dimension.width * .75
        }
      }
    }

    else {
      if (taxTotal < 10) {
        return totalPlayers === 3 ? dimension.width * .69 : dimension.width * .8
      } else {
        return totalPlayers === 4 ? dimension.width * .9 : totalPlayers === 3 ? dimension.width * .69 : dimension.width * .8
      }
    }
  }
  /* 
  check for tablets, which uses width because square
  */
  if (deviceType === 'tablet') {
    if (gameType === 'oathbreaker') {
      return taxTotal < 10 ? dimension.width * .95 : (taxTotal >= 10 && taxTotal < 20) ? dimension.width * .9 : dimension.width * .8
    } else {
      if (taxTotal < 10) {
        return totalPlayers === 4 ? dimension.width : totalPlayers === 3 ? dimension.width * .8 : dimension.width
      } else if (taxTotal >= 10 && taxTotal < 20) {
        return dimension.width * .85
      } else {
        return dimension.width * .75
      }
    }
  }
}