import { useState, useEffect } from "react";

/*
finds out how bright a color is.
Used to tell if contrast is high or low between player color themes (primary and secondary)
and adjusts some text accordingly
*/
export default function useLuminance(val: any | undefined){
    const [luminance, setLumina] = useState<any>()
    useEffect(()=>{
        const lumina = val.reduce((acc: number, curr: any, i: number): number => {
            if (i === 0) {
                acc += Number(curr) * 0.2126
            }
            if (i === 1) {
                acc += Number(curr) * 0.7152
            }
            if (i === 2) {
                acc += Number(curr) * 0.0722
            }
            return acc
        }, 0)
        setLumina(Math.ceil(lumina)/255)
    },[])
    return luminance
}