import { useState, useEffect } from "react";

export default function useScreenRotation(totalPlayers: number, playerID: number) {
    const [rotate, setRotate] = useState<[] | [{rotate: string}]>([])

    useEffect(() => {
        if ((totalPlayers === 2 && playerID === 2) || (totalPlayers === 3 && playerID !== 3) || (totalPlayers === 4 && playerID <= 2)){
            setRotate([{ rotate: '180deg' }])
        }
    },[totalPlayers, playerID])

    return rotate
}