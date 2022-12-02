import React, { createContext, useContext, useEffect, useReducer, useState } from "react"
import { GlobalPlayerData, PlanarData, StoredNames } from "."
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
}

export const GameContext = createContext({} as GameContextProps)

/*
TO DO
*)build command for apk: eas build -p android --profile preview
  -eas build uses .gitignore to access files, so change access to assets files after build so it's not uploaded to github
*) Animated.View prevents any child components onPress and onLongPress from firing normally,
  Because the touch event is intercepted by the Animated API. 
  This may be fixable in the future when I know more about Animated api events.
1) 2 people can't touch screen at the same time (swipe function bug), fix that.
2) Save color schemes?
*/

/*
Dungeon data tracked in globalPlayerData to pass to Dungeon Screen, since only 1 screen
*/
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalPlayers, startingLife, savedNames } = useContext(OptionsContext) as OptionsContextProps
  const [currentMonarch, setCurrentMonarch] = useState<string>()
  const [currentInitiative, setCurrentInitiative] = useState<string>()
  const [globalPlayerData, dispatchGlobalPlayerData] = useReducer<(state: GlobalPlayerData, action: GlobalPlayerAction) => any>(globalPlayerReducer, {})
  const [planarData, setPlanarData] = useState<PlanarData>({ currentPlane: '', deck: [], discard: [] })

  /*
  set initial player states for dungeon tracking (to pass to Dungeon screen)
  */
  useEffect(() => {

    dispatchGlobalPlayerData({
      field: 'init',
      value: newGameData( totalPlayers, startingLife, savedNames ),
      playerID: 0
    })

    const newPlanarDeck = generatePlanarDeck(totalPlayers)
    setPlanarData({
      currentPlane: newPlanarDeck[0],
      deck: newPlanarDeck,
      discard: []
    })

  }, [totalPlayers])

  /*
  put this in StartingLife.tsx?
  */
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

  useEffect(() => {
    if (savedNames) {
      let newPlayerData = globalPlayerData;

      savedNames.forEach((arr: StoredNames) => {
        const id = arr[0]
        if (newPlayerData[id] && arr[1] !== null) {
          newPlayerData[id].screenName = arr[1]
        }
      })

      dispatchGlobalPlayerData({
        field: 'init',
        value: newPlayerData as GlobalPlayerData,
        playerID: 0
      })
    }

  }, [savedNames])


  return <GameContext.Provider value={{
    currentMonarch: currentMonarch,
    setCurrentMonarch: setCurrentMonarch,
    currentInitiative: currentInitiative,
    setCurrentInitiative: setCurrentInitiative,
    globalPlayerData: globalPlayerData as GlobalPlayerData,
    dispatchGlobalPlayerData: dispatchGlobalPlayerData,
    planarData: planarData,
    setPlanarData: setPlanarData
  }}>{children}</GameContext.Provider>
}