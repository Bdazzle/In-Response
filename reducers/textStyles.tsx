
export interface TextSizes {
    [key: string]: {
        // life: {
        //     textSize: number,
        //     // lineHeight: number
        // },
        name: number,
        counters: {
            textSize: number,
            // lineHeight: number
        }
    }
}

export interface TextActionParams {
    playerNumber: number,
    parentHeight: number,
    parentWidth:number,
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
                    // life: {
                    //     textSize: action.decimalPlaces < 3 ? textScaler(235) : textScaler(171)
                    //     // textSize: action.decimalPlaces < 3 ? action.parentHeight * .75 : action.parentHeight * .6,
                    //     // lineHeight : 300,
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .15 : action.parentHeight * .1,
                        // lineHeight: 50
                    }
                }
            };

        case 2: {
            return {
                1: {
                    // life: {
                    //     // textSize: action.decimalPlaces < 3 ? action.parentWidth * .5 : action.parentWidth * .35,
                    //     textSize: action.decimalPlaces < 3 ? textScaler(170) : textScaler(118)
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .15 : action.parentHeight * .09,
                        // lineHeight: 50
                    }
                },
                2: {
                    // life: {
                    //     // textSize: action.decimalPlaces < 3 ? action.parentWidth * .5 : action.parentWidth * .35,
                    //     // lineHeight: 300
                    //     textSize: action.decimalPlaces < 3 ? textScaler(170) : textScaler(118)
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .15 : action.parentHeight * .07,
                        // lineHeight: 50
                    }
                }
            }
        };

        case 3: {
            return {
                1: {
                    // life:  {
                    //     // textSize: action.decimalPlaces < 3 ? action.parentHeight * .7 : action.parentHeight * .6,
                    //     textSize: action.decimalPlaces < 3 ? textScaler(120) : textScaler(110)
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .175 : action.parentHeight * .09,
                        // lineHeight: 30
                    }
                },
                2: {
                    // life: {
                    //     // textSize: action.decimalPlaces < 3 ? action.parentHeight * .7 : action.parentHeight * .6,
                    //     textSize: action.decimalPlaces < 3 ? textScaler(120) : textScaler(110)
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .175 : action.parentHeight * .09,
                        // lineHeight: 30
                    }
                },
                3: {
                    // life: {
                    //     // textSize: action.decimalPlaces < 3 ? action.parentHeight * .7 : action.parentHeight * .5,
                    //     textSize: action.decimalPlaces < 3 ? textScaler(120) : textScaler(110)
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.decimalPlaces < 2 ? action.parentHeight * .15 : action.parentHeight * .125,
                        // lineHeight: 35
                    }
                }
            }
        };

        case 4: {
            return {
                1: {
                    // life: {
                    //     // textSize: action.decimalPlaces < 3 ? action.parentHeight * .7 :  action.parentHeight * .6,
                    //     textSize:  action.decimalPlaces < 3 ? textScaler(120) : textScaler(85) 
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.parentHeight * .175,
                    }
                },
                2: {
                    // life: {
                    //     // textSize: action.decimalPlaces < 3 ? action.parentHeight * .7 :  action.parentHeight * .6,
                    //     textSize:  action.decimalPlaces < 3 ? textScaler(120) : textScaler(85) 
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.parentHeight * .175,
                    }
                },
                3: {
                    // life:{
                    //     // textSize: action.decimalPlaces < 3 ? action.parentHeight * .7 :  action.parentHeight * .6,
                    //     textSize: action.decimalPlaces < 3 ? textScaler(120) : textScaler(85) 
                    // },
                    name: action.parentHeight * .13,
                    counters: {
                        textSize: action.parentHeight * .175,
                    }
                },
                4: {
                    // life: {
                    //     // textSize: action.decimalPlaces < 3 ? action.parentHeight * .7 :  action.parentHeight * .6,
                    //     textSize: action.decimalPlaces < 3 ? textScaler(120) : textScaler(85) 
                    // },
                    name: action.parentHeight * .13,
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
