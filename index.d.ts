import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ImageSourcePropType } from "react-native";
import { GlobalMenuParamsList } from "./navigation";

// export type SubNavigator<T extends ParamListBase> = {
//     [K in keyof T]: { screen: K; params?: T[K] };
//   }[keyof T];

// export type NestedNavigatorParams<ParamList> = {
//     [K in keyof ParamList]: undefined extends ParamList[K]
//       ? { screen: K; params?: ParamList[K] }
//       : { screen: K; params: ParamList[K] }
//   }[keyof ParamList]

type PlanarData = {
    currentPlane: PlaneCard,
    deck: PlaneCard[],
    discard: PlaneCard[],
    // images : PlaneProps
}

type PlaneChaseSet = {
    [set: string] : PlanarDeck
}

type PlaneCard = [string, ImageSourcePropType]

type PlaneProps = {
    [key: string]: ImageSourcePropType
}

type PlanarDeck = {
       planes: PlaneProps;
       phenomenon : PlaneProps
}

export type StoredData =  [string, string | null][] | readonly KeyValuePair[]

export type DungeonData = {
    playerID: number
    currentDungeon: string | undefined;
    dungeonCoords: {
        x: number;
        y: number;
    } | undefined
}

export type ColorTheme = {
    primary: string;
    secondary: string
}

export type CounterData = {
    [key: string] : number
}

export type Dimensions = {
    height: number,
    width: number
}
export interface PlayerData {
    colors: ColorTheme,
    screenName: string,
    dungeonData?: Partial<DungeonData>,
    dungeonCompleted?: boolean,
    counterData?: CounterData,
    // citysBlessing?: boolean,
    theRing?: number,
    speed?: number,
    lifeTotal: number,
    commander_tax: number,
    commander_damage:{
        [key: number] : number
    }
}

export type CounterCardProps = {
    card: string
    playerID?: number
    currentCounters?: number
}

export type CountersProps = {
    playerID: number
}

export type GlobalPlayerData = {
    [key: string | number] : PlayerData
}

export type AllScreenNavProps = CompositeNavigationProp<
NativeStackNavigationProp<StartMenuStackParamList, keyof StartMenuStackParamList>,
NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>,
NativeStackNavigationProp<GlobalMenuParamsList, keyof GlobalMenuParamsList>
>

export type StartMenuStackNavProps = NativeStackNavigationProp<StartMenuStackParamList, keyof StartMenuStackParamList>

export type RGBAValues = {
    red: number,
    green: number,
    blue: number,
    alpha: number
}

/*
number & { __wholeNumber: never } = typeguard to represent type has to be whole number
*/
export type HSLAVals = {
    hue: number,
    saturation: number,
    lightness: number,
    alpha? : number
}


// Helper type to extract the `[key: string]: string` part of Card
/**
 * 'keyof T' gets all the keys of the type T as a union of string literals (like 'name' of Card)
 * iterates over the keys of T and includes only those keys where the value is a string.
 * [K in keyof T as ...] iterates over each key K in keyof T and applies the condition after as.
 * [... T[K] extends string ? K : never] conditional check :
 *   If T[K] is a string, it keeps the key K.
 *   If T[K] is not a string, it replaces the key with never (which effectively removes it)
 * [...]: T[K] - specifies the value type for each key K, which will always be string 
 * because non-strings have already been filtered out with "T[K] extends string ? K : never"
 */
type StringProperties<T> = {
    [K in keyof T as T[K] extends string ? K : never]: T[K];
  };

interface CardData {
    image_uris? : { [key : string] : string };
    card_faces? :  {[key: string] : Card};
    lang:string
    oracle_text : string;
    printed_text: string;
    set: string;
    oracle_id: string;
    set_name: string
}
interface Card extends CardData {
    [key: string]:  string | number | boolean | Card;
    /**
     * properties explicitly extracted from scryfall data are the following:
     */
    set_icon_svg_uri? : string
    rules?: Rulings;
}

/**
 * optional data of ScryFallCard is used, but restructured/reassigned
 */
interface ScryFallCard extends CardData {
    [key: string]:  string | number | boolean | ScryFallCard;
    name: string;
    set_uri:string;
    rulings_uri: string
}

// [key : string] : Omit<Card, 'name'>[]
    // [cardName : string] : Card[];
type CombinedCards  = {
    [cardName : string] : {
        versions: Card[];
        rules: Rulings
    }
}

type ScryResultData  = ScryFallCard[]

type Rulings = {
    [key: number] :{
        // source: string;
        // published_at: string;
        comment: string
    }
}