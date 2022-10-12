import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import {
    Text,
    Button,
} from "react-native-paper";

import Page from "../../Page";
import {
    showAlert,
    isReactFragment
} from "../../util";

export default SearchLogin = ({ route }) => {
    const navigation = useNavigation();

    function closeAlert() {
        setAlert(<></>);
        navigation.navigate("user");
    }
    // const [interval] = useState(!global.accountData ? setInterval(() => setReload(Math.floor(Math.random() * 100000)), 100) : 0);
    const [alert, setAlert] = useState(!global.accountData ? route.params.d ? showAlert("請先登入!", "請先登入花中查詢以便您查詢花蓮高中之資料。", "登入", closeAlert) : <></> : <></>);
    if (global.accountData && !isReactFragment(alert)) {
        clearInterval(interval);
        setAlert(<></>);
    }

    useEffect(() => {
        var t = setInterval(() => {
            if (global.accountData) {
                clearInterval(t);
                setAlert(<></>);
            }
        }, 100);
    }, []);

    return (
        <>
            {alert}
            <Page title="資料查詢">
                <View>
                    <Text variant="headlineLarge" style={{
                        marginBottom: 30
                    }}>請先登入</Text>
                    <Button mode="contained" onPress={() => navigation.navigate("user")}>登入</Button>
                </View>
            </Page>
        </>
    )
}