import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ImageSourcePropType } from "react-native";
import { GlobalMenuParamsList } from "./navigation";

declare module '*.jpg';
declare module '*.png';

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
    // completedDungeon: boolean,
    colors: ColorScheme,
    screenName: string,
    dungeonData?: Partial<DungeonData>,
    dungeonCompleted?: boolean,
    counterData?: CounterData,
    lifeTotal: number,
    commander_damage:{
        [key: number] : number
    } | undefined
}

export type CounterCardProps = {
    counterType: string
    playerID: number
    // imageSource: ImageSourcePropType,
    currentCounters?: number
}

export type CountersProps = {
    playerID: number
}

export type GlobalPlayerData = {
    [key: number] : PlayerData
}


// export type PlayerStackParamList = {
//     [key: string]: undefined;
//     // Card: undefined
// }

// NativeStackNavigationProp<MenuStackParamList, keyof MenuStackParamList> | NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;
export type AllScreenNavProps = CompositeNavigationProp<
NativeStackNavigationProp<StartMenuStackParamList, keyof StartMenuStackParamList>,
NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>,
NativeStackNavigationProp<GlobalMenuParamsList, keyof GlobalMenuParamsList>
>

export type StartMenuStackNavProps = NativeStackNavigationProp<StartMenuStackParamList, keyof StartMenuStackParamList>

