import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import {
    Text,
    Card,
    Paragraph,
    Divider
} from "react-native-paper";
import Keychain from 'react-native-keychain';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Page from "../../Page";
import {
    getTheme,
    showAlert,
    showInput,
    blobToBase64,
    showConfirm,
    openLink,
    removeLocal,
    showSnackBar,
    saveLocal
} from "../../util";
import SelectCard from "../../SelectCard";
import {
    autoGetCaptcha,
    getLoginCaptcha,
    getLoginInfo,
    getUserInfo,
    getUserInfoShort,
    login
} from "../../api/apis";

export default ({ navigation }) => {
    const [username, setUsername] = useState(global.accountData?.userName ?? global.accountData?.schoolNumber ?? "載入中...");
    const [alert, setAlert] = useState(<></>);
    const [userImg, setUserImg] = useState(global.accountData?.userImg
        ? <Image source={{ uri: global.accountData.userImg, width: 100, height: 100 }} style={{
            borderRadius: 100,
        }} />
        : <MaterialCommunityIcons name="account" size={100} style={{
            backgroundColor: getTheme().colors.primary,
            color: getTheme().colors.onPrimary,
            width: 100,
            borderRadius: 100,
        }} />
    );
    const [logined, setLogined] = useState(typeof global.accountData === "object");

    function setLoginStatus(login) {
        setUsername(login ? global.accountData?.userName.trim().length !== 0 ? global.accountData?.userName : global.accountData?.schoolNumber : "登入");
        setUserImg(login
            ? <Image source={{ uri: global.accountData.userImg, width: 100, height: 100 }} style={{
                borderRadius: 100,
            }} />
            : <MaterialCommunityIcons name="account" size={100} style={{
                backgroundColor: getTheme().colors.primary,
                color: getTheme().colors.onPrimary,
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
            
            Keychain.resetGenericPassword();
            setAlert(showSnackBar("已登出當前帳號，重新輸入帳號密碼即可登入。", [], () => setAlert(<></>)));
            setLoginStatus(false);
            global.accountData = undefined;
        }))
    }

    async function b() {
        var logindata = await Keychain.getGenericPassword();
        if (logindata && !global.accountData ||
            logindata && !global.accountData.schoolNumber) {
            
            setUsername("載入中...");
            
            try {
                var autoCaptcha = Boolean(global.config.autoCaptcha);
                var loginToken = await getLoginInfo();
            } catch (err) {
                if (err.message === "Network request failed") {
                    setAlert(showSnackBar("需要網路連線以登入至花中查詢", [], () => setAlert(<></>)));
                    setLoginStatus(false);
                    setUsername("需要網路連線");
                    return;
                }
            }
            
            if (!loginToken.authToken) {
                setAlert(showSnackBar("登入失敗次數過多，請稍後再嘗試!", [], () => setAlert(<></>)));
                setLoginStatus(false);
                return;
            }

            loginToken = loginToken.authToken;
            var captcha = "";
            async function close() {
                setAlert(<></>);
                var d = await login(logindata.username, logindata.password, captcha, loginToken);
                if (d.authtoken) {
                    global.accountData = {
                        token: d.authtoken
                    };
                    global.accountData = {
                        ...global.accountData,
                        ...(await getUserInfoShort(global.accountData.token)).data
                    };
                    setLoginStatus(true);
                    return;
                }
                setAlert(showAlert("登入失敗", <>伺服器回傳: {d.serverMessage ?? d.message}</>, "確定", () => {
                    setAlert(<></>);
                    setLoginStatus(false);
                }));
            }

            function showOptionChoise() {
                return new Promise((res) => {
                    setAlert(
                        showConfirm(
                            "免驗證碼登入",
                            <><Paragraph>現在我們開放您使用免驗證碼登入功能，我們使用圖像辨識技術來免除掉麻煩的登入步驟。現階段圖像辨識模型約有 99% 的準確率。</Paragraph></>,
                            "試用",
                            "自行輸入驗證碼",
                            res
                        )
                    )
                })
            }

            async function mCC() {
                var cap = "data:image/png;base64," + await getLoginCaptcha(loginToken).then(e => e.base64());

                setAlert(showInput("輸入驗證碼", <><Paragraph>您先前已經登入成功過了，現在只需要輸入驗證碼即可登入!</Paragraph><Image source={{ uri: cap, width: "100%", height: 150 }} resizeMode="contain" style={{
                    borderRadius: 15,
                    width: "100%"
                }} /></>, {
                    title: "驗證碼",
                    onChangeText: setCap,
                    type: "decimal-pad"
                }, "確定", close));
            }

            if (!autoCaptcha) autoCaptcha = await showOptionChoise();
            await saveLocal("@data/config", JSON.stringify({ ...global.config, autoCaptcha }));

            const setCap = (text) => captcha = text;

            if (autoCaptcha) {
                setAlert(<></>);
                try {
                    captcha = await autoGetCaptcha(loginToken);
                    close();
                } catch (err) {
                    mCC();
                }
            } else {
                mCC();
            }
        } else if (!logindata && !global.accountData) {
            setLoginStatus(false);
        }

        var t = setInterval(() => {
            async function a() {
                if (global.accountData && global.accountData.schoolNumber) {
                    clearInterval(t);
                    var data = (await getUserInfo(global.accountData.token)).data;
                    global.accountData.userImg = data.profileImg;
                    setLoginStatus(true);
                }
            };
            a();
        }, 200);
    }

    useEffect(() => {
        var t = setInterval(() => {
            if (typeof global.accountData === "undefined") {
                clearInterval(t);
                setLoginStatus(false);
                b();
            }
        }, 1000);

        return () => {
            clearInterval(t);
        }
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
                    backgroundColor: getTheme().colors.onSurface,
                    borderRadius: 0
                }} onPress={() => !global.accountData ? navigation.navigate("Login") : logout()}>
                    <View style={{
                        top: 25,
                        marginLeft: 25,
                    }}>
                        {userImg}
                    </View>
                    <Text numberOfLines={1} style={{
                        color: getTheme().colors.surface,
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
                    <G title="實用功能">
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