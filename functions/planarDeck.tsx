import shuffle from "./shuffler"
import planechaseImages from "../constants/PlanechaseImages"
    /* 
    shuffle phenom deck first. slice at max phenom allowed per players
    shuffle planar cards.
    combine.
    shuffle again.
    */
const generatePlanarDeck = (totalPlayers: number) => {
    const shuffledPlanes = shuffle(Object.keys(planechaseImages.planes))
    const shuffledPhenom = shuffle(Object.keys(planechaseImages.phenomenon), totalPlayers * 2)
    const randomizedCards = shuffle([...shuffledPlanes, ...shuffledPhenom])
    const newDeck = randomizedCards.slice(0, totalPlayers * 10)
    return newDeck
}

export default generatePlanarDeck