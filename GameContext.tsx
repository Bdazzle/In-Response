import React, { useEffect, useReducer, useState } from "react"
import { GlobalPlayerData, PlanarData } from "."
import { startingColors } from "./constants/Colors";
import globalPlayerReducer, { GlobalPlayerAction } from "./reducers/globalPlayerReducer";
import generatePlanarDeck from "./functions/planarDeck";

export interface GameContextProps {
  currentMonarch: string | undefined;
  setCurrentMonarch: React.Dispatch<React.SetStateAction<string | undefined>>,
  currentInitiative: string | undefined,
  setCurrentInitiative: React.Dispatch<React.SetStateAction<string | undefined>>,
  totalPlayers: number,
  setTotalPlayers: React.Dispatch<React.SetStateAction<number>>,
  startingLife: number,
  setStartingLife: React.Dispatch<React.SetStateAction<number>>,
  globalPlayerData: GlobalPlayerData,
  dispatchGlobalPlayerData: React.Dispatch<GlobalPlayerAction>
  gameType: string,
  setGameType: React.Dispatch<React.SetStateAction<string>>,
  planarData: PlanarData,
  setPlanarData: React.Dispatch<React.SetStateAction<PlanarData>>,
}

export const GameContext = React.createContext<GameContextProps | null>(null)

/*
TO DO
*)build command for apk: eas build -p android --profile preview
*) close buttons weird and slow?
*/

/*
Dungeon data tracked in globalPlayerData to pass to Dungeon Screen, since only 1 screen
*/
export const GameProvider: React.FC = ({ children }) => {
  const [gameType, setGameType] = useState<string>('normal')
  const [currentMonarch, setCurrentMonarch] = useState<string>()
  const [currentInitiative, setCurrentInitiative] = useState<string>()
  const [totalPlayers, setTotalPlayers] = useState<number>(2)
  const [startingLife, setStartingLife] = useState<number>(20)
  const [globalPlayerData, dispatchGlobalPlayerData] = useReducer<(state: GlobalPlayerData, action: GlobalPlayerAction) => any>(globalPlayerReducer, {})
  const [planarData, setPlanarData] = useState<PlanarData>({ currentPlane: '', deck: [], discard: [] })

  /*
  set initial player states for dungeon tracking (to pass to Dungeon screen)
  */
  useEffect(() => {
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
          screenName: `Player ${i + 1}`,
          counterData: {},
          lifeTotal: startingLife,
          commander_damage: cdamage
          // dungeonCompleted : true
        }
      }
    }, {} as GlobalPlayerData)

    dispatchGlobalPlayerData({
      field: 'init',
      value: playersObj as GlobalPlayerData,
      playerID: 0
    })

    const newPlanarDeck = generatePlanarDeck(totalPlayers)
    setPlanarData({
      currentPlane: newPlanarDeck[0],
      deck: newPlanarDeck,
      discard: []
    })

  }, [totalPlayers])

  return <GameContext.Provider value={{
    currentMonarch: currentMonarch,
    setCurrentMonarch: setCurrentMonarch,
    currentInitiative: currentInitiative,
    setCurrentInitiative: setCurrentInitiative,
    totalPlayers: totalPlayers,
    setTotalPlayers: setTotalPlayers,
    startingLife: startingLife,
    setStartingLife: setStartingLife,
    globalPlayerData: globalPlayerData as GlobalPlayerData,
    dispatchGlobalPlayerData: dispatchGlobalPlayerData,
    gameType: gameType,
    setGameType: setGameType,
    planarData: planarData,
    setPlanarData: setPlanarData
  }}>{children}</GameContext.Provider>
}