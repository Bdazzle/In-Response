import { Card, ScryResultData } from "../index";

const paginatedPages = async (url: string, headers: Record<string, string>) => {
    let allCards: ScryResultData = [];
    let nextPage = url;
    // headers object is not a valid fetch options object.  when calling
    // `fetch(url, headers)` the second argument is treated as the entire
    // options (method/body/headers/etc), the headers map would becomes the
    // request body.  Scryfall rejects GET requests with a body (400), which is
    // the error being thrown with `onSubmitEditing`, but not when using the named endpoint (exact match), where {method:'GET', headers} were passed correctly).
    // Always wrap the headers in an options object and include a method so the fetch call behaves as expected.
    const options = { method: 'GET', headers };
    while (nextPage) {
        const response = await fetch(nextPage, options);
        if (!response.ok) {
            //throwing an error instead of console.log halts execution
            throw new Error(`HTTP response error! status: ${response.status}`)
        }
        const data = await response.json()
        allCards = allCards.concat(data.data as ScryResultData);
        nextPage = data.has_more ? data.next_page : null;
    }

    return allCards
}

const getCardData = async (cardInput: string) => {
    try {
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json"
        };
        const trimmedCard = cardInput.trim()
        const endpoint = `https://api.scryfall.com/cards/search?unique=prints&q=${encodeURIComponent(trimmedCard)}&include_multilingual=true`
        const scryData = await paginatedPages(endpoint, headers)
        return scryData as ScryResultData;
    }
    catch (error) {
        console.log('Error fetching card data:', error);
        return;
    }
}

export const getAllCardVersion = async (id: string) => {
    try {
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json"
        };
        const response = await fetch(`https://api.scryfall.com/cards/search?unique=prints&q=oracle_id:${id}&include_multilingual=true`,
            {
                method: 'GET',
                headers: headers
            }
        );
        if (!response.ok) {
            //throwing an error instead of console.log halts execution
            throw new Error(`HTTP response error! status: ${response.status}`)
        }
        const cardData = await response.json()
        return cardData.data as ScryResultData
    }
    catch (error) {
        console.log('Error fetching card versions:', error);
        return;
    }
}

export const getExactCard = async (cardInput: string) => {
    try {
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json"
        };
        const trimmedCard = cardInput.trim()
        const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(trimmedCard)}`,
            {
                method: 'GET',
                headers: headers
            });

        if (!response.ok) {
            //throwing an error instead of console.log halts execution
            throw new Error(`HTTP response error! status: ${response.status}`)
        }

        const scryData = await response.json();
        return scryData as Card;
    }
    catch (error) {
        console.log('Error fetching card data:', error);
        return;
    }
}

export const getSetSymbol = async (uri: string) => {
    try {
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json"
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
            "Accept": "application/json"
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
getting type:plane DOES NOT get type:phenomenon
*/
export const getPlanes = async (options : string) => {
    try{
        //example search for planes: 'type:plane (set:who OR set:pc2) OR type:phenomenon (...sets)'
        const query = `type:plane (${options}) OR type:phenomenon (${options})`
        const headers = {
            "User-Agent": "In Response/4.1.3 (React Native, Android)",
            "Accept": "application/json"
        };

        const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`,
            {
                method: 'GET',
                headers: headers
            });

            const scryData = await response.json();
            return scryData.data as ScryResultData
    }
    catch (error) {
        console.log('Error fetching plane images:', error);
        return;
    }
}


export default getCardData