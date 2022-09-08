// import { registerRootComponent } from 'expo';
import 'expo/build/Expo.fx';
import { AppRegistry, Platform } from 'react-native';
import { createRoot } from 'react-dom/client';
import withExpoRoot from 'expo/build/launch/withExpoRoot';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);

/*
Above does not run correctly as of React 18
*/
AppRegistry.registerComponent('main', () => withExpoRoot(App));
if ('web' === Platform.OS) {
    const rootTag = createRoot(document.getElementById('root') ?? document.getElementById('main'));

    const RootComponent = withExpoRoot(App);
    rootTag.render(<RootComponent />);
}
