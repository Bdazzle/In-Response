import { GlobalPlayerData, StoredData } from "../index"
import { startingColors } from "../constants/Colors"

// savedData: StoredData
const newGameData = (totalPlayers: number, startingLife: number, ): GlobalPlayerData => {
  const playersArr = [...Array(totalPlayers).keys()].map(x => x + 1)
  /* 
  load saved data when user creates a new game
  */
  // const savedScreenNames = savedData.filter(i => i[0].includes('screenName'))
  // const savedColors = savedData.filter(i => i[0].includes('colors'))

  const playersObj = playersArr.reduce((acc, curr: number | string, i: number) => {
    /*
    cdamage creates an object out of an array of totalPlayers/all playerIDs, 
    filters out the current player, and makes a [playerID] : {} out of the remaining players.
    */
    const cdamage = playersArr.filter((n) => n !== curr).reduce((o, key) => ({ ...o, [key]: 0 }), {})
    
    return {
      ...acc, [curr]: {
        // colors: savedColors[i] && savedColors[i][0] === `${i + 1} colors` && savedColors[i][1] !== null ? JSON.parse(savedColors[i][1]) : startingColors[i],
        // screenName: savedScreenNames[i] && savedScreenNames[i][0] === `${i + 1} screenName` && savedScreenNames[i][1] !== null ? savedScreenNames[i][1] : `Player ${i + 1}`,
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