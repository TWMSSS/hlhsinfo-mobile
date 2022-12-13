import { useState, useRef, useEffect } from "react";
import { Dimensions, View, BackHandler } from "react-native";
import { WebView } from "react-native-webview";

import Page from "../Page";
import { showSnackBar, netErrList, openLink } from "../util";

export default () => {
    const [alert, setAlert] = useState(<></>);
    const [size, setSize] = useState({
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height
    });
    const [canGoBack, setCanGoBack] = useState(false);
    const webviewRef = useRef(false);

    function sSSB(content) {
        setAlert(showSnackBar(content, [], () => setAlert(<></>)));
    }

    const handleBackButtonPress = () => {
        try {
            if (!canGoBack) return false;

            webviewRef.current?.goBack();
            return true;
        } catch (err) {
            console.log("[WebView Back Handler] Error : ", err.message);
        }
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonPress);
        };
    }, [canGoBack]);

    useEffect(() => {
        Dimensions.addEventListener("change", ({ window: { width, height } }) => {
            setSize({
                height,
                width
            });
        });
    }, []);

    return (
        <Page
            title="學校官網"
            style={{
                margin: 0,
                width: size.width,
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
                        height: size.width,
                        width: size.width,
                        margin: 0
                    }}
                    nestedScrollEnabled
                    onError={(err) => sSSB(netErrList(err.nativeEvent.description))}
                    setSupportMultipleWindows={false}
                    onNavigationStateChange={(event) => {
                        setCanGoBack(event.canGoBack);
                    }}
                    onShouldStartLoadWithRequest={(event) => {
                        if (!event.url.startsWith("https://www.hlhs.hlc.edu.tw/")) {
                            openLink(event.url);
                            return false;
                        }
                        return true;
                    }}
                />
            </View>
                
        </Page>
    );
}