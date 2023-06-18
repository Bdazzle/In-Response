
export const ColorLibrary: { [key: string]: string } = {
    white: 'rgba(255,255,255,1)',
    black: 'rgba(0,0,0,1)',
    red :   'rgba(255,0,0,1)',
    green: 'rgba(0,255,0,1)',
    blue: 'rgba(0,0,255,1)',
    yellow: 'rgba(255,255,0,1)',
    purple: 'rgba(255,0,255,1)',
    vapePurple: "rgba(117,59,165,1)", //"#753BA5",
    vapeBlue: "rgba(17,255,255,1)", //"#11FFFF",
    vapeOrange:"rgba(230,142,53,1)",// '#E68E35',
    vapePink: "rgba(252,3,152,1)",//'#fc0398',
    blood : 'rgba(82,0,0,1)',
    pink: 'rgba(250,90,200,1)',
    navy: 'rgba(0,0,80,1)',
    darkGreen : 'rgba(7,47,27,1)'
}

export const startingColors = [
    { primary: ColorLibrary.vapePurple, secondary: 'rgba(255,255,255,1)' },
    { primary: ColorLibrary.vapeBlue, secondary: 'rgba(255,255,255,1)' },
    { primary: ColorLibrary.vapeOrange, secondary: 'rgba(255,255,255,1)' },
    { primary: ColorLibrary.vapePink, secondary: 'rgba(255,255,255,1)' }
  ]