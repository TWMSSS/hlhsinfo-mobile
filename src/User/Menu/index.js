import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import {
    Text,
    Card,
    Paragraph
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
    openLink
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
            setAlert(<></>);
            setLoginStatus(false);
            global.accountData = undefined;
        }))
    }

    async function b() {
        var logindata = await Keychain.getGenericPassword();
        if (logindata && !global.accountData ||
            logindata && !global.accountData.schoolNumber) {
            var loginToken = (await getLoginInfo()).authToken;
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
            function setCap(text) {
                captcha = text;
            }
            setAlert(showInput("輸入驗證碼", <><Paragraph>您先前已經登入成功過了，現在只需要輸入驗證碼即可登入!</Paragraph><Image source={{ uri: cap, width: "100%", height: 150 }} resizeMode="contain" style={{
                borderRadius: 15,
                width: "100%"
            }} /></>, {
                title: "驗證碼",
                onChangeText: setCap
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
                <View style={{
                    // height: 300,
                    margin: 15
                }}>
                    <SelectCard title={<><MaterialCommunityIcons name="currency-usd" size={30} /> 支持我們!</>} onPress={() => navigation.navigate("Support")} />
                    <SelectCard title={<><MaterialCommunityIcons name="chart-box" size={30} /> 伺服器狀態</>} onPress={() => openLink("https://hlhsinfo.ml/status.html")} />
                    <SelectCard title={<><MaterialCommunityIcons name="certificate" size={30} /> 開放原始碼授權</>} onPress={() => navigation.navigate("License")} />
                    <SelectCard title={<><MaterialCommunityIcons name="github" size={30} /> Github 專案</>} onPress={() => openLink("https://github.com/TWMSSS/hlhsinfo-mobile")} />
                    {/* <SelectCard title={<><MaterialCommunityIcons name="cog" size={30} /> 設定</>} /> */}
                </View>
            </Page>
        </>
    )
}