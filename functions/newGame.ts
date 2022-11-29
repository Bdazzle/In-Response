import { GlobalPlayerData } from "../index"
import { startingColors } from "../constants/Colors"

interface GameData {
  totalPlayers: number,
  startingLife: number,
  savedScreenNames?: [string, string | null]
}

const newGameData = ({ totalPlayers, startingLife, savedScreenNames }: GameData): GlobalPlayerData => {
  const playersArr = [...Array(totalPlayers).keys()].map(x => x + 1)

  const playersObj = playersArr.reduce((acc, curr: number | string, i: number) => {
    /*
    cdamage creates an object out of an array of totalPlayers/all playerIDs, 
    filters out the current player, and makes a [playerID] : {} out of the remaining players.
    */
    const cdamage = playersArr.filter((n) => n !== curr).reduce((o, key) => ({ ...o, [key]: 0 }), {})

    return {
      ...acc, [curr]: {
        colors: startingColors[i],
        // screenName: playerName() !== undefined ? playerName() : `Player ${i + 1}`,
        screenName: `Player ${i + 1}`,
        counterData: {},
        lifeTotal: startingLife,
        commander_damage: cdamage
      }
    }
  }, {} as GlobalPlayerData)

  return playersObj
}

export default newGameData