import React, { useRef, useState } from "react"
import { ColorTheme, DungeonData } from "."


export interface PlayerContextProps {
    dungeonCompleted: boolean,
    setDungeonComplete: React.Dispatch<React.SetStateAction<boolean>>,
    dimensions: { width: number, height: number },
    setDimensions: React.Dispatch<React.SetStateAction<{ width: number, height: number }>>,
    playerName: string,
    setPlayerName: React.Dispatch<React.SetStateAction<string>>,
    dungeonData: DungeonData | undefined,
    setDungeonData: React.Dispatch<React.SetStateAction<DungeonData | undefined>>,
    colorTheme: ColorTheme,
    setColorTheme : React.Dispatch<React.SetStateAction<ColorTheme>>,
    playerID: number | undefined,
    setPlayerID: React.Dispatch<React.SetStateAction<number | undefined>>,
}

export const PlayerContext = React.createContext<PlayerContextProps | null>(null)

/*
Dungeon data is tracked in Game Context to pass to Dungeon screen
*/
export const PlayerProvider: React.FC = ({ children }) => {
    const [dungeonCompleted, setDungeonComplete] = useState<boolean>(true)
    const [dimensions, setDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
    const [playerName, setPlayerName] = useState<string>('')
    const [dungeonData, setDungeonData] = useState<DungeonData | undefined>()
    const [colorTheme, setColorTheme] = useState<ColorTheme>({ primary: '', secondary:''})
    const [playerID, setPlayerID] = useState<number | undefined>()

    // console.log('player dimensions w/h', dimensions)
    return <PlayerContext.Provider value={{
        dungeonCompleted: dungeonCompleted,
        setDungeonComplete: setDungeonComplete,
        dimensions: dimensions,
        setDimensions: setDimensions,
        playerName: playerName,
        setPlayerName: setPlayerName,
        dungeonData: dungeonData,
        setDungeonData: setDungeonData,
        colorTheme: colorTheme,
        setColorTheme: setColorTheme,
        playerID: playerID,
        setPlayerID: setPlayerID
    }}>{children}</PlayerContext.Provider>
}