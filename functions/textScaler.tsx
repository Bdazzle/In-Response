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

export function cdmgLineHeight(deviceType: string, dimension: { width: number, height: number }, totalPlayers: number, damage: number) {
  if (deviceType === 'tablet') {
    if(damage < 10){
      return totalPlayers === 4 ? dimension.height * 1.25 : totalPlayers === 3 ? dimension.height * 1.25 : dimension.height * 1.2
    } else if(damage >=10 && damage < 20) {
      return totalPlayers === 4 ? dimension.height * 1.1 : totalPlayers === 3 ? dimension.height * 1.15  : dimension.height 
    } else {
       return totalPlayers === 4 ? dimension.height : totalPlayers === 3 ? dimension.height : dimension.height
    }
  }
  if (width >= 600 && width < 900) {
    // return totalPlayers === 4 ? dimension.height * .7 : totalPlayers === 3 ? dimension.height * .9 : dimension.height * .9
    return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * .8
  }
  if (deviceType === 'phone') {
    if(dimension.height < dimension.width){ 
      /* wide containers*/
      if(damage < 10) {
        return totalPlayers === 4 ? dimension.height * 1.3 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * 1.1
        } else if(damage >=10 && damage < 20) {
          return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * .8
        } else {
          return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * .8
        }
    } else {
      /* tall containers*/
      if(damage < 10) {
        return totalPlayers === 4 ? dimension.height * 1.3 : totalPlayers === 3 ? dimension.height * 1.1 : dimension.height * 1.1
        } else if (damage >=10 && damage < 20) {
          return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * .9: dimension.height * .8
        } else {
          return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * .8 : dimension.height * .8
        }
    }
  }
}

export function cdmgScaler(deviceType: string, dimension: { width: number, height: number }, totalPlayers: number, damage: number) {
  if (deviceType === 'tablet') {
    if(damage < 10){
      return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * 1.2
    } else if(damage >=10 && damage < 20) {
      return totalPlayers === 4 ? dimension.height  : totalPlayers === 3 ? dimension.height * 1.1 : dimension.height * .8
    } else {
      return totalPlayers === 4 ? dimension.height * .9 : totalPlayers === 3 ? dimension.height * .9 : dimension.height * .75
    }
   
  }
  if (width >= 600 && width < 900) {
    // return totalPlayers === 4 ? dimension.height * .7 : totalPlayers === 3 ? dimension.height * .9 : dimension.height * .9
    return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height : dimension.height * .7
  }
  if (deviceType === 'phone') {
    if(dimension.height < dimension.width){ 
      /* wide containers*/
      if(damage < 10){
        return totalPlayers === 4 ? dimension.height * 1.3  : totalPlayers === 3 ? dimension.height * 1.3 : dimension.height * 1.1
      } else if(damage >=10 && damage < 20) {
        return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.height * 1.3 : dimension.height * .7
      } else {
        return totalPlayers === 4 ? dimension.height * 1.1 : totalPlayers === 3 ? dimension.height * 1.3 : dimension.height * .7
      }
    } else {
      /* tall containers*/
      if(damage < 10){
        return totalPlayers === 4 ? dimension.height * 1.3  : totalPlayers === 3 ? dimension.width * 1.2 : dimension.height
      } else if(damage >=10 && damage < 20) {
        return totalPlayers === 4 ? dimension.height * 1.2 : totalPlayers === 3 ? dimension.width * .99 : dimension.width * .98
      } else {
        return totalPlayers === 4 ? dimension.height * 1.1 : totalPlayers === 3 ? dimension.width * .87 : dimension.width * .86
      }
    }
  }
}

export function taxLineHeight( deviceType: string, componentHeight : number, playerID : number, totalPlayers : number, gameType: string) {
  if (deviceType === 'tablet') {
    if(totalPlayers === 3 && playerID === 3){
      return gameType === 'oathbreaker' ? componentHeight * .9 : componentHeight * 1.2 
    } else if(totalPlayers === 3 && playerID !== 3){
      return gameType === 'oathbreaker' ? componentHeight * .9 : componentHeight * 1.2 
    } else {
      return componentHeight 
    }
  }
  if (width >= 600 && width < 900) {
    return componentHeight * .9
  }
  if (deviceType === 'phone') {
    if(gameType === 'commander'){
      return totalPlayers === 4 ? componentHeight * 1.2 : totalPlayers === 3 ? componentHeight * 1.2 : componentHeight
    } else {
      return totalPlayers === 4 ? componentHeight *.95 : totalPlayers === 3 ? componentHeight *.91 : componentHeight
    }
  }
}

export function taxScaler(deviceType: string, dimension: { height: number, width: number } , totalPlayers: number, taxTotal: number, gameType: string) {
  if (deviceType === 'phone') {
    /* 
    width check for devices that are rectangular (like phones) for player 3 during 3 player games,
    which has dimensions different from other players. 
    Checks parent dimensions.
    Cases where height < width, calculate based on height (ex: totalplayers ===3, players 1 and 2).
    Cases where width > height, calculate based on width (ex: totalplayers === 3, player 3)
    */
   if(dimension.height < dimension.width  &&  dimension.width - dimension.height > 10){
    /*wide containers,Calculations based on height. calcs for players 1 and 2 for 3 player?*/
      if (gameType === 'oathbreaker') {
        if (taxTotal < 10) {
          return totalPlayers === 4 ? dimension.height : totalPlayers === 3 ? dimension.height *.9 : dimension.height * .7
        } else if (taxTotal >= 10 && taxTotal < 20) {
          return dimension.height * .95
        } else {
          return dimension.height * .825
        }
      }
      else {
        if (taxTotal < 10) {
          return totalPlayers === 4 ? dimension.height * 1.3 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.height * .9
        } else if (taxTotal >= 10 && taxTotal < 20) {
          return dimension.height * 1.2
        } else {
          return dimension.height * 1.2
        }
      }
   } 
   /*tall containers, calculations based on width, height > width*/
   else {
      if (gameType === 'oathbreaker') {
        if (taxTotal < 10) {
          return totalPlayers === 4 ? dimension.width * .9 : totalPlayers === 3 ? dimension.height : dimension.width * 1.5
        } else if (taxTotal >= 10 && taxTotal < 20) {
          return dimension.width * .95
        } else {
          return dimension.width * .83
        }
      }
      else {
        if (taxTotal < 10) {
          return totalPlayers === 4 ? dimension.width * .9 : totalPlayers === 3 ? dimension.height * 1.2 : dimension.width * 1.4
        } else if (taxTotal >= 10 && taxTotal < 20) {
          return dimension.width * .85
        } else {
          return dimension.width * .77
        }
      }
   }
    
  }
  /* 
  check for tablets, which uses width because square
  */
  if (deviceType === 'tablet') {
    if (gameType === 'oathbreaker') {
      if (taxTotal < 10) {
        return totalPlayers === 4 ? dimension.width * 1.3 : totalPlayers === 3 ? dimension.height *.9 : dimension.width * 1.5
      } else if (taxTotal >= 10 && taxTotal < 20) {
        return dimension.width * .92
      } else {
        return dimension.width * .8
      }
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