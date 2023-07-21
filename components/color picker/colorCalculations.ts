
/*
Default Color picker palettes use HSB values.
HSB = saturation along X axis (values 0-100), Brightness along Y axis(values 0-100),
Use HSB values and convert to HSL values.
Brightness to Lightness (S=saturation): L = (2 - S) * B / 2
Saturation to Lightness: L = (1 - |2B - 1|) * S
both formulas are required to convert HSB to HSL.
This App will only need lightnessFromBrightness
*/
export const brightnessToLightness = (saturation: number, brightness: number) : number => {
    const lightnessFromBrightness = (2 - saturation) * brightness / 2;
    const lightnessFromSaturation = (1 - Math.abs(2 * brightness - 1)) * saturation;

    const lightness = lightnessFromBrightness > lightnessFromSaturation
      ? lightnessFromBrightness
      : lightnessFromSaturation;
  
    // return lightness;
    return lightnessFromBrightness
  };

/*
Convert the x and y coordinates of the given point to saturation (S) and brightness (B) values in the range of 0 to 1.
Hue doesn't enter into the equation, and in this case is being controlled by ColorSlider component
*/
  const convertCoordinatesToHSB = (x: number, y : number, width : number, height: number) : number[] => {
    const saturation = x / width;
    const brightness = 1 - y / height;
    return [saturation, brightness];
  };

export default convertCoordinatesToHSB

/*
convert saturation and brightness to coordinates,
use when initially rendering color palette.
brightness to lightness conversion:
B = L + (S * min(L, 1 - L))
*/
export const convertHSLToCoordinates = (saturation: number, lightness: number, width: number, height: number): { x: number; y: number } => {
  const brightness = lightness + saturation * Math.min(lightness, 1 - lightness);
  const y = (1 - brightness) * height;
  const x = saturation * width;
  return { x, y };
};

/*
Convert the decimals derived from convertCoordinatesToHSB to whole number and rounded,
to be used in hsla(h,s,l,a) CSS syntax.
*/
export const colorValToPercent =(number: number) =>{
    return Math.round(number * 100)
}

//   const [hsbHue, hsbSaturation, hsbBrightness] = convertCoordinatesToHSB(x, y, width, height);
// const [hslHue, hslSaturation, hslLightness] = convertHSBToHSL(hue, hsbSaturation, hsbBrightness);

/*
lightness goes along x axis from 100-50
lightness goes along y axis on the left from 0-100
lightness goes along y axis on the right from 50-100
saturation goes along x axis from 0-100
hue (color) is set by slider, not by palette
*/