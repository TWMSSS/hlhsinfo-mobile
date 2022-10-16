import { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

import { getTheme } from '../util';
import Schedule from '../Schedule';
import Search from '../Search';
import User from '../User';
import QRCodeScanner from '../QRCodeScanner';
import Site from '../Site';

export default Navigation = () => {
    const HomeComponent = ({ navigation }) => {
        const [openedLink, setOpenedLink] = useState("");

        function gI(s, nFI, fI) {
            return <MaterialCommunityIcons style={{
                color: getTheme().colors.onBackground
            }} size={24} name={s ? nFI : fI } />;
        }

        useEffect(() => {
            Linking.addEventListener('url', ({ url }) => {
                setOpenedLink(url);
                url = url.split("//")[1];

                navigation.navigate("Home", {
                    screen: "search",
                    params: {
                        screen: "Score",
                        params: {
                            score: url.split("/")[2]
                        },
                        initial: false
                    }
                });
            })

            async function a() {
                var u = await Linking.getInitialURL();
                if (u === null || u === openedLink) return;

                setOpenedLink(u);
                u = u.split("//")[1];

                navigation.navigate("Home", {
                    screen: "search",
                    params: {
                        screen: "Score",
                        params: {
                            score: u.split("/")[2]
                        },
                        initial: false
                    }
                });
            }

            a();

            return () => {
                Linking.removeAllListeners("url");
            }
        })

        return (
            <Tab.Navigator initialRouteName="schedule" sceneAnimationEnabled={true}>
                <Tab.Screen name="schedule" component={Schedule} options={{
                    title: "課程表",
                    tabBarIcon: (tabItem) => gI(tabItem.focused, "clock-time-three", "clock-time-three-outline")
                }} />
                <Tab.Screen name="search" component={Search} options={{
                    title: "資料查詢",
                    tabBarIcon: (tabItem) => gI(tabItem.focused, "account-details", "account-details-outline")
                }} />
                <Tab.Screen name="site" component={Site} options={{
                    title: "學校官網",
                    tabBarIcon: (tabItem) => gI(tabItem.focused, "earth", "earth")
                }} />
                <Tab.Screen name="user" component={User} options={{
                    title: "使用者",
                    tabBarIcon: (tabItem) => gI(tabItem.focused, "account-circle", "account-circle-outline")
                }} />
            </Tab.Navigator>
        )
    }

    return (
        <NavigationContainer theme={getTheme()}>
            <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: true }} initialRouteName="Home">
                <Stack.Screen name='Home' component={HomeComponent} options={{
                    animationEnabled: true
                }} />
                <Stack.Screen name='QRCodeScanner' component={QRCodeScanner} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};