import shuffle from "./shuffler"
import { PlanarDeck, PlaneChaseSet, ScryResultData } from ".."
import { ImageSourcePropType } from "react-native"

export const collatePlanarData = (data: ScryResultData) => {
    return data.reduce((acc, card) => {
        const { name, image_uris, type_line, set } = card
        if (!acc) {
            acc = {}
        }
        if (!acc[set]) {
            acc[set] = {
                planes: {},
                phenomenon: {}
            }
        }
        type_line === "Phenomenon" ? acc[set].phenomenon[name] = image_uris!.normal as ImageSourcePropType : acc[set].planes[name] = image_uris!.normal as ImageSourcePropType
        return acc
    }, {} as PlaneChaseSet)
}
/* 
shuffle phenom deck first. slice at max phenom allowed per players
shuffle planar cards.
combine.
shuffle again.
*/
const generatePlanarDeck = (totalPlayers : number, planarData: PlaneChaseSet) => {
    const totalCards = Object.keys(planarData).reduce((acc, set) => {
        acc.planes = { ...acc.planes, ...planarData[set].planes };
        acc.phenomenon = { ...acc.phenomenon, ...planarData[set].phenomenon };
        return acc
    }, { planes: {}, phenomenon: {} } as PlanarDeck)
    const shuffledPlanes = shuffle(Object.entries(totalCards.planes))
    let shuffledPhenom;
    if(Object.keys(totalCards.phenomenon).length){
        const maxPhenom = Object.keys(totalCards.phenomenon).length > totalPlayers * 2 ? totalPlayers * 2 : Object.keys(totalCards.phenomenon).length
        shuffledPhenom = Object.keys(totalCards.phenomenon).length && shuffle(Object.entries(totalCards.phenomenon), maxPhenom)
    }
    const randomizedCards = shuffledPhenom ? shuffle([...shuffledPlanes, ...shuffledPhenom]) : shuffledPlanes
    const newDeck = randomizedCards.slice(0, totalPlayers * 10)
    return newDeck
}

export default generatePlanarDeck
