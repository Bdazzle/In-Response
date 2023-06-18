import { useState, useEffect } from "react";

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