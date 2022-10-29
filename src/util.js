import { useRef, Fragment } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Button,
    Paragraph,
    Dialog,
    Portal,
    Modal,
    MD3DarkTheme,
    MD3LightTheme,
    TextInput,
    ActivityIndicator,
    Text,
    Snackbar
} from "react-native-paper";
import {
    Appearance,
    Linking,
    Alert,
    View,
    Image,
    Dimensions
} from "react-native";
import InAppBrowser from 'react-native-inappbrowser-reborn';

export const BOUNCE_RATE = 2000;

export const saveLocal = async (name, value) => {
    return await AsyncStorage.setItem(name, String(value));
}

export const readLocal = async (name) => {
    return await AsyncStorage.getItem(name);
}

export const removeLocal = async (name) => {
    return await AsyncStorage.removeItem(name);
}

export const showLoading = (description = "載入中...") => {
    return (
        <Portal>
            <Dialog visible={true}>
                <Dialog.Content>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <ActivityIndicator animating={true} size={40} style={{
                            marginRight: 15
                        }} />
                        <Text variant="headlineLarge" style={{
                            alignContent: "center"
                        }}>{description}</Text>
                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}

export const showAlert = (title, description, closeText = "確認", onPress = () => { }) => {
    return (
        <Portal>
            <Dialog visible={true}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>{description}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onPress}>{closeText}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export const showConfirm = (title, description, allowText = "確認", denyText = "取消", onPress = () => { }) => {
    return (
        <Portal>
            <Dialog visible={true}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>{description}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => onPress(false)}>{denyText}</Button>
                    <Button onPress={() => onPress(true)}>{allowText}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export const showInput = (title, description, input = {
    title: "",
    onChangeText: () => { },
    type: "default"
}, closeText = "確認", onPress = () => { }) => {
    return (
        <Portal>
            <Dialog visible={true}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    {/* <Paragraph> */}
                        {description}
                    {/* </Paragraph> */}
                    <TextInput
                        label={input.title}
                        onChangeText={(text) => input.onChangeText(text)}
                        mode="outlined"
                        keyboardType={input.type}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => {
                        onPress();
                    }}>{closeText}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export const showSnackBar = (content, actions, onDismiss) => {
    return (
        <Portal>
            <Snackbar
                visible={true}
                onDismiss={onDismiss}
                action={actions}
                style={{
                    marginBottom: 90
                }}
            >{content}</Snackbar>
        </Portal>
    )
}

export const isReactFragment = (variableToInspect) => {
    // https://stackoverflow.com/a/55631482
    if (variableToInspect.type) {
        return variableToInspect.type === Fragment;
    }
    return variableToInspect === Fragment;
}

export const getTheme = () => {
    return Appearance.getColorScheme() === "dark" ? MD3DarkTheme : MD3LightTheme
}

export const openLink = async (url) => {
    try {
        const isAvailable = await InAppBrowser.isAvailable();
        if (isAvailable) {
            InAppBrowser.open(url, {
                // iOS Properties
                dismissButtonStyle: 'cancel',
                preferredBarTintColor: 'gray',
                preferredControlTintColor: 'white',
                // Android Properties
                showTitle: true,
                toolbarColor: getTheme().colors.background,
                secondaryToolbarColor: 'black',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: true,
            });
        } else Linking.openURL(url);
    } catch (error) {
        Alert.alert(error.message);
    }
}

export const blobToBase64 = (blob) => {
    return new Promise((res) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result);
        reader.readAsDataURL(blob);
    });
}

export const replaceClassTime = (classString) => {
    return String(classString).replace(/第(.)節/gm, "$1");
}

export const parseColor = (input) => {
    // https://stackoverflow.com/a/21966100
    if (input.substr(0, 1) == "#") {
        var collen = (input.length - 1) / 3;
        var fact = [17, 1, 0.062272][collen - 1];
        return [
            Math.round(parseInt(input.substr(1, collen), 16) * fact),
            Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
            Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact)
        ];
    } else return input.split("(")[1].split(")")[0].split(",").map(x => +x);
}

export const colorWithOpcy = (color, opcy) => {
    const PARSE_COLOR = parseColor(color);
    return `#${Number(PARSE_COLOR[0]).toString(16)}${Number(PARSE_COLOR[1]).toString(16)}${Number(PARSE_COLOR[2]).toString(16)}${Number(Math.floor(opcy * 255)).toString(16)}`;
}

export const isHLHSInfoURL = (string) => {
    return string.startsWith("https://hlhsinfo.ml");
}

export const useDebounce = () => {
    const busy = useRef(false);

    const debounce = async (callback) => {
        setTimeout(() => {
            busy.current = false;
        }, BOUNCE_RATE);

        if (!busy.current) {
            busy.current = true;
            callback();
        }
    };

    return {
        debounce
    };
};

export const chartConfig = {
    backgroundGradientFrom: getTheme().colors.backdrop,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: getTheme().colors.onSecondary,
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => colorWithOpcy(getTheme().colors.secondary, opacity),
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
};

export const makeNeedLoginAlert = (callback) => {
    return showAlert("必須登入", "您已被伺服器登出了! 請再登入一次。", "確定", callback);
}

export const className = (classTime) => {
    var k = ["早修", "升旗", "第一節", "第二節", "第三節", "第四節", "午修", "第五節", "第六節", "第七節", "第八節", "降旗", "第九節", "第十節", "第十一節", "第十二節"];
    return k[classTime];
}

export const QRCodeDisplay = (prop = {
    onDismiss: () => { },
    data: ""
}) => {
    function Title(prop) {
        return <Text variant="headlineSmall" style={{
            color: getTheme().colors.outline
        }}>{prop.children}</Text>
    }

    return (
        <Portal>
            <Modal visible={true} onDismiss={prop.onDismiss} contentContainerStyle={{
                backgroundColor: getTheme().colors.background,
                padding: 30,
                margin: 20,
                borderRadius: 30
            }}>
                <Title>QR Code</Title>
                <View>
                    <Image source={{ uri: `https://chart.googleapis.com/chart?cht=qr&chs=512x512&chl=${prop.data}`, width: 512, height: 512 }} style={{
                        width: "100%"
                    }} resizeMode={"center"} />
                </View>
            </Modal>
        </Portal>
    )
}

export const netErrList = (err) => {
    const errList = {
        "net::ERR_INTERNET_DISCONNECTED": "需要有網路連線以開啟此網站。",
        "net::ERR_NAME_NOT_RESOLVED": "DNS伺服器無法解析此網域。",
        "net::ERR_TIMED_OUT": "網頁連線超時。",
        "net::ERR_CONNECTION_TIMED_OUT": "網頁連線超時，可能是您目前的網路環境連線速度過慢。",
        "net::ERR_CONNECTION_FAILED": "網頁連線失敗，這可能是暫時性的錯誤。",
        "net::ERR_CONNECTION_REFUSED": "連線已被重置，請再試一次。"
    };

    return errList[err] ?? `未知錯誤，請向開發者提交錯誤。錯誤ID: ${err.nativeEvent.description}`;
}