import { HSLAVals, RGBAValues } from "../.."

// export const deriveRGBAValues = (rgbaString: string): RGBAValues | null => {
//    const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
//    const matches = regex.exec(rgbaString);

//    if (matches) {
//       const red = parseInt(matches[1], 10);
//       const green = parseInt(matches[2], 10);
//       const blue = parseInt(matches[3], 10);
//       const alpha = parseFloat(matches[4]) || 1;

//       return { red, green, blue, alpha };
//    }

//    return null;
// };

const deriveHSLAValues = (colorString: string): HSLAVals | null => {
   const regex = /hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*([\d.]+))?\)/;
   const matches = regex.exec(colorString);

   if (matches) {
      const hue  = parseInt(matches[1], 10);
      const saturation = parseFloat(matches[2]);
      const lightness = parseFloat(matches[3]);
      const alpha = parseFloat(matches[4]) || 1;

      return { hue, saturation, lightness, alpha };
   }

   return null;
};

export default deriveHSLAValues

// const convertColorTypes = (color: any, toValue: any) => {
//    let convertedColor
//    if (toValue === 'rgba') {
//       convertedColor = `rgba(${color?.red},${color?.green}, ${color?.blue}, ${color?.alpha})` as string
//    } else {
//       convertedColor = color
//    }
//    return convertedColor
// }

// export default convertColorTypes