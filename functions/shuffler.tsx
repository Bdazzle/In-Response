import { ImageSourcePropType } from "react-native";

/*
Fisher-Yates Shuffle. In-place shuffle O(n).
stores shuffled elements in back of array.
stores remaining elements in front of array.
the number of shuffled elements (n - m) plus the number of remaining elements (m) is always equal to n.
pick a random remaining element (from the front) and place in its new location (in the back). 
The unshuffled element in the back is swapped to the front, where it waits for subsequent shuffling.
*/
type Shuffler<T> = (deck: T[], deckSize?: number) => T[]

const shuffle: Shuffler<any> = (deck: any[], deckSize: number | undefined) => {
    /* start at back index */
    let currentIndex = deckSize ? deckSize : deck.length;
    let randomIndex: number;

    /* while there is still unshuffled elements */
    while (currentIndex != 0) {
        /* pick random element */
        randomIndex = Math.floor(Math.random() * currentIndex);
        /* decrement from back of starting array */
        currentIndex--;
        /* swap random element and current element  */
        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]]
    }
    
    return deckSize ? deck.slice(0, deckSize) : deck
}

export default shuffle
