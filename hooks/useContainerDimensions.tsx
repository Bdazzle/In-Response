import { useState, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

export default function useContainerDimensions(gameType: string, totalPlayers: number) {
    const [staticCounterDim, setStaticCounterDim] = useState<StyleProp<ViewStyle>>({
        width: '80%',
        marginLeft: 0
    })
    const [commanderDim, setCommanderDim] = useState<StyleProp<ViewStyle>>({
        height: '80%'
    })

    useEffect(() => {
        if (gameType === 'commander') {
            if (totalPlayers === 3) {
                setStaticCounterDim({
                    width: '60%',
                    marginLeft: '15%'
                })
                setCommanderDim({
                    height: '80%'
                })
            }
            else if (totalPlayers === 4) {
                setStaticCounterDim({
                    width: '60%',
                    marginLeft: '20%'
                })
                setCommanderDim({
                    height: '90%'
                })
            }
            else {
                setStaticCounterDim({
                    width: '80%',
                    marginLeft: 0
                })
                setCommanderDim({
                    height: '80%'
                })
            }
        } else if (gameType === 'oathbreaker') {
            if(totalPlayers === 2){
                setStaticCounterDim({
                    width: '80%',
                    marginLeft: 0
                })
                setCommanderDim({
                    height: '80%'
                })
            } 
            else if(totalPlayers === 4){
                setStaticCounterDim({
                    width: '75%',
                    marginLeft: '15%'
                })
                setCommanderDim({
                    height: '85%'
                })
            }
            else {
                setStaticCounterDim({
                    width: '75%',
                    marginLeft: '10%'
                })
                setCommanderDim({
                    height: '80%'
                })
            }
        } else {
            if (totalPlayers === 4) {
                setStaticCounterDim({
                    width: '80%',
                    marginLeft: 0
                })
                setCommanderDim({
                    height: '90%'
                })
            } 
            // else {
            //     setStaticCounterDim({
            //         width: '80%',
            //         marginLeft: 0
            //     })
            //     setCommanderDim({
            //         height: '80%'
            //     })
            // }
        }
    }, [gameType, totalPlayers])

    return [staticCounterDim, commanderDim]
}