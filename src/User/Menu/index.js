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
    showSnackBar
} from "../../util";
import SelectCard from "../../SelectCard";
import {
    getLoginCaptcha,
    getLoginInfo,
    getUserInfo,
    getUserInfoShort,
    login
} from "../../api/apis";

export default Menu = ({ navigation }) => {
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
            
            try {
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
            var cap = await blobToBase64(await (await getLoginCaptcha(loginToken)).blob());
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
            const setCap = (text) => captcha = text;
            setAlert(showInput("輸入驗證碼", <><Paragraph>您先前已經登入成功過了，現在只需要輸入驗證碼即可登入!</Paragraph><Image source={{ uri: cap, width: "100%", height: 150 }} resizeMode="contain" style={{
                borderRadius: 15,
                width: "100%"
            }} /></>, {
                title: "驗證碼",
                onChangeText: setCap,
                type: "decimal-pad"
            }, "確定", close));
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
        if (typeof global.accountData === "undefined") b();
    }, []);

    useEffect(() => {
        var t = setInterval(() => {
            if (typeof global.accountData === "undefined" && logined) {
                setLoginStatus(false);
                b();
            }
        }, 500);

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
                        <SelectCard title={<><MaterialCommunityIcons name="arrow-top-right" size={30} /> 學習歷程平台</>} onPress={() => openLink("http://210.62.247.21/ePortFolio/")} />
                        <SelectCard title={<><MaterialCommunityIcons name="arrow-top-right" size={30} /> 自主學習計畫平台</>} onPress={() => openLink("https://web.jhenggao.com/iLearning/Login.aspx")} />
                        <SelectCard title={<><MaterialCommunityIcons name="arrow-top-right" size={30} /> 重補修選課系統</>} onPress={() => openLink("http://shinher.hlhs.hlc.edu.tw/winrh/default.asp")} />
                        <SelectCard title={<><MaterialCommunityIcons name="arrow-top-right" size={30} /> 線上查詢系統</>} onPress={() => openLink("http://shinher.hlhs.hlc.edu.tw/online")} />
                    </G>
                    <G title="開源軟體">
                        <SelectCard title={<><MaterialCommunityIcons name="certificate" size={30} /> 開放原始碼授權</>} onPress={() => navigation.navigate("License")} />
                        <SelectCard title={<><MaterialCommunityIcons name="transit-connection-variant" size={30} /> 了解運行方式</>} onPress={() => openLink("https://github.com/TWMSSS/hlhsinfo/blob/master/HowToAnalysis.md")} />
                        <SelectCard title={<><MaterialCommunityIcons name="github" size={30} /> Github 專案</>} onPress={() => openLink("https://github.com/TWMSSS/hlhsinfo-mobile")} />
                    </G>
                    <G title="其他">
                        <SelectCard title={<><MaterialCommunityIcons name="currency-usd" size={30} /> 支持我們!</>} onPress={() => navigation.navigate("Support")} />
                        <SelectCard title={<><MaterialCommunityIcons name="chart-box" size={30} /> 伺服器狀態</>} onPress={() => openLink("https://hlhsinfo.ml/status.html")} />
                        <SelectCard title={<><MaterialCommunityIcons name="trash-can" size={30} /> 清除課表</>} onPress={() => {
                            setAlert(showConfirm("清除課程表", "您確定要清除課程表? 您清除後依舊可以重新取得課程表。", "清除", "取消", async (type) => {
                                if (!type) {
                                    setAlert(<></>);
                                    return;
                                }

                                await removeLocal("@data/schedule");
                                setAlert(showAlert("清除課程表", "已清除課程表，重新啟動應用程式即可。", "確定", () => setAlert(<></>)));
                            }))
                        }} />
                    </G>
                        
                    {/* <SelectCard title={<><MaterialCommunityIcons name="cog" size={30} /> 設定</>} /> */}
                </View>
            </Page>
        </>
    )
}