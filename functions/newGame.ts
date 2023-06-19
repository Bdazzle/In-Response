import { GlobalPlayerData } from "../index"
import { startingColors } from "../constants/Colors"

const newGameData = (totalPlayers: number, startingLife: number,): GlobalPlayerData => {
  const playersArr = [...Array(totalPlayers).keys()].map(x => x + 1)
  /* 
  load saved data when user creates a new game
  */

  const playersObj = playersArr.reduce((acc, curr: number | string, i: number) => {
    
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

  return playersObj
}

export default newGameData