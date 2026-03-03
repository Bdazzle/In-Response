import { ColorTheme, CounterData, DungeonData, GlobalPlayerData } from "../index"

/*
needs to  have payload value for counter data, colors, screen name, and dungeon data.
change value to generic?
*/
// export type GlobalPlayerAction = {
//     playerID: number,
//     field: string,
//     subField?: string | number
//     value: string | CounterData | ColorTheme | Partial<DungeonData> | GlobalPlayerData | boolean | number
// }

export type GlobalPlayerAction =
    | { playerID: number, field: "screenName", value: string }
    | { playerID: number, field: "colors", subField?: string, value: ColorTheme | string }
    | { playerID: number, field: "lifeTotal", value: number }
    | { playerID: number, field: "counters", subField?: string, value: CounterData | number }
    | { playerID: number, field: "remove counter", subField: string }
    | { playerID: number, field: "commanderDamage", subField: number, value: number }
    | { playerID: number, field: "dungeon", value: Partial<DungeonData> }
    | { playerID: number, field: "complete dungeon", value: boolean }
    | { playerID: number, field: "the ring", value: number }
    | { playerID: number, field: "speed", value: number }
    | { playerID: 0, field: 'init', value: GlobalPlayerData }

const globalPlayerReducer: React.Reducer<GlobalPlayerData, GlobalPlayerAction> = (state, action) => {
    switch (action.field) {
        case 'screenName': {
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    screenName: action.value
                }
            }
        };
        case 'colors': {
            /*
            if color object w/({primary: string, secondary: string}), set as colors,
            else set each primary or secondary color (for color selector menu)
            */
            if (action.subField) {
                return {
                    ...state,
                    [action.playerID]: {
                        ...state[action.playerID],

                        colors: {
                            ...state[action.playerID].colors,
                            [action.subField]: action.value
                        }
                    }
                }
            } else {
                return {
                    ...state,
                    [action.playerID]: {
                        ...state[action.playerID],
                        colors: action.value as ColorTheme
                    }
                }
            }
        };
        case "lifeTotal": {
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    lifeTotal: action.value
                }
            }
        }
        case 'counters': {
            // if subfield in action, adding new counter type
            if (action.subField) {
                return {
                    ...state,
                    [action.playerID]: {
                        ...state[action.playerID],
                        counterData: {
                            ...state[action.playerID].counterData,
                            [action.subField as string]: typeof action.value === "number" ? action.value : (action.value as CounterData)[action.subField as string]
                        }
                    }
                };
            } else {
                // if no subfield, updating all existing counters
                return {
                    ...state,
                    [action.playerID]: {
                        ...state[action.playerID],
                        counterData: action.value as CounterData
                    }
                }
            }
        };
        case 'remove counter': {
            const { [action.subField as string]: _, ...updatedCounters } = state[action.playerID].counterData!;
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    counterData: updatedCounters
                }
            };
        };
        case 'commanderDamage': {
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    commander_damage: {
                        ...state[action.playerID].commander_damage,
                        [action.subField as number]: action.value
                    }
                }
            }
        }
        case 'dungeon': {
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    dungeonData: {
                        currentDungeon: (action.value as Partial<DungeonData>).currentDungeon,
                        dungeonCoords: {
                            x: (action.value as Partial<DungeonData>).dungeonCoords!.x,
                            y: (action.value as Partial<DungeonData>).dungeonCoords!.y
                        }
                    }
                }
            }
        };
        case 'complete dungeon': {
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    dungeonData: {
                        currentDungeon: undefined,
                        dungeonCoords: undefined
                    },
                    dungeonCompleted: action.value
                }
            }
        };
        case "the ring": {
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    theRing: action.value
                }
            }
        };
        case "speed": {
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    speed: action.value
                }
            }
        }
        case 'init': {
            return {
                ...action.value as GlobalPlayerData
            }
        };
        default: return state as GlobalPlayerData
    }
}

export default globalPlayerReducer