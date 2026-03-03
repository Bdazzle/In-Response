import { CombinedCards } from "../index"
import sleep from "../functions/sleep"
import { getSetSymbol } from "./getcards"

/*
get unique sets for all card results, then fetch each svg and pass to Card (or add to a card's data object)
so you don't have to make redundant API requests for each card.
*/
const getSets = async (data: CombinedCards) => {
    if (data) {
        const uniqueSets = Object.values(data).reduce((acc, curr) => {
            if (!acc) {
                acc = {}
            }
            curr.versions.forEach((card) => {
                const { set, set_uri } = card
                if (!acc[set as string]) {
                    acc[set as string] = set_uri as string
                }
            })
            return acc
        }, {} as { [key: string]: string })

        for (const [key, uri] of Object.entries(uniqueSets)) {
            /*
            with cards like Lightning Bolt, where there's a gillion printings, 
            this request is hitting th Scryfall API too much and through 429 errors.
            So we have to stagger request attempts. 
            */
            let attempts = 0;
            while (attempts < 2) {
                try {
                    const svg = await getSetSymbol(uri);
                    uniqueSets[key] = svg;
                    break; // success
                } catch (error: any) {
                    if (error instanceof Error &&
                        /429/.test(error.message) &&
                        attempts === 0
                    ) {
                        // back off 500ms and retry once
                        await sleep(500);
                        attempts += 1;
                        continue;
                    }
                    console.error('Error fetching set SVGs!', error, [key, uri]);
                    break;
                }
            }
            await sleep(100)//200 is too long for cards w/many different versions

            // try {
            //     const svg = await getSetSymbol(uri)
            //     uniqueSets[key] = svg
            // }
            // catch (error) {
            //     console.error('Error fetching set SVGs!', error, [key, uri])
            // }
            // await sleep(100)
        }
        
        return uniqueSets
    }
}

export const addSetSymbolstoCards = (data: CombinedCards, sets: { [key: string]: string }) => {
    if (data && sets) {
        Object.values(data).forEach((cardVersions) => {
            cardVersions.versions.forEach((card) => {
                if (!card.set_icon_svg_uri) {
                    card.set_icon_svg_uri = ''
                }
                const { set } = card;
                if (Object.keys(sets).includes(set as string)) {
                    card.set_icon_svg_uri = sets[set as string]
                }
            })
        })
    }
}

export default getSets