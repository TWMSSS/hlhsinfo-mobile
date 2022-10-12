import React, { useEffect, useState } from "react";
import SplashScreen from 'react-native-splash-screen';

import Navigation from "../Navigation";
import AppIntro from '../AppIntro';
import { readLocal } from "../util";

export default Home = () => {
    const [display, setDisplay] = useState(<Navigation />);

    useEffect(() => {
        async function a() {
            var g = await readLocal("@app/intro");
            if (!g) setDisplay(<AppIntro />);
            SplashScreen.hide();
        }
        a();
    }, [])

    return display;
};