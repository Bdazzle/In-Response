import { StatusBar } from 'react-native';//device's stop status bar
import Navigation from './navigation/index';
import { GameProvider } from './GameContext';
import { OptionsProvider } from './OptionsContext';
import { useFonts } from "expo-font";
import React from 'react';
// import * as SplashScreen from 'expo-splash-screen';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';


// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

// SplashScreen.preventAutoHideAsync();


export default function App() {

  const [fontsLoaded] = useFonts({
    // "Mplantin": require('./assets/fonts/Mplantin.ttf'),
    "Beleren": require('./assets/fonts/Beleren2016SmallCaps-Bold.ttf'),//correct one
  })

  // useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   } else {
  //     /* 
  //     Logging 'error' from useFont() causes app to crash/stop loading
  //     I think because it doesn't initially load or something... 
  //     */
  //     console.log('error loading fonts')
  //   }
  //   console.log('loaded fonts')
  // }, [fontsLoaded]);


  return (
    <>
      <StatusBar hidden={true} />
      {fontsLoaded &&
        <>
          <OptionsProvider>
            <GameProvider>
                <Navigation />
            </GameProvider>
          </OptionsProvider>
        </>
      }
    </>
  );
}
