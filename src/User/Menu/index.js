import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import {
    Text,
    Card,
    Paragraph,
    Divider,
    useTheme
} from "react-native-paper";
import Keychain from 'react-native-keychain';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Page from "../../Page";
import {
    showAlert,
    showInput,
    showConfirm,
    openLink,
    removeLocal,
    showSnackBar,
} from "../../util";
import SelectCard from "../../SelectCard";
import Auth, { ErrorCode } from "../../api/Auth";

export default ({ navigation }) => {
    const theme = useTheme();
    const [username, setUsername] = useState(Auth.userData?.userName ?? Auth.userData?.schoolNumber ?? "載入中...");
    const [alert, setAlert] = useState(<></>);
    const [userImg, setUserImg] = useState(Auth.userImage
        ? <Image source={{ uri: Auth.userImage, width: 100, height: 100 }} style={{
            borderRadius: 100,
        }} />
        : <MaterialCommunityIcons name="account" size={100} style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.onPrimary,
            width: 100,
            borderRadius: 100,
        }} />
    );
    const [logined, setLogined] = useState(Auth.isLogined);

    function showSnak(desc) {
        setAlert(showSnackBar(desc, [], () => setAlert(<></>)));
    }

    function setLoginStatus(login) {
        setUsername(login ? Auth.userData?.userName?.trim().length !== 0 ? Auth.userData?.userName : Auth.userData?.schoolNumber : "登入");
        setUserImg((login && Auth.userImage !== null)
            ? <Image source={{ uri: Auth.userImage, width: 100, height: 100 }} style={{
                borderRadius: 100,
            }} />
            : <MaterialCommunityIcons name="account" size={100} style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.onPrimary,
                width: 100,
                borderRadius: 100,
            }} />)
        setLogined(login);
    }

    function logout() {
        setAlert(showConfirm("登出", "將目前已登入的帳號登出?", "登出", undefined, (choise) => {
            if (!choise) {
                setAlert(<></>);
                return;
            }

            Auth.logout();
            
            setAlert(showSnackBar("已登出當前帳號，重新輸入帳號密碼即可登入。", [], () => setAlert(<></>)));
            setLoginStatus(false);
        }))
    }

    async function b() {
        const logindata = await Keychain.getGenericPassword();
        if (logindata && !Auth.isLogined) {
            setUsername("載入中...");
            
            try {
                var captchaCode = await Auth.getCaptcha();
            } catch (err) {
                switch (err[0]) {
                    case ErrorCode.ERR_NET:
                        showSnak("需要網路連線以登入至花中查詢");
                        setLoginStatus(false);
                        setUsername("需要網路連線");
                        return;
                    
                    case ErrorCode.ERR_RICH_LIMIT:
                        showSnackBar("登入失敗次數過多，請稍後再嘗試!");
                        setLoginStatus(false);
                        return;
                }
            }
        
            var captcha = "";

            async function close() {
                setAlert(<></>);

                try {
                    await Auth.login(logindata.username, logindata.password, captcha);
                } catch (err) {
                    switch (err[0]) {
                        case ErrorCode.ERR_RESPOND:
                            setAlert(showAlert("登入失敗", <>伺服器回傳: {d.serverMessage ?? d.message}</>, "確定", () => {
                                setAlert(<></>);
                                setLoginStatus(false);
                            }));
                            return;
                    }
                }

                setLoginStatus(true);
                return;
            }

            setAlert(showInput("輸入驗證碼", <><Paragraph>您先前已經登入成功過了，現在只需要輸入驗證碼即可登入!</Paragraph><Image source={{ uri: captchaCode, height: 150 }} resizeMode="contain" style={{
                borderRadius: 15,
                width: "100%"
            }} /></>, {
                title: "驗證碼",
                onChangeText: (val) => captcha = val,
                type: "decimal-pad"
            }, "確定", close, () => {
                setAlert(<></>);
                setLoginStatus(false);
            }));

        } else if (!logindata && !Auth.isLogined) {
            setLoginStatus(false);
        }
    }

    useEffect(() => {
        Auth.event.addListener("login", log);

        function log() {
            if (!Auth.isLogined) {
                setLoginStatus(false);
                b();
            } else {
                setLoginStatus(true);
            }
        }
        log();
    }, [logined]);

    function G(prop) {
        return (<View>
            <Text variant="headlineMedium" style={{ margin: 10 }}>{prop.title}</Text>
            {prop.children}
            <Divider style={{ marginBottom: 10 }} />
        </View>);
    }

    return (
        <>
            {alert}
            <Page
                title="使用者資料"
                style={{
                    width: "100%",
                    marginTop: -15,
                }}
            >
                <Card style={{
                    height: 150,
                    backgroundColor: theme.colors.onSurface,
                    borderRadius: 0
                }} onPress={() => !global.accountData ? navigation.navigate("Login") : logout()}>
                    <View style={{
                        top: 25,
                        marginLeft: 25,
                    }}>
                        {userImg}
                    </View>
                    <Text numberOfLines={1} style={{
                        color: theme.colors.surface,
                        left: 150,
                        top: 55,
                        position: "absolute",
                        width: "60%",
                        overflow: "hidden"
                    }} variant="displaySmall">
                        {username}
                    </Text>
                </Card>
                <View style={{ margin: 15 }}>
                    <G title="快速開啟">
                        <SelectCard icon="arrow-top-right" onPress={() => openLink("http://210.62.247.21/ePortFolio/")}>學習歷程平台</SelectCard>
                        <SelectCard icon="arrow-top-right" onPress={() => openLink("https://web.jhenggao.com/iLearning/Login.aspx")}>自主學習計畫平台</SelectCard>
                        <SelectCard icon="arrow-top-right" onPress={() => openLink("http://shinher.hlhs.hlc.edu.tw/winrh/default.asp")}>重補修選課系統</SelectCard>
                        <SelectCard icon="arrow-top-right" onPress={() => openLink("http://shinher.hlhs.hlc.edu.tw/online")}>線上查詢系統</SelectCard>
                    </G>
                    <G title="開源軟體">
                        <SelectCard icon="certificate" onPress={() => navigation.navigate("License")}>開放原始碼授權</SelectCard>
                        <SelectCard icon="transit-connection-variant" onPress={() => openLink("https://github.com/TWMSSS/hlhsinfo/blob/master/HowToAnalysis.md")}>了解運行方式</SelectCard>
                        <SelectCard icon="github" onPress={() => openLink("https://github.com/TWMSSS/hlhsinfo-mobile")}>Github 專案</SelectCard>
                    </G>
                    <G title="其他">
                        <SelectCard icon="currency-usd" onPress={() => navigation.navigate("Support")}>支持我們!</SelectCard>
                        <SelectCard icon="chart-box" onPress={() => openLink("https://hlhsinfo.ml/status.html")}>伺服器狀態</SelectCard>
                        <SelectCard icon="trash-can" onPress={() => {
                            setAlert(showConfirm("清除課程表", "您確定要清除課程表? 您清除後依舊可以重新取得課程表。", "清除", "取消", async (type) => {
                                if (!type) {
                                    setAlert(<></>);
                                    return;
                                }

                                await removeLocal("@data/schedule");
                                setAlert(showAlert("清除課程表", "已清除課程表，重新啟動應用程式即可。", "確定", () => setAlert(<></>)));
                            }))
                        }}>清除課表資料</SelectCard>
                        <SelectCard icon="cog" onPress={() => navigation.navigate("Setting")}>設定</SelectCard>
                    </G>
                </View>
            </Page>
        </>
    )
}