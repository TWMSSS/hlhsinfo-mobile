import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import Page from "../../../Page";

export default ({ navigation }) => {
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);

    useEffect(() => {
        async function a() {
            var info = global.deviceInfo;
            var output = [];
            
            for (var g in info) {
                output.push(<View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }} key={g}>
                    <Text variant="bodyMedium">{g}:</Text>
                    <Text variant="bodyMedium">{info[g]}</Text>
                </View>);
            }

            setDisplay(output);
        }

        a();
    }, []);

    return (
        <Page title="版本資訊" isBackAble={true} backEvent={() => navigation.goBack()}>
            {display}
        </Page>
    )
}