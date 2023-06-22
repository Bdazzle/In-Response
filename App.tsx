import { StatusBar } from 'react-native';//device's stop status bar
import Navigation from './navigation/index';
import { GameProvider } from './GameContext';
import { OptionsProvider } from './OptionsContext';
import { useFonts } from "expo-font";
import React, { useCallback } from 'react';
// import * as SplashScreen from 'expo-splash-screen';

/*
TO DO/NOTES
*)npx expo start. other cli commands not working?
*) build command for apk: eas build -p android --profile preview
  -eas build uses .gitignore to access files, so change access to assets files after build so it's not uploaded to github
*) Animated.View prevents any child components onPress and onLongPress from firing normally,
  Because the touch event is intercepted by the Animated API. 
  Swipeable components from React Native Gesture Handler used instead.
*) example of passing variables to StyleSheet as function: CommanderDamageTracker
*) implement a better reset (like in commander tax tracker) to improve performance? (may be unnecessary)
*) all rotated screens have a Y difference of 70, this might be device related or aspect ratio related?
*) Create options for a less busy display (options for Static Counter, maybe Incremental counters later)
*) move player translates to a reducer or hooks?
*) customizeable color inputs?
*) additional tax for commander if partners/backgrounds?
*) Add mechanics options screen, to have a less busy UI.
*) for coin flipper, dice roller, etc. Navigates only to game. 
  navigate to menu if no game is instantiated

*) check text scaling functions to see if using component width instead of component height will refactor into clearer code 
1) TABLET TO DO:
*) Add expo-device checks to textScaler function and The Ring overlay
*/

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
