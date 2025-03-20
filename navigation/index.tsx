
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Game } from '../screens/Game';
import { CounterCardProps, CountersProps, DungeonData } from '..';
import LifeMenu from '../screens/StartMenus/GameType';
import TotalPlayers from '../screens/StartMenus/TotalPlayers';
import PlayerOptions from '../screens/StartMenus/PlayerOptions';
import ColorMenu, { ColorMenuProps } from '../screens/StartMenus/ColorMenu';
import ColorSelector, { ColorSelectorProps } from '../screens/StartMenus/ColorSelector';
import Dungeon from '../screens/Dungeon';
import CounterCard from '../screens/CounterCard';
import GlobalMenu from '../screens/GlobalMenu';
import CoinFlipper from '../screens/MainMenu/CoinFlipper';
import DiceRoller from '../screens/MainMenu/DiceRoller';
import Planechase from '../screens/MainMenu/Planechase';
import Instructions from '../screens/MainMenu/Instructions';
import Counters from '../screens/Counters';
import SearchCosumer from '../search/SearchConsumer';
import PlanechaseOptions from '../screens/PlanechaseOptions';

export default function Navigation() {

  return (
    <NavigationContainer
    // linking={LinkingConfiguration}
    // theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />

    </NavigationContainer>
  );
}

export type RootStackParamList = {
  StartMenu: undefined;
  GlobalMenu: undefined;
  Game: { menu: boolean };
  Dungeon: DungeonData;
  Card: CounterCardProps;
  Counters: CountersProps
}

export type StartMenuStackParamList = {
  Life: undefined;
  TotalPlayers: undefined;
  PlayerOptions: undefined;
  ColorMenu: ColorMenuProps;
  ColorSelector: ColorSelectorProps;
}

export type PlaneMenuStackParamList = {
  "Plane Options" : { options : string[] };
  PlanarDeck : undefined
}

const PlaneMenuStack = createNativeStackNavigator<PlaneMenuStackParamList>();

function PlaneMenuNavigator() {
  return (
    <PlaneMenuStack.Navigator screenOptions={{
      headerShown: false,
      animation: 'none'
    }}>
      <PlaneMenuStack.Screen name="Plane Options" component={PlanechaseOptions} />
      <PlaneMenuStack.Screen name="PlanarDeck" component={Planechase} />
    </PlaneMenuStack.Navigator>
  )
}

const StartMenuStack = createNativeStackNavigator<StartMenuStackParamList>();

function StartMenuNavigator() {
  return (
    <StartMenuStack.Navigator screenOptions={{
      headerShown: false,
      animation: 'none'
    }}>
      <StartMenuStack.Screen name="Life" component={LifeMenu} />
      <StartMenuStack.Screen name="TotalPlayers" component={TotalPlayers} />
      <StartMenuStack.Screen name='PlayerOptions' component={PlayerOptions} />
      <StartMenuStack.Screen name='ColorMenu' component={ColorMenu} />
      <StartMenuStack.Screen name="ColorSelector" component={ColorSelector} />
    </StartMenuStack.Navigator>
  )
}

export type GlobalMenuParamsList = {
  MainMenu: undefined,
  CoinFlipper: undefined,
  DiceRoller: undefined,
  Planechase: undefined,
  Instructions: undefined,
  Search: undefined
}

const GlobalMenuStack = createNativeStackNavigator<GlobalMenuParamsList>()

function GlobalMenuNavigator() {
  return (
    <GlobalMenuStack.Navigator screenOptions={{
      headerShown: false,
      animation: 'none'
    }}>
      <GlobalMenuStack.Screen name="MainMenu" component={GlobalMenu} />
      <GlobalMenuStack.Screen name="CoinFlipper" component={CoinFlipper} />
      <GlobalMenuStack.Screen name="DiceRoller" component={DiceRoller} />
      <GlobalMenuStack.Screen name="Planechase" component={PlaneMenuNavigator} />
      <GlobalMenuStack.Screen name="Instructions" component={Instructions} />
      <GlobalMenuStack.Screen name="Search" component={SearchCosumer} />
    </GlobalMenuStack.Navigator>
  )
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animation: 'none'
    }}>
      <Stack.Screen name="GlobalMenu" component={GlobalMenuNavigator} />
      <Stack.Screen name="Game" component={Game} initialParams={{}} />
      <Stack.Screen name="StartMenu" component={StartMenuNavigator} />
      <Stack.Screen name="Dungeon" component={Dungeon} initialParams={{}} />
      <Stack.Screen name="Card" component={CounterCard} initialParams={{}} />
      <Stack.Screen name="Counters" component={Counters} />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
