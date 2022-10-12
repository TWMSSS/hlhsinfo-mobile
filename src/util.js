import { useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Button,
    Paragraph,
    Dialog,
    Portal,
    Provider,
    MD3DarkTheme,
    MD3LightTheme,
    TextInput
} from "react-native-paper";
import {
    Appearance,
    Linking,
    Alert
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
    onChangeText: () => { }
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

export const isReactFragment = (variableToInspect) => {
    // https://stackoverflow.com/a/55631482
    if (variableToInspect.type) {
        return variableToInspect.type === React.Fragment;
    }
    return variableToInspect === React.Fragment;
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
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            res(fileReader.result);
        };
        fileReader.readAsDataURL(blob);
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