import React, { createContext, useContext, useEffect, useReducer, useState } from "react"
import { GlobalPlayerData, PlanarData } from "."
import globalPlayerReducer, { GlobalPlayerAction } from "./reducers/globalPlayerReducer";
import generatePlanarDeck from "./functions/planarDeck";
import { OptionsContext, OptionsContextProps } from "./OptionsContext";
import newGameData from "./functions/newGame";

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
  setReset : React.Dispatch<React.SetStateAction<boolean>>
}

export const GameContext = createContext({} as GameContextProps)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalPlayers, startingLife } = useContext(OptionsContext) as OptionsContextProps
  const [currentMonarch, setCurrentMonarch] = useState<string>()
  const [currentInitiative, setCurrentInitiative] = useState<string>()
  const [globalPlayerData, dispatchGlobalPlayerData] = useReducer<(state: GlobalPlayerData, action: GlobalPlayerAction) => any>(globalPlayerReducer, {})
  const [planarData, setPlanarData] = useState<PlanarData>({ currentPlane: '', deck: [], discard: [] })
  const [reset, setReset] = useState<boolean>(false)
  
  /*
    if any life total is different than starting life total,
    that means a game is in progress, and life totals should not change for adding an additional player.
    */
  useEffect(() => {

    const playerLifeTotals = Object.keys(globalPlayerData).map(player => globalPlayerData[player].lifeTotal)

    if(!playerLifeTotals.every(val => val === startingLife)) {
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

    const newPlanarDeck = generatePlanarDeck(totalPlayers)
    setPlanarData({
      currentPlane: newPlanarDeck[0],
      deck: newPlanarDeck,
      discard: []
    })

  }, [totalPlayers])
  // console.log(globalPlayerData)
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
    currentMonarch: currentMonarch,
    setCurrentMonarch: setCurrentMonarch,
    currentInitiative: currentInitiative,
    setCurrentInitiative: setCurrentInitiative,
    globalPlayerData: globalPlayerData as GlobalPlayerData,
    dispatchGlobalPlayerData: dispatchGlobalPlayerData,
    planarData: planarData,
    setPlanarData: setPlanarData,
    reset: reset,
    setReset: setReset
  }}>{children}</GameContext.Provider>
}