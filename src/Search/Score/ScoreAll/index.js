import { useState, useEffect } from "react";
import { Dimensions, View } from "react-native";
import { useTheme } from "react-native-paper";
import { WebView } from "react-native-webview";

import Page from "../../../Page";
import { showSnackBar, netErrList } from "../util";

export default ({ navigation }) => {
    const [alert, setAlert] = useState(<></>);
    const [size, setSize] = useState({
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height
    });
    const theme = useTheme();

    function sSSB(content) {
        setAlert(showSnackBar(content, [], () => setAlert(<></>)));
    }

    useEffect(() => {
        Dimensions.addEventListener("change", ({ window: { width, height } }) => {
            setSize({
                height,
                width
            });
        });
    }, []);

    return (<Page
        title="所有成績"
        style={{
            margin: 0,
            width: size.width,
            marginTop: -15,
            paddingBottom: -15
        }}
        backEvent={() => navigation.goBack()}
        isBackAble={true}
    >
        {alert}
        <View style={{
            height: Dimensions.get("window").height - 192
        }}>
            <WebView
                source={{ uri: `https://hlhsinfo.ml/compare#token=${global.accountData.token}` }}
                style={{
                    height: size.width,
                    width: size.width,
                    margin: 0
                }}
                nestedScrollEnabled
                originWhitelist={['*']}
                javaScriptEnabledAndroid={true}
                onError={(err) => sSSB(netErrList(err.nativeEvent.description))}
                injectedJavaScript = {
                    `var g=(d)=>document.querySelector(d);` +
                    `var k=(b)=>g(b).style.display="none";` +
                    `k("header");k("footer");k("#notify");k("#pathName");` +
                    `g("body").style.backgroundColor="${theme.colors.background}";` +
                    `g("section > .md").style.width="95%";`
                }
            />
        </View>
    </Page>);
}