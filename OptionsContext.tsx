import React, { createContext, useEffect, useState } from "react"
import * as Device from 'expo-device'
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface OptionsContextProps {
    deviceType: string,
    startingLife: number,
    setStartingLife: React.Dispatch<React.SetStateAction<number>>,
    gameType: string,
    setGameType: React.Dispatch<React.SetStateAction<string>>,
    totalPlayers: number,
    setTotalPlayers: React.Dispatch<React.SetStateAction<number>>,
}

export const OptionsContext = createContext({} as OptionsContextProps)

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deviceType, setDeviceType] = useState<string>('')
    const [gameType, setGameType] = useState<string>('normal')
    const [totalPlayers, setTotalPlayers] = useState<number>(2)
    const [startingLife, setStartingLife] = useState<number>(20)

    const resolveDeviceType = async () => {
        try {
            const deviceData = await Device.getDeviceTypeAsync()
            const deviceCode = deviceData === 1 ? 'phone' : deviceData === 2 ? 'tablet' : deviceData === 0 ? 'unknown' : 'unspecified device'
            setDeviceType(deviceCode)
        } catch (error) {
            console.log(`error getting device type ${error}`)
        }
    }

    useEffect(() => {
        resolveDeviceType()
    }, [])

    /*
    clear storage
    */
    // useEffect(() => {
    //     (async () =>{
    //         try {
    //             await AsyncStorage.clear()
    //         }
    //         catch(e){
    //             console.log('error clearing storage', e)
    //         }
    //     })()
    //     // getSavedData()
    // },[])

    return <OptionsContext.Provider value={{
        deviceType: deviceType,
        totalPlayers: totalPlayers,
        setTotalPlayers: setTotalPlayers,
        startingLife: startingLife,
        setStartingLife: setStartingLife,
        gameType: gameType,
        setGameType: setGameType,
    }}>{children}</OptionsContext.Provider>
}