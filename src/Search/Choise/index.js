import { useState, useEffect } from "react";
import { View } from "react-native";
import {
    Text,
    Button,
    Divider,
    useTheme
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import SelectCard from "../../SelectCard";
import { showAlert, showSnackBar, showLoading } from "../../util";
import { cleanCache } from "../../api/apis";
import Page from "../../Page";
import Auth from "../../api/Auth";

export default ({ route }) => {
    const navigation = useNavigation();
    const [logined, setLogined] = useState(Auth.isLogined);
    const theme = useTheme();

    function closeAlert() {
        setAlert(<></>);
        navigation.navigate("user");
    }
    const [alert, setAlert] = useState(!Auth.isLogined ? route.params.d ? showAlert("請先登入!", "請先登入花中查詢以便您查詢花蓮高中之資料。", "登入", closeAlert, closeAlert) : <></> : <></>);

    useEffect(() => {
        if (!Auth.isLogined) {
            Auth.event.addListener("login", (status) => {
                if (status) {
                    setAlert(<></>);
                    setLogined(true);
                }
            });
        }
    }, []);

    return logined
        ? <>
            {alert}
            <Page
                title="資料查詢"
                extraButton={
                    [{
                        key: "qrcode",
                        icon: "qrcode-scan",
                        onPress: () => navigation.navigate("QRCodeScanner")
                    }]
                }
            >
                <SelectCard onPress={() => navigation.navigate("Profile")} style={{
                    backgroundColor: theme.colors.onPrimary,
                    color: theme.colors.primary
                }}>個人資料查詢</SelectCard>
                <SelectCard onPress={() => navigation.navigate("ScoreList")}>成績查詢</SelectCard>
                <SelectCard onPress={() => navigation.navigate("Lack")}>缺曠查詢</SelectCard>
                <SelectCard onPress={() => navigation.navigate("RewAndPun")}>獎懲查詢</SelectCard>

                <Divider style={{
                    marginBottom: 5
                }} />

                <SelectCard icon="trash-can" onPress={async () => {
                    if (!global.accountData?.token) return setAlert(showSnackBar("請先登入!", [], () => setAlert(<></>)));

                    setAlert(showLoading());
                    await Auth.clearCache();
                    setAlert(showSnackBar("已清除伺服器快取!", [], () => setAlert(<></>)))
                }}>清除伺服器快取</SelectCard>
            </Page>
        </>
        : <>
            {alert}
            <Page title="資料查詢">
                <View>
                    <Text variant="headlineLarge" style={{
                        marginBottom: 30
                    }}>請先登入</Text>
                    <Button mode="contained" onPress={() => navigation.navigate("user")}>登入</Button>
                </View>
            </Page>
        </>;
}