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
    simpleDisplay : boolean,
    saveDisplay : (val: boolean) => Promise<void>,
}

export const OptionsContext = createContext({} as OptionsContextProps)

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deviceType, setDeviceType] = useState<string>('')
    const [gameType, setGameType] = useState<string>('normal')
    const [totalPlayers, setTotalPlayers] = useState<number>(2)
    const [startingLife, setStartingLife] = useState<number>(20)
    const [simpleDisplay, setSimpleDisplay] = useState<boolean>(false)
    // const [savedData, setSavedData] = useState<readonly KeyValuePair[]>([])

    const resolveDeviceType = async () => {
        try {
            const deviceData = await Device.getDeviceTypeAsync()
            const deviceCode = deviceData === 1 ? 'phone' : deviceData === 2 ? 'tablet' : deviceData === 0 ? 'unknown' : 'unspecified device'
            setDeviceType(deviceCode)
        } catch (error) {
            console.log(`error getting device type ${error}`)
        }
    }
    
    const saveDisplay = async (val: boolean) => {
        try {
            setSimpleDisplay(val)
            await AsyncStorage.setItem(`simple display`, JSON.stringify(val))
            console.log('saved simple display', JSON.stringify(val))
        }
        catch (e) {
            console.log(`error saving display options`, e)
        }
    }

    const getDisplayOptions = async () =>{
        try {
            const savedOptions = await AsyncStorage.getItem('simple display')
            if(savedOptions){
                setSimpleDisplay(JSON.parse(savedOptions))
            }
            console.log('loaded display options')
        }
        catch(e) {
            console.log('error loading saved options', e)
        }
    }

    useEffect(() => {
        getDisplayOptions()
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
        simpleDisplay: simpleDisplay,
        saveDisplay: saveDisplay
        // setSimpleDisplay: setSimpleDisplay
    }}>{children}</OptionsContext.Provider>
}