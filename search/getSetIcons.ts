import { CardData, CombinedCards, SetsData } from "../index"
import { Image } from "react-native"
// import { fetchWithLogging } from "../utils/api_debug";

/**
 * All scryfall svg urls are: https://svgs.scryfall.io/sets/{set_code}.svg?1772427600
 * scryfall doesn't have icons for some sets, and use 'default' instead of set_code
 * @param cardData 
 * @returns 
 */
// const getUniqueSets = async (cardData : CardData[]) =>{
//     try {
//         const set_codes = [...new Set(cardData.map(card => encodeURIComponent(card.set_code)))];
//         const headers = {
//             "User-Agent": "In Response/4.1.3 (React Native, Android)",
//             "Accept": "application/json",
//             'Access-Control-Allow-Origin': '*'
//         };
//         const endpoint = `${process.env.EXPO_PUBLIC_API_ENDPOINT}/sets/${set_codes.join(',')}`
//         // const response = await fetchWithLogging<any>(endpoint, {
//         //                 method: 'GET',
//         //                 headers: headers
//         //             })
//         // const setData = response
//         const response = await fetch(endpoint,
//             {
//                 method: 'GET',
//                 headers: headers
//             });
//         const text = await response.text()
//         const setData = JSON.parse(text)
        
//         return setData
//     } catch (error){
//         console.log("Error getting set data:", error)
//     }
// }

export const validIcon = async (setCode : string, setIconCache: Map<string, boolean>) : Promise<string | boolean> => {
    
    const url = `https://svgs.scryfall.io/sets/${setCode}.svg?1772427600`

    if (setIconCache.has(url)){
        return setIconCache.get(url) as unknown as string
    }

    try {
        await Image.prefetch(url);
        setIconCache.set(url, true);
        return true
    }
    catch (error){
        console.log(`Icon missing for ${setCode}. applying default`);
        setIconCache.set(url, false)
        return false
    }
}
/**
 * All scryfall svg urls are: https://svgs.scryfall.io/sets/${set_code}.svg?1772427600
 * scryfall doesn't have icons for some sets, and use 'default' instead of set_code
 * @param data 
 * @param sets sets : {[key: string]: SetsData}
 */
export const addSetSymbolstoCards = (data : CombinedCards, cache : Map<string, boolean>) =>{
    
    if(data){
        // const setsSymbolsMap = new Map
        // Object.values(sets).map(set =>{
        //     setsSymbolsMap.set(set.set_code,set.icon_svg_uri)
        // })
        Object.values(data).forEach((cardVersions) =>{
            cardVersions.versions.forEach((card) =>{
                if (!card.icon_svg_uri){
                    card.icon_svg_uri = ''
                }
                const { set_code } = card;
                // const isValid = await validIcon(set_code, cache);
                // card.icon_svg_uri = setsSymbolsMap.get(set_code)
                card.icon_svg_uri = `https://svgs.scryfall.io/sets/${set_code}.svg?1772427600`
            })
        })
    }
}

// export default getUniqueSets
