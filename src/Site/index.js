import { useState } from "react";
import { Dimensions, View } from "react-native";
import { WebView } from "react-native-webview";

import Page from "../Page";
import { showSnackBar, netErrList } from "../util";

export default Site = () => {
    const [alert, setAlert] = useState(<></>);

    function sSSB(content) {
        setAlert(showSnackBar(content, [], () => setAlert(<></>)));
    }

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
                    source={{ uri: "https://www.hlhs.hlc.edu.tw" }}
                    style={{
                        height: Dimensions.get("screen").width,
                        width: Dimensions.get("screen").width,
                        margin: 0
                    }}
                    nestedScrollEnabled
                    onError={(err) => sSSB(netErrList(err.nativeEvent.description))}
                />
            </View>
                
        </Page>
    );
}