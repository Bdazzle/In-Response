import { Rulings } from "..";


const getRules = async (uri: string) => {
    try {
        const headers = {
            "User-Agent": "In Response/3.0.0 (React Native, Android)",
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


export default getRules