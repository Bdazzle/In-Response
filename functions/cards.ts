import { Card, CardData, CombinedCards, RulesData } from "../index";
import getRules from "../search/getRules";
import { validIcon } from "../search/getSetIcons";

/* 
return object like 
{
cardname:{[cardsVersion1..., cardVersion2] rules:'...'},
...more cards
since traversing an object to render components has to be an array anyway
}
*/
/*
Gets rules for each unique card. Set data is added later.
*/
const collateCardData = async (cardData: CardData[], iconCache : Map<string, boolean>) =>{
    try {
        if (cardData){
            const oracle_ids = [...new Set(cardData.map(card => card.oracle_id))];
            
            const rules_data = await getRules(oracle_ids) as RulesData[]
            
            const rulesMap = new Map
            rules_data.forEach((item) => {
                const id = item["oracle_id"];
                rulesMap.set(id, [...(rulesMap.get(id) || []), item["rule_text"]]);
            });

            // Prefetch icon validations in parallel (to avoid sequential async calls which take longer)
            const iconsMap = new Map<string, boolean>(
                await Promise.all(
                    (cardData).map(async (item :CardData) : Promise<[string, boolean]> => [
                        item.set_code, await validIcon(item.set_code, iconCache) as boolean
                    ])
                )
            );
            
            const collated = cardData.reduce((res: CombinedCards, item) =>{
                const { 
                    name,
                    oracle_id,
                    set_code } = item;

                    const isValid = iconsMap.get(set_code)
                    const icon_svg_uri = isValid ? `https://svgs.scryfall.io/sets/${set_code}.svg?1772427600`
                    : `https://svgs.scryfall.io/sets/default.svg?1772427600`;

                    if (!res[name as string]) {
                        res[name as string] = {
                            versions: [],
                            rules: rulesMap.get(oracle_id) || []
                        }
                    }
                    res[name as string].versions.push({...item, icon_svg_uri} as Card)
                    return res
            },{})
            
            return collated
        }
        else {
            return
        }
    } catch (error){
        console.log('Error processing cards', error)
    }
}

export default collateCardData
