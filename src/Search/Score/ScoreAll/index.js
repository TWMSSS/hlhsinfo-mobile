import { useState } from "react";
import { Dimensions, View } from "react-native";
import { WebView } from "react-native-webview";

import Page from "../../../Page";
import { showSnackBar, netErrList } from "../util";

export default ScoreAll = ({ navigation }) => {
    const [alert, setAlert] = useState(<></>);

    function sSSB(content) {
        setAlert(showSnackBar(content, [], () => setAlert(<></>)));
    }

    return (<Page
        title="所有成績"
        style={{
            margin: 0,
            width: Dimensions.get("screen").width,
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
                    height: Dimensions.get("screen").width,
                    width: Dimensions.get("screen").width,
                    margin: 0
                }}
                nestedScrollEnabled
                originWhitelist={['*']}
                javaScriptEnabledAndroid={true}
                onError={(err) => sSSB(netErrList(err.nativeEvent.description))}
                injectedJavaScript={'var g=(d)=>document.querySelector(d); var k=(b)=>g(b).style.display="none"; k("header");k("footer");k("#notify");k("#pathName");'}
            />
        </View>
    </Page>);
}