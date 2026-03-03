import { Rulings } from "../index";

export const getRulesScryfall = async (uri: string) => {
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

        const rules = await response.json()
        return rules.data as Rulings

    } catch (error) {
        console.log('Error fetching card rules:', error)
        return
    }
}


export default getRulesScryfall