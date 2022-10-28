import { useEffect, useState } from "react";
import SplashScreen from 'react-native-splash-screen';
import BackgroundFetch from "react-native-background-fetch";
import PushNotification, { Importance } from "react-native-push-notification";

import Navigation from "../Navigation";
import AppIntro from '../AppIntro';
import { readLocal, saveLocal } from "../util";
import { getNotify } from "../api/apis";

export default Home = () => {
    const [display, setDisplay] = useState(<Navigation />);

    useEffect(() => {
        async function a() {
            var g = await readLocal("@app/intro");
            if (!g) setDisplay(<AppIntro />);
            SplashScreen.hide();
        }
        a();
    }, []);

    useEffect(() => {
        PushNotification.createChannel({
                channelId: "notification",
                channelName: "最新訊息通知",
                channelDescription: "如系統有最新通知，您將會從這裡接收到最新通知。您可以關閉此通知以停用系統通知。",
                playSound: true,
                soundName: "default",
                importance: Importance.DEFAULT,
                vibrate: true
            },
            (created) => console.log(`[HLHSInfo Push Notification] createChannel returned '${created}'`)
        );

        BackgroundFetch.configure({
            minimumFetchInterval: 15,
            stopOnTerminate: false,
            startOnBoot: true,
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
            BackgroundFetch.finish(taskID)
        });
    }, []);

    return display;
};