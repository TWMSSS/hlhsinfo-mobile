import { useState, useRef, useEffect } from "react";
import { Dimensions, View, BackHandler } from "react-native";
import { WebView } from "react-native-webview";

import Page from "../Page";
import { showSnackBar, netErrList, openLink } from "../util";

export default Site = () => {
    const [alert, setAlert] = useState(<></>);
    const webviewRef = useRef(false);

    function sSSB(content) {
        setAlert(showSnackBar(content, [], () => setAlert(<></>)));
    }

    const handleBackButtonPress = () => {
        try {
            webviewRef.current?.goBack();
        } catch (err) {
            console.log("[WebView Back Handler] Error : ", err.message);
        }
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress)
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonPress)
        };
    }, []);

    return (
        <Page
            title="學校官網"
            style={{
                margin: 0,
                width: Dimensions.get("screen").width,
                marginTop: -15,
                paddingBottom: -15
            }}
            isNotShowBanner={true}
        >
            {alert}
            <View style={{
                height: Dimensions.get("window").height - 192
            }}>
                <WebView
                    ref={webviewRef}
                    source={{ uri: "https://www.hlhs.hlc.edu.tw" }}
                    style={{
                        height: Dimensions.get("screen").width,
                        width: Dimensions.get("screen").width,
                        margin: 0
                    }}
                    nestedScrollEnabled
                    onError={(err) => sSSB(netErrList(err.nativeEvent.description))}
                    onShouldStartLoadWithRequest={(event) => {
                        if (event.navigationType === "click") {
                            if (!event.url.match(/(www\.hlhs\.hlc\.edu\.tw\/*)/gm)) {
                                openLink(event.url);
                                return false;
                            }
                            return true;
                        }

                        return true;
                    }}
                />
            </View>
                
        </Page>
    );
}