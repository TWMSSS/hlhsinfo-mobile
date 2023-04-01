import { useState, useRef } from "react";
import { View, Image } from "react-native";
import { Paragraph, Text, TextInput, Button, Checkbox, useTheme } from "react-native-paper";

import Page from "../../Page";
import Auth, { ErrorCode } from "../../api/Auth";
import { openLink, showInput, showAlert, showLoading } from "../../util";

export default ({ navigation }) => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [saveAccount, setSaveAccount] = useState(true);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [alert, setAlert] = useState(<></>);
    const theme = useTheme();
    const ipt1 = useRef();

    function showAl(title, desc) {
        setAlert(showAlert(title, <>{desc}</>, "確定", () => {
            setAlert(<></>);
            setButtonDisable(false);
        }));
    }

    async function cL() {
        setButtonDisable(true);
        if (!username || !password) {
            showAl("通知", "您必須輸入學號與密碼，才得以進行下一步驟!");
            return;
        }

        try {
            var captchaImage = await Auth.getCaptcha();
        } catch (err) {
            switch (err[0]) {
                case ErrorCode.ERR_NET:
                    showAl("需要網路連線", "登入至花中查詢必須要有網路連線!");
                    return;
                
                case ErrorCode.ERR_RICH_LIMIT:
                    showAl("登入失敗", "登入失敗次數過多，請稍後再嘗試!");
                    return;
            }
        }

        var captcha = "";

        async function close() {
            setAlert(showLoading());

            try {
                await Auth.login(username, password, captcha, saveAccount);
            } catch (err) {
                switch (err[0]) {
                    case ErrorCode.ERR_RESPOND:
                        showAl("登入失敗", `伺服器回傳: ${err[1]}`);
                        return;
                }
            }

            setAlert(<></>);

            navigation.navigate("Menu");
        }
        setAlert(showInput("輸入驗證碼", <><Paragraph>您必須輸入驗證碼以登入成績查詢網站</Paragraph><Image source={{ uri: captchaImage, height: 150 }} resizeMode="contain" style={{
            borderRadius: 15,
            width: "100%"
        }} /></>, {
            title: "驗證碼",
            onChangeText: (text) => captcha = text,
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
                        // keyboardType={"password"}
                        secureTextEntry={true}
                        mode="outlined"
                        style={{
                            marginBottom: 15
                        }}
                        ref={ipt1}
                        onChangeText={(text) => setPassword(text)}
                        // right={<TextInput.Icon onPress={() => setShowPassword(!showPassword)} icon={showPassword ? "eye-off" : "eye"}/>}
                    />
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}><Checkbox status={saveAccount ? "checked" : "unchecked"} onPress={() => setSaveAccount(!saveAccount)} /><Text>儲存登入狀態</Text></View>
                    <Paragraph style={{
                        color: theme.colors.outline,
                        textAlign: "center"
                    }}>使用您的<Text style={{ fontWeight: "bold" }} onPress={() => openLink("http://shinher.hlhs.hlc.edu.tw/online")}>學校查詢系統帳號</Text>登入至花中查詢</Paragraph>
                    <Button
                        mode="contained"
                        onPress={cL}
                        disabled={buttonDisable}
                    >登入</Button>
                    <Paragraph style={{
                        color: theme.colors.outline,
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