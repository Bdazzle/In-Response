import { GlobalPlayerData } from "../index"
import { startingColors } from "../constants/Colors"

const newGameData = (totalPlayers: number, startingLife: number, currPlayers?: GlobalPlayerData): GlobalPlayerData => {
  const playersArr = [...Array(totalPlayers).keys()].map(x => x + 1)
  let playersObj;
  /* 
  load saved data when user creates a new game
  */
 /*
 Adding players:
 if current players, get difference in array, use current players to beginning of object,
 then add new blank players to end of it. 
 */
  if(currPlayers && totalPlayers > Object.keys(currPlayers).length) {
      const playerDiff = playersArr.slice(Object.keys(currPlayers).length, playersArr.length)
      const newPlayersObj = playerDiff.reduce((acc, curr: number | string) => {
        /*
        cdamage creates an object out of an array of totalPlayers/all playerIDs, 
        filters out the current player, and makes a [playerID] : {} out of the remaining players.
        */
        const cdamage = playerDiff.filter((n) => n !== curr).reduce((o, key) => ({ ...o, [key]: 0 }), {})
        
        return {
          ...acc, [curr]: {
            colors: startingColors[Number(curr) - 1],
            screenName: `Player ${Number(curr)}`,
            counterData: {},
            lifeTotal: startingLife,
            commander_damage: cdamage,
            commander_tax: 0
          }
        }
      }, {} as GlobalPlayerData)
  
      playersObj = {...currPlayers, ...newPlayersObj}
  }
  else {
    playersObj = playersArr.reduce((acc, curr: number | string, i: number) => {
      /*
      cdamage creates an object out of an array of totalPlayers/all playerIDs, 
      filters out the current player, and makes a [playerID] : {} out of the remaining players.
      */
      const cdamage = playersArr.filter((n) => n !== curr).reduce((o, key) => ({ ...o, [key]: 0 }), {})
  
      return {
        ...acc, [curr]: {
          colors: startingColors[i],
          screenName: `Player ${i + 1}`,
          counterData: {},
          lifeTotal: startingLife,
          commander_damage: cdamage,
          commander_tax: 0
        }
      }
    }, {} as GlobalPlayerData)
  }

  return playersObj
}

export default newGameData