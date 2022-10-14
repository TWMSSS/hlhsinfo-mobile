import { Dimensions, View } from "react-native";
import { WebView } from "react-native-webview";

import Page from "../Page";

export default Site = () => {
    return (
        <Page
            title="學校官網"
            style={{
                margin: 0,
                width: Dimensions.get("screen").width,
                marginTop: -15
            }}
            isNotShowBanner={true}
        >
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
                />
            </View>
                
        </Page>
    );
}