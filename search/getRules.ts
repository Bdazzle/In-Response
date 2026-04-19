import { RulesData } from "../index";
// import { fetchWithLogging } from "../utils/api_debug";

 const getRules = async (oracle_ids: string[]) : Promise<RulesData[] | undefined> =>{
    const headers = {
        "User-Agent": "In Response/4.1.3 (React Native, Android)",
        "Accept": "application/json",
        'Access-Control-Allow-Origin': '*'
    };

    const endpoint = `${process.env.EXPO_PUBLIC_LOCAL_ENDPOINT}/rules/?oracle_id=${encodeURIComponent(oracle_ids.join(','))}`
    // const endpoint = `${process.env.EXPO_PUBLIC_API_ENDPOINT}/rules/?oracle_id=${encodeURIComponent(oracle_ids.join(','))}`
    try {
    const response =  await fetch(endpoint, {
        method: "GET",
        headers: headers
    })
    // const rules_data = await response.json()
    const text = await response.text()
    const rules_data = JSON.parse(text)

    // const response = await fetchWithLogging<any>(endpoint, {
    //             method: 'GET',
    //             headers: headers
    //         })
    // const rules_data = response
    
    return rules_data.data
    }
    catch (error) {
        console.trace('Error fetching rules data:', error);
        return;
    }
}

export default getRules
