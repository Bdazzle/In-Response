import { Animated, StatusBar, StyleSheet, useWindowDimensions } from 'react-native';//device's stop status bar
import Navigation from './navigation/index';
import { GameProvider } from './GameContext';
import { OptionsProvider } from './OptionsContext';
import { useFonts } from "expo-font";
import React, { useEffect, useRef, useState } from 'react';
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

/** app.json "plugins" splash screen config:
   [
        "expo-splash-screen",
        {
          "resizeMode" : "contain",
          "backgroundColor": "#ffffff",
          "image": "./assets/appIcons/splash/Color_Wheel_android.png",
          "dark": {
            "image": "./assets/appIcons/splash/Color_Wheel_android.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 400,
          "logoWidth" : 400
        }
      ]
 */

interface AnimatedSpalshProps {
  onAnimationComplete: () => void
}

const AnimatedSpalsh: React.FC<AnimatedSpalshProps> = ({ onAnimationComplete }) => {
  const spinValue = useRef(new Animated.Value(0)).current
  const fadeValue = useRef(new Animated.Value(1)).current//1 = started faded in
  const { width } = useWindowDimensions()

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      })
    ).start()

    setTimeout(() => {
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true
      }).start(() => onAnimationComplete())
    })
  }, [])

  const spin = spinValue.interpolate({
    inputRange: [0, 0.3, 0.4, 1],//treated like %
    outputRange: ['0deg','0deg', '-40deg', '360deg']
  })

  return (
    <Animated.View style={styles.container}>
      <Animated.Image
        style={[styles.logo, { 
          transform: [{ rotate: spin }], 
          opacity: fadeValue,
          height: width,
          width,
          maxWidth: 400,
          maxHeight: 400
        }
      ]}
        source={require('./assets/appIcons/splash/Color_Wheel.png')}
      />
    </Animated.View>
  );
}


export default function App() {
  const [loading, setLoading] = useState<boolean>(true)
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
      {fontsLoaded ?
        <>
          {
            loading ? <AnimatedSpalsh onAnimationComplete={() => setLoading(false)} />
              :
              <OptionsProvider>
                <GameProvider>
                  <Navigation />
                </GameProvider>
              </OptionsProvider>
          }
        </>
        : null
      }
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logo: {
    // backgroundColor:'black',
    // width: 400,
    // height: 400,
  },
});