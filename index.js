/**
 * @format
 */

import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Provider as PaperProvider } from 'react-native-paper';

import App from './src/App';
import { getNotify } from "./src/api/apis";
import { readLocal, saveLocal } from "./src/util";

export default function Main() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
