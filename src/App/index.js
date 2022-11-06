import { useEffect } from "react";
import SplashScreen from 'react-native-splash-screen';

import Navigation from "../Navigation";

export default Home = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return <Navigation />;
};