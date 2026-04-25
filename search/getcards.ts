import { CardData, CardResults } from "../index";
import { fetchWithLogging } from "../utils/api_debug";

/*
Everything may need to be checked for pagination, since both '?exact=' and card/search/{card name} should get the same stuff
*/
const paginatedPages = async (url: string, headers: Record<string, string>) => {
    
    let allCards: CardResults = [];
    let nextPage = url;
   
    while (nextPage) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 45000)
        
        const options = { 
            method: 'GET', 
            signal: controller.signal, 
            headers 
        };
        
        const response = await fetchWithLogging<any>(nextPage, options)
        

        // const res = await fetch(nextPage, options);
        // if (!res.ok) {
        //     //throwing an error instead of console.log halts execution
        //     throw new Error(`HTTP response error! status: ${res.status}`)
        // }
        // const text = await res.text();
        // const response = JSON.parse(text)

        controller.abort()
        clearTimeout(timeoutId)
        allCards = allCards.concat(response.data as CardResults);
        nextPage = response.has_more ? response.next_page : null;
    }
    return allCards
}


const getCardData = async (cardInput: string, searchType?: string | 'exact') : Promise<CardData[] | undefined> => {

    try {
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json",
            'Access-Control-Allow-Origin': '*'
        };
        const trimmedCard = cardInput.trim()
        // const endpoint = searchType === 'exact' ? `${process.env.EXPO_PUBLIC_API_ENDPOINT}/cards/search/?exact=${encodeURIComponent(trimmedCard)}` 
        // : `${process.env.EXPO_PUBLIC_API_ENDPOINT}/cards/search/${encodeURIComponent(trimmedCard)}`
      
        const endpoint = searchType === 'exact' ? `${process.env.EXPO_PUBLIC_LOCAL_ENDPOINT}/cards/search/?exact=${encodeURIComponent(trimmedCard)}` 
        : 
        `${process.env.EXPO_PUBLIC_LOCAL_ENDPOINT}/cards/search/${encodeURIComponent(trimmedCard)}`

             // const response = await fetchWithLogging<any>(endpoint, {
            //     method: 'GET',
            //     headers: headers,
            //     signal: controller.signal
            // })
            // clearTimeout(timeoutId)
            // const cardData = response
            // const response = await fetch(endpoint, {
                // signal: controller.signal,
            //     method: 'GET',
            //     headers: headers
            // })
            // clearTimeout(timeoutId)
            // if (!response.ok) throw new Error(`HTTP ${response.status}`);
            // const text = await response.text()
            // const cardData = JSON.parse(text)
            // const cardData = await response.json()
        const cardData = await paginatedPages(endpoint, headers)
        
        return cardData
    }
    // clearTimeout(timeoutId)
        // controller.abort()
    catch (error) {
        console.trace('Error fetching card data:', error);
        return;
    }
}

export const getSetSymbol = async (uri: string) => {
    try {
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json",
            'Access-Control-Allow-Origin': '*'
        };
        const response = await fetch(uri,
            {
                method: 'GET',
                headers: headers
            });

        if (!response.ok) {
            //throwing an error instead of console.log halts execution
            throw new Error(`HTTP response error! status: ${response.status}`)
        }
        const scryData = await response.json()
        return scryData.icon_svg_uri
    }
    catch (error) {
        console.log('Error fetching set symbol:', error);
        return;
    }
};

export const getSuggestedCards = async (cardInput: string) => {
    try {
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json",
            'Access-Control-Allow-Origin': '*'
        };
        const trimmedCard = cardInput.trim()
        const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(trimmedCard)}`,
            {
                method: 'GET',
                headers: headers
            });

        if (!response.ok) {
            //throwing an error instead of console.log halts execution
            throw new Error(`HTTP response error! status: ${response.status}`)
        }

        const scryData = await response.json();
        return scryData.data as string[];
    }
    catch (error) {
        console.log('Error fetching card suggestion:', error);
        return;
    }
}

/*
Gets all cards for a deck INCLUDING foreign ones. Get only english, or check device language?
*/
export const getPlanes = async (options: string) : Promise<CardResults | undefined> => {
    try {
        // url string syntax(&set=) added in Planecahse.tsx
        const query = `type=plane&type=phenomenon${options}&lang=en`
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json",
            'Access-Control-Allow-Origin': '*'
        };
        const endpoint =`${process.env.EXPO_PUBLIC_API_ENDPOINT}/cards/search?${query}`

        const response = await fetch(endpoint,
            {
                method: 'GET',
                headers: headers
            });
        const text = await response.text()
        const cardData = JSON.parse(text)

        // const response =  fetchWithLogging<any>(endpoint,{
        //     method: 'GET',
        //     headers: headers
        // })
        // const cardData = await response;
        return cardData.data
    }
    catch (error) {
        console.log('Error fetching plane images:', error);
        return;
    }
}


export default getCardData

