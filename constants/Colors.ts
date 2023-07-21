import { HSLAVals } from "..";

export const colorLibrary: { [key: string]: string } = {
    white: "hsla(0, 0%, 100%,1)", //'rgba(255,255,255,1)',
    black: "hsla(0, 0%, 0%, 1)",//'rgba(0,0,0,1)',
    red: 'rgba(255,0,0,1)',
    green: 'rgba(0,255,0,1)',
    blue: 'rgba(0,0,255,1)',
    yellow: 'rgba(255,255,0,1)',
    purple: 'rgba(255,0,255,1)',
    vapePurple:"hsla(273, 47%, 44%, 1)", //"rgba(117,59,165,1)", //"#753BA5",
    vapeBlue: "hsla(180, 100%, 53%, 1)",//"rgba(17,255,255,1)", //"#11FFFF",
    vapeOrange: "hsla(30, 78%, 55%, 1)", //"rgba(230,142,53,1)",// '#E68E35',
    vapePink: "hsla(324, 98%, 50%, 1)", //"rgba(252,3,152,1)",//'#fc0398',
    blood: 'rgba(82,0,0,1)',
    pink: 'rgba(250,90,200,1)',
    navy: 'rgba(0,0,80,1)',
    darkGreen: 'rgba(7,47,27,1)'
}

export const startingColors = [
    { primary: colorLibrary.vapePurple, secondary: "hsla(0, 0%, 100%,1)" },
    { primary: colorLibrary.vapeBlue, secondary: "hsla(0, 0%, 100%,1)" },
    { primary: colorLibrary.vapeOrange, secondary: "hsla(0, 0%, 100%,1)" },
    { primary: colorLibrary.vapePink, secondary: "hsla(0, 0%, 100%,1)" }
]

export const gradientColors: HSLAVals[] = [
    { hue: 0, saturation: 100, lightness: 50 },
    { hue: 60, saturation: 100, lightness: 50 },
    { hue: 120, saturation: 100, lightness: 50 },
    { hue: 180, saturation: 100, lightness: 50 },
    { hue: 240, saturation: 100, lightness: 50 },
    { hue: 300, saturation: 100, lightness: 50 },
    { hue: 360, saturation: 100, lightness: 50 },
];