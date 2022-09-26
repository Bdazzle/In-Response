import React, { createContext, useState } from "react"

export interface OptionsContextProps {
    startingLife: number,
    setStartingLife: React.Dispatch<React.SetStateAction<number>>,
    gameType: string,
    setGameType: React.Dispatch<React.SetStateAction<string>>,
    totalPlayers: number,
    setTotalPlayers: React.Dispatch<React.SetStateAction<number>>,
}

export const OptionsContext = createContext({} as OptionsContextProps)

export const OptionsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [gameType, setGameType] = useState<string>('normal')
    const [totalPlayers, setTotalPlayers] = useState<number>(2)
    const [startingLife, setStartingLife] = useState<number>(20)

    return <OptionsContext.Provider value={{
        totalPlayers: totalPlayers,
        setTotalPlayers: setTotalPlayers,
        startingLife: startingLife,
        setStartingLife: setStartingLife,
        gameType: gameType,
        setGameType: setGameType,
    }}>{children}</OptionsContext.Provider>
}