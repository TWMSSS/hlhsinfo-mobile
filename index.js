/**
 * @format
 */

import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Provider as PaperProvider } from 'react-native-paper';
import BackgroundFetch from "react-native-background-fetch";
import PushNotification, { Importance } from "react-native-push-notification";

import App from './src/App';
import { getNotify } from "./src/api/apis";
import { readLocal, saveLocal } from "./src/util";

PushNotification.createChannel({
        channelId: "notification",
        channelName: "最新訊息通知",
        channelDescription: "如系統有最新通知，您將會從這裡接收到最新通知。您可以關閉此通知以停用系統通知。",
        playSound: true,
        soundName: "default",
        importance: Importance.DEFAULT,
        vibrate: true
    },
    (created) => console.log(`[HLHSInfo Push Notification] Create notification channel "notification" returned "${created}"`)
);

BackgroundFetch.configure({
    minimumFetchInterval: 15,
    stopOnTerminate: false,
    startOnBoot: true,
    enableHeadless: true,
}, async (taskID) => {
    console.log("[HLHSInfo Background Service] Background fetch started!");

    const storagedNotify = JSON.parse(await readLocal("@notify"));
    const remoteNotify = await getNotify();

    const latestRemoteNotify = remoteNotify[remoteNotify.length - 1];

    if (!storagedNotify || latestRemoteNotify.id !== storagedNotify.id && latestRemoteNotify.expire > Date.now()) {
        saveLocal("@notify", JSON.stringify(latestRemoteNotify));
        PushNotification.localNotification({
            title: latestRemoteNotify.title,
            message: latestRemoteNotify.description,
            playSound: true,
            soundName: "default",
            messageId: latestRemoteNotify.id,
            channelId: "notification"
        });
    }

    console.log("[HLHSInfo Background Service] Background fetch ended!");
    BackgroundFetch.finish(taskID);
}, (taskID) => {
    console.log("[HLHSInfo Background Service] Background fetch failed to start!");
    BackgroundFetch.finish(taskID);
});

export default function Main() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
