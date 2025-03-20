import { CombinedCards, ScryFallCard, ScryResultData } from "..";
import getRules from "../search/getRules";

/* 
return object like 
{
cardname:{[cardsVersion1..., cardVersion2] rules:'...'},
...more cards
since traversing an object to render components has to be an array anyway
}
*/
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
                    const ruling = await getRules(uri as string);
                    rulesMap.set(uri, ruling)
                })
            )

            const collated = cardData.reduce((res: CombinedCards, item) => {

                const { name, set_uri,
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