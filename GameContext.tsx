import React, { createContext, useContext, useEffect, useReducer, useState } from "react"
import { GlobalPlayerData, PlanarData } from "."
import globalPlayerReducer, { GlobalPlayerAction } from "./reducers/globalPlayerReducer";
import { OptionsContext, OptionsContextProps } from "./OptionsContext";
import newGameData from "./functions/newGame";
import { ImageSourcePropType } from "react-native";

export interface GameContextProps {
  currentMonarch: string | undefined;
  setCurrentMonarch: React.Dispatch<React.SetStateAction<string | undefined>>,
  currentInitiative: string | undefined,
  setCurrentInitiative: React.Dispatch<React.SetStateAction<string | undefined>>,
  globalPlayerData: GlobalPlayerData,
  dispatchGlobalPlayerData: React.Dispatch<GlobalPlayerAction>
  planarData: PlanarData,
  setPlanarData: React.Dispatch<React.SetStateAction<PlanarData>>,
  reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
}

export const GameContext = createContext({} as GameContextProps)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalPlayers, startingLife } = useContext<OptionsContextProps>(OptionsContext)
  const [currentMonarch, setCurrentMonarch] = useState<string>()
  const [currentInitiative, setCurrentInitiative] = useState<string>()
  const [globalPlayerData, dispatchGlobalPlayerData] = useReducer<(state: GlobalPlayerData, action: GlobalPlayerAction) => any>(globalPlayerReducer, {})
  const [planarData, setPlanarData] = useState<PlanarData>({ 
    currentPlane: ['', '' as ImageSourcePropType], 
    deck: [], 
    discard: [], 
  })
  const [reset, setReset] = useState<boolean>(false)

  /*
    if any life total is different than starting life total,
    that means a game is in progress, and life totals should not change for adding an additional player.
    */
  useEffect(() => {

    const playerLifeTotals = Object.keys(globalPlayerData).map(player => globalPlayerData[player].lifeTotal)

    if (!playerLifeTotals.every(val => val === startingLife)) {
      dispatchGlobalPlayerData({
        field: 'init',
        value: newGameData(totalPlayers, startingLife, globalPlayerData),
        playerID: 0
      })
    }
    else {
      dispatchGlobalPlayerData({
        field: 'init',
        value: newGameData(totalPlayers, startingLife),
        playerID: 0
      })
    }

  }, [totalPlayers])

  /* reset game when starting life total options change */
  useEffect(() => {
    if (Object.keys(globalPlayerData).length) {
      let playersObj = globalPlayerData
      for (let playerID in playersObj) {
        playersObj[playerID].lifeTotal = startingLife
      }

      dispatchGlobalPlayerData({
        field: 'init',
        value: playersObj as GlobalPlayerData,
        playerID: 0
      })

    }
  }, [startingLife])

  return <GameContext.Provider value={{
    currentMonarch,
    setCurrentMonarch,
    currentInitiative,
    setCurrentInitiative,
    globalPlayerData,
    dispatchGlobalPlayerData,
    planarData,
    setPlanarData,
    reset,
    setReset
  }}>
    {children}
  </GameContext.Provider>
}