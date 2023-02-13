import React, { createContext, useContext, useEffect, useReducer, useState } from "react"
import { GlobalPlayerData, PlanarData } from "."
import globalPlayerReducer, { GlobalPlayerAction } from "./reducers/globalPlayerReducer";
import generatePlanarDeck from "./functions/planarDeck";
import { OptionsContext, OptionsContextProps } from "./OptionsContext";
import newGameData from "./functions/newGame";
import { KeyValuePair } from "@react-native-async-storage/async-storage/lib/typescript/types";

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

/*
TO DO
*)build command for apk: eas build -p android --profile preview
  -eas build uses .gitignore to access files, so change access to assets files after build so it's not uploaded to github
*) Animated.View prevents any child components onPress and onLongPress from firing normally,
  Because the touch event is intercepted by the Animated API. 
  Swipeable components from React Native Gesture Handler used instead.
*) implement a better reset (like in commander tax tracker) to improve performance? (may be unnecessary)
*) all rotated screens have a Y difference of 70, this might be device related or aspect ratio related? really need to test on a tablet
*) Create options for a less busy display (options for Static Counter, maybe Incremental counters later)
*/

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalPlayers, startingLife, savedData } = useContext(OptionsContext) as OptionsContextProps
  const [currentMonarch, setCurrentMonarch] = useState<string>()
  const [currentInitiative, setCurrentInitiative] = useState<string>()
  const [globalPlayerData, dispatchGlobalPlayerData] = useReducer<(state: GlobalPlayerData, action: GlobalPlayerAction) => any>(globalPlayerReducer, {})
  const [planarData, setPlanarData] = useState<PlanarData>({ currentPlane: '', deck: [], discard: [] })
  const [reset, setReset] = useState<boolean>(false)
  /*
  set initial player states for dungeon tracking (to pass to Dungeon screen)
  */
  useEffect(() => {

    dispatchGlobalPlayerData({
      field: 'init',
      value: newGameData( totalPlayers, startingLife, savedData ),
      playerID: 0
    })

    const newPlanarDeck = generatePlanarDeck(totalPlayers)
    setPlanarData({
      currentPlane: newPlanarDeck[0],
      deck: newPlanarDeck,
      discard: []
    })

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

  /*
  parse saved data : names, colors.
  sets as default options through rest of app
  */
  useEffect(() => {
    if (savedData && Object.keys(globalPlayerData).length > 0) {
      let newPlayerData = globalPlayerData;
        savedData.forEach((arr: KeyValuePair) => {
          if(arr[0].includes('screenName')){
            newPlayerData[arr[0].charAt(0)].screenName = arr[1]
          }
          if(arr[0].includes('colors')){
            newPlayerData[arr[0].charAt(0)].colors = JSON.parse(arr[1] as string)
          }
        })   
    }
  }, [savedData])

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