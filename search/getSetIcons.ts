import { CardData, CombinedCards, SetsData } from "../index"
import { fetchWithLogging } from "../utils/api_debug";


const getUniqueSets = async (cardData : CardData[]) =>{
    try {
        const set_codes = [...new Set(cardData.map(card => encodeURIComponent(card.set_code)))];
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json",
            'Access-Control-Allow-Origin': '*'
        };
        const endpoint = `${process.env.EXPO_PUBLIC_API_ENDPOINT}/sets/${set_codes.join(',')}`
        // const response = await fetchWithLogging<any>(endpoint, {
        //                 method: 'GET',
        //                 headers: headers
        //             })
        // const setData = response
        const response = await fetch(endpoint,
            {
                method: 'GET',
                headers: headers
            });
        const text = await response.text()
        const setData = JSON.parse(text)
        
        return setData
    } catch (error){
        console.log("Error getting set data:", error)
    }
}

export const addSetSymbolstoCards = (data : CombinedCards, sets : {[key: string]: SetsData}) =>{
    
    if(data && sets){
        const setsSymbolsMap = new Map
        Object.values(sets).map(set =>{
            setsSymbolsMap.set(set.set_code,set.icon_svg_uri)
        })
        Object.values(data).forEach((cardVersions) =>{
            cardVersions.versions.forEach((card) =>{
                if (!card.icon_svg_uri){
                    card.icon_svg_uri = ''
                }
                const { set_code } = card;
                card.icon_svg_uri = setsSymbolsMap.get(set_code)
            })
        })
    }
}

export default getUniqueSets
