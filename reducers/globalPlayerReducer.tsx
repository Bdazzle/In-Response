import { ColorTheme, CounterData, DungeonData, GlobalPlayerData } from ".."

/*
needs to  have payload value for counter data, colors, screen name, and dungeon data.
change value to generic?
*/
export type GlobalPlayerAction = {
    playerID: string | number,
    field: string,
    subField?: string | number
    value: string | CounterData | ColorTheme | Partial<DungeonData> | GlobalPlayerData | boolean | number
}

const globalPlayerReducer = (state: GlobalPlayerData, action: GlobalPlayerAction) => {
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
            return {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    /*
                    if color object w/({primary: string, secondary: string}), set as colors,
                    else set each primary or secondary color (for color selector menu)
                    */
                    colors: !action.subField ? action.value
                        :
                        {
                            ...state[action.playerID].colors,
                            [action.subField] : action.value
                        }
                }
            }
        };
        case "lifeTotal":{
            return {
                ...state,
                [action.playerID]:{
                    ...state[action.playerID],
                    lifeTotal: action.value
                }
            }
        }
        case 'counters': {
            return action.subField ? {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    counterData: {
                        ...state[action.playerID].counterData,
                        [action.subField as string]: action.value
                    }
                }
            } 
            :
            {
                ...state,
                [action.playerID]: {
                    ...state[action.playerID],
                    counterData: action.value
                }
            }
        };
        case 'remove counter':{
            delete state[action.playerID].counterData![action.subField as string]
        };
        case 'commanderDamage' :{
            return {
                ...state,
                [action.playerID]:{
                    ...state[action.playerID],
                    commander_damage:{
                        ...state[action.playerID].commander_damage,
                        [action.subField as number] : action.value
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
        case "the ring" :{
            return {
                ...state,
                [action.playerID] :{
                    ...state[action.playerID],
                    theRing: action.value
                }
            }
        };
        case "speed" :{
            return {
                ...state,
                [action.playerID] :{
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
        default: return state
    }
}

export default globalPlayerReducer