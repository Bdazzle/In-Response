import { CardData, CardResponse, CardResults } from "../index";
import { fetchWithLogging } from "../utils/api_debug";
import trackedFetch, { fetchWithRetry } from "../utils/conn_test";
import { queryTurso } from "./dbconn";
import { constructCardQuery } from "../functions/constructQuery";

// Alternative: XMLHttpRequest with explicit timeout
function fetchWithXHR(url : string, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let loaded = false;
    
    xhr.onload = () => {
      loaded = true;
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    };
    
    xhr.onerror = () => reject(new Error('XHR error'));
    xhr.ontimeout = () => reject(new Error('XHR timeout'));
    
    // Critical: Set timeout BEFORE open
    xhr.timeout = timeoutMs;
    xhr.open('GET', url);
    
    // Force fresh connection
    xhr.setRequestHeader('Connection', 'close');
    
    xhr.send();
  });
}

/*
Everything may need to be checked for pagination, since both '?exact=' and card/search/{card name} should get the same stuff
*/
const paginatedPages = async (url: string, headers: Record<string, string>) => {
    
    let allCards: CardResults = [];
    let nextPage = url;
   
    while (nextPage) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000)
        
        const options = { 
            method: 'GET', 
            signal: controller.signal, 
            headers 
        };
        
        // const response = await fetchWithLogging<any>(nextPage, options)
        // const response = await trackedFetch(nextPage, options)
        const response = await fetchWithRetry(url, options, 3)

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


const getCardData = async (cardInput: string, searchType?: string | 'exact') : Promise<CardResponse[] | undefined> => {

    try {
        // const headers = {
        //     "User-Agent": "In Response/4.1.3 (React Native, Android)",
        //     "Accept": "application/json",
        //     'Access-Control-Allow-Origin': '*',
        //     'Connection': 'close',  // Request no keep-alive
        // };
        const trimmedCard = cardInput.trim()
        // const endpoint = searchType === 'exact' ? `${process.env.EXPO_PUBLIC_API_ENDPOINT}/cards/search/?exact=${encodeURIComponent(trimmedCard)}` 
        // : `${process.env.EXPO_PUBLIC_API_ENDPOINT}/cards/search/${encodeURIComponent(trimmedCard)}`
      
        // const endpoint = searchType === 'exact' ? `${process.env.EXPO_PUBLIC_LOCAL_ENDPOINT}/cards/search/?exact=${encodeURIComponent(trimmedCard)}` 
        // : 
        // `${process.env.EXPO_PUBLIC_LOCAL_ENDPOINT}/cards/search/${encodeURIComponent(trimmedCard)}`

// const cardData = await trackedFetch(nextPage, {
//                 method: 'GET',
//                 headers: headers
//             })

        // const cardData = await paginatedPages(endpoint, headers)
        
        // return cardData
        
        const builtQuery = constructCardQuery(trimmedCard, searchType)
        // const stmt = await db.prepare(builtQuery.query)
        // const rows = await stmt.all(builtQuery.params)
        const rows = await queryTurso(builtQuery.query, builtQuery.params)

        // Turso returns JSON columns as strings. Normalize card faces at the fetch boundary.
        return rows.map((row) => ({
            ...row,
            card_faces: typeof row.card_faces === 'string'
                ? JSON.parse(row.card_faces)
                : row.card_faces,
        })) as unknown as CardResponse[]
    }
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

