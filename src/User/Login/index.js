import { useState, useRef } from "react";
import { View, Image } from "react-native";
import { Paragraph, Text, TextInput, Button } from "react-native-paper";
import Keychain from 'react-native-keychain';

import Page from "../../Page";
import { getTheme, openLink, showInput, showAlert, showLoading } from "../../util";
import { login, getLoginCaptcha, getLoginInfo, getUserInfoShort } from "../../api/apis";

export default ({ navigation }) => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [buttonDisable, setButtonDisable] = useState(false);
    const [alert, setAlert] = useState(<></>);
    const ipt1 = useRef();

    async function cL() {
        if (!username || !password) {
            setAlert(showAlert("通知", <>您必須輸入學號與密碼，才得以進行下一步驟!</>, "確定", () => setAlert(<></>)));
            return;
        }
        setButtonDisable(true);

        try {
            var loginInfo = await getLoginInfo();
        } catch (err) {
            if (err.message === "Network request failed") {
                setAlert(showAlert("需要網路連線", <>登入至花中查詢必須要有網路連線!</>, "確定", () => {
                    setAlert(<></>);
                    setButtonDisable(false);
                }));
                return;
            }
        }
        if (!loginInfo.authToken) {
            setAlert(showAlert("登入失敗", <>登入失敗次數過多，請稍後再嘗試!</>, "確定", () => {
                setAlert(<></>);
                setButtonDisable(false);
            }));
            return;
        }
        var captcha = "";
        const setCap = (text) => captcha = text;
        async function close() {
            setAlert(showLoading());
            var d = await login(username, password, captcha, loginInfo.authToken);
            if (d.authtoken) {
                setAlert(<></>);
                global.accountData = {
                    token: d.authtoken
                };
                global.accountData = {
                    ...global.accountData,
                    ...(await getUserInfoShort(global.accountData.token)).data
                };
                Keychain.setGenericPassword(username, password);
                navigation.navigate("Menu");
                return;
            }
            setAlert(showAlert("登入失敗", <>伺服器回傳: {d.serverMessage}</>, "確定", () => {
                setAlert(<></>);
                setButtonDisable(false);
            }));
        }
        const cap = "data:image/png;base64," + await getLoginCaptcha(loginInfo.authToken).then(e => e.base64());
        setAlert(showInput("輸入驗證碼", <><Paragraph>您必須輸入驗證碼以登入成績查詢網站</Paragraph><Image source={{ uri: cap, width: "100%", height: 150 }} resizeMode="contain" style={{
            borderRadius: 15,
            width: "100%"
        }} /></>, {
            title: "驗證碼",
            onChangeText: setCap,
            type: "decimal-pad"
        }, "確定", close));
    }

    return (
        <>
            {alert}
            <Page
                title="登入至花中查詢"
                isBackAble={true}
                backEvent={() => navigation.goBack()}
            >
                <View>
                    <TextInput
                        label={"學號"}
                        mode="outlined"
                        style={{
                            marginBottom: 5
                        }}
                        keyboardType="decimal-pad"
                        autoFocus={true}
                        onSubmitEditing={() => ipt1.current.focus()}
                        onChangeText={(text) => setUsername(text)}
                    />
                        
                    <TextInput
                        label={"密碼"}
                        autoComplete="password"
                        keyboardType={"password"}
                        secureTextEntry={true}
                        mode="outlined"
                        style={{
                            marginBottom: 15
                        }}
                        ref={ipt1}
                        onChangeText={(text) => setPassword(text)}
                        // right={<TextInput.Icon onPress={() => setShowPassword(!showPassword)} icon={showPassword ? "eye-off" : "eye"}/>}
                    />
                    <Paragraph style={{
                        color: getTheme().colors.outline,
                        textAlign: "center"
                    }}>使用您的<Text style={{ fontWeight: "bold" }} onPress={() => openLink("http://shinher.hlhs.hlc.edu.tw/online")}>學校查詢系統帳號</Text>登入至花中查詢</Paragraph>
                    <Button
                        mode="contained"
                        onPress={cL}
                        disabled={buttonDisable}
                    >登入</Button>
                    <Paragraph style={{
                        color: getTheme().colors.outline,
                        textAlign: "center",
                    }}>登入即表示<Text style={{ fontWeight: "bold" }}>您同意將您的資料提供給花中查詢</Text>進行查詢與分析</Paragraph>
                    <Text style={{
                        fontWeight: "bold",
                        textAlign: "center"
                    }} onPress={() => openLink("https://hlhsinfo.ml/statement")}>查看我們的聲明</Text>
                </View>
            </Page>
        </>
    )
}