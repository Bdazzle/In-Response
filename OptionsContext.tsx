import AsyncStorage from "@react-native-async-storage/async-storage"
import { KeyValuePair } from "@react-native-async-storage/async-storage/lib/typescript/types"
import React, { createContext, useEffect, useState } from "react"

export interface OptionsContextProps {
    startingLife: number,
    setStartingLife: React.Dispatch<React.SetStateAction<number>>,
    gameType: string,
    setGameType: React.Dispatch<React.SetStateAction<string>>,
    totalPlayers: number,
    setTotalPlayers: React.Dispatch<React.SetStateAction<number>>,
    savedNames: readonly KeyValuePair[] | undefined,
}

export const OptionsContext = createContext({} as OptionsContextProps)

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gameType, setGameType] = useState<string>('normal')
    const [totalPlayers, setTotalPlayers] = useState<number>(2)
    const [startingLife, setStartingLife] = useState<number>(20)
    const [savedNames, setSavedNames] = useState<readonly KeyValuePair[]>()

    const getPlayerNames = async () => {
        try {
            const playersArr = [...Array(totalPlayers).keys()].map(x => String(x + 1))
            const names = await AsyncStorage.multiGet(playersArr)
            if (savedNames !== null && names.length > 0) {
                setSavedNames(names)
                console.log('saved names', names)
            }
        }
        catch (e) {
            console.log(`error getting saved player names`, e)
        }
    }

    useEffect(() => {
        // AsyncStorage.clear()
        getPlayerNames()
    }, [])

    return <OptionsContext.Provider value={{
        totalPlayers: totalPlayers,
        setTotalPlayers: setTotalPlayers,
        startingLife: startingLife,
        setStartingLife: setStartingLife,
        gameType: gameType,
        setGameType: setGameType,
        savedNames: savedNames,
    }}>{children}</OptionsContext.Provider>
}