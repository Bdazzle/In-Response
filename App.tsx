import { StatusBar } from 'react-native';
import Navigation from './navigation/index';
import { GameProvider } from './GameContext';
import { OptionsProvider } from './OptionsContext';
import { useFonts } from "expo-font";


export default function App() {
  const [fontsLoaded] = useFonts({
    "Beleren": require('./assets/fonts/Beleren2016SmallCaps-Bold.ttf')
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <>
      <StatusBar hidden={true} />
      <OptionsProvider>
        <GameProvider>
          <Navigation />
        </GameProvider>
      </OptionsProvider>
    </>
  );
}