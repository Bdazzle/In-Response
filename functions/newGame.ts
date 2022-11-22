import { GlobalPlayerData } from "../index"
import { startingColors } from "../constants/Colors"

interface GameData {
  totalPlayers: number,
  startingLife: number,
  savedScreenNames?: [string, string | null]
  // existingPlayers?: GlobalPlayerData
}

const newGameData = ({ totalPlayers, startingLife, savedScreenNames }: GameData): GlobalPlayerData => {
  const playersArr = [...Array(totalPlayers).keys()].map(x => x + 1)

  const playersObj = playersArr.reduce((acc, curr: number | string, i: number) => {
    /*
    cdamage creates an object out of an array of totalPlayers/all playerIDs, 
    filters out the current player, and makes a [playerID] : {} out of the remaining players.
    */
    const cdamage = playersArr.filter((n) => n !== curr).reduce((o, key) => ({ ...o, [key]: 0 }), {})

    // let test = ''
    // const playerName = async () => {
    //   try {
    //     return await AsyncStorage.getItem('1')
    //     // console.log('curr',curr)
    //     // const savedName = await AsyncStorage.getItem('1')
    //     // console.log(`saved name ${curr}`, savedName)
    //     // console.log(savedName)
    //     // // test = savedName as string
    //     // return savedName
    //   }
    //   catch (e) {
    //     console.log(`error loading player name`, e)
    //   }
    // }
    // let test = playerName()

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