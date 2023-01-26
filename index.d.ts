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

export type PlanarData = {
    currentPlane: string,
    deck: string[],
    discard: string[]
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

export interface PlayerData {
    colors: ColorScheme,
    screenName: string,
    dungeonData?: Partial<DungeonData>,
    dungeonCompleted?: boolean,
    counterData?: CounterData,
    citysBlessing?: boolean,
    lifeTotal: number,
    commander_tax: number,
    commander_damage:{
        [key: number] : number
    }
}

export type CounterCardProps = {
    counterType: string
    playerID: number
    currentCounters?: number
}

export type CountersProps = {
    playerID: number
}

export type GlobalPlayerData = {
    [key: number] : PlayerData
}

export type AllScreenNavProps = CompositeNavigationProp<
NativeStackNavigationProp<StartMenuStackParamList, keyof StartMenuStackParamList>,
NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>,
NativeStackNavigationProp<GlobalMenuParamsList, keyof GlobalMenuParamsList>
>

export type StartMenuStackNavProps = NativeStackNavigationProp<StartMenuStackParamList, keyof StartMenuStackParamList>

