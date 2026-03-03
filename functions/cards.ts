import { CombinedCards, ScryFallCard, ScryResultData } from "../index";
import getRules, { getRulesScryfall } from "../search/getRules";

/* 
return object like 
{
cardname:{[cardsVersion1..., cardVersion2] rules:'...'},
...more cards
since traversing an object to render components has to be an array anyway
}
*/
// const processCardData = async (cardData: UsedCard[]) =>{
//     try {
//         if (cardData){
//             const oracle_ids = [...new Set(cardData.map(card => card.oracle_id))];
//             const rules_data = getRules(oracle_ids)
//             const rulesMap = new Map
//             Object.entries(rules_data).map(([key, val]) =>{
//                 rulesMap.set(key, val)
//             })
            
//             const collated = cardData.reduce((res: CombinedCards, item) =>{
//                 const { 
//                     id, 
//                     name,
//                     oracle_id,
//                     printed_name,
//                     set_code,
//                     lang,
//                     oracle_text,
//                     printed_text,
//                     image_uri,
//                     set_name } = item;

//                     const { card_faces } = item

//                     if (!res[name as string]) {
//                         res[name as string] = {
//                             versions: [],
//                             rules: rulesMap.get(oracle_id)
//                         }
//                     }
//                     res[name as string].versions.push(item as UsedCard)

//                     return res
//             },{})
//         }
//     } catch (error){
//         console.log('Error processing cards', error)
//     }
    
// }

const collateCardData = async (cardData: ScryResultData): Promise<CombinedCards | undefined> => {
    try {
        if (cardData) {
            /*
            making a new Set and mapping over it will have an O(m) where m is the number of cards,
            instead of something like pushing into a new array and checking that array in the reducer, 
            which has O(m*n) (m = cards, n = uris) since it will check every element in the array until it finds a match.
            
            uris Set and reduced cards MAY NOT have the same corresponding indicies, 
            so I have to create a Map to maintain the uri, not just the data fetched from it.
            */
            const uniqueRulesUris = [...new Set(cardData.map(card => card.rulings_uri))];
            const rulesMap = new Map

            await Promise.all(
                uniqueRulesUris.map(async (uri) => {
                    const ruling = await getRulesScryfall(uri as string);
                    rulesMap.set(uri, ruling)
                })
            )

            const collated = cardData.reduce((res: CombinedCards, item) => {

                const { name, 
                    set_uri,
                    rulings_uri,
                    image_uris,
                    lang,
                    oracle_id,
                    oracle_text,
                    printed_text,
                    set,
                    set_name } = item;

                const { card_faces } = item

                /*
                don't need to add ruling_uri to new card object, only need response
                */
                const usedData = {
                    set_uri,
                    image_uris,
                    lang,
                    oracle_id,
                    oracle_text,
                    printed_text,
                    set,
                    set_name
                }
                const rest = card_faces ? { ...usedData, card_faces } : usedData

                if (!res[name as string]) {
                    res[name as string] = {
                        versions: [],
                        rules: rulesMap.get(rulings_uri)
                    }
                }
                res[name as string].versions.push(rest as ScryFallCard)

                return res
            }, {})
            return collated
        }
        else {
            return
        }
    }
    catch (error) {
        console.error('Error fetching card rules!', error)
    }
}

export default collateCardData