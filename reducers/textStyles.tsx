
export interface TextSizes {
    [key: string]: {
        counters: {
            textSize: number,
        }
    }
}

export interface TextActionParams {
    playerNumber: number,
    parentHeight: number,
    decimalPlaces: number
}

/*
case is total number of players.
return key is player designation number.
*/

export const textSizeReducer = (state: TextSizes, action: TextActionParams) => {
    switch (action.playerNumber) {
        case 1:
            return {
                1: {
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .15 : action.parentHeight * .1,
                    }
                }
            };

        case 2: {
            return {
                1: {
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .15 : action.parentHeight * .09,
                    }
                },
                2: {
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .15 : action.parentHeight * .07,
                    }
                }
            }
        };

        case 3: {
            return {
                1: {
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .175 : action.parentHeight * .09,
                    }
                },
                2: {
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .175 : action.parentHeight * .09,
                    }
                },
                3: {
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .15 : action.parentHeight * .125,
                    }
                }
            }
        };

        case 4: {
            return {
                1: {
                    counters: {
                        textSize: action.parentHeight * .175,
                    }
                },
                2: {
                    counters: {
                        textSize: action.parentHeight * .175,
                    }
                },
                3: {
                    counters: {
                        textSize: action.parentHeight * .175,
                    }
                },
                4: {
                    counters: {
                        textSize: action.parentHeight * .175,
                    }
                }
            }
        }
        default:
            return state
    }
}
