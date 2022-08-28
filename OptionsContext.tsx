import React, { useState } from "react"

export interface OptionsContextProps {
    startingLife: number,
    setStartingLife: React.Dispatch<React.SetStateAction<number>>,
    gameType: string,
    setGameType: React.Dispatch<React.SetStateAction<string>>,
    totalPlayers: number,
    setTotalPlayers: React.Dispatch<React.SetStateAction<number>>,
}

export const OptionsContext = React.createContext<OptionsContextProps | null>(null)

export const OptionsProvider: React.FC = ({ children }) => {
    const [gameType, setGameType] = useState<string>('commander')
    const [totalPlayers, setTotalPlayers] = useState<number>(4)
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