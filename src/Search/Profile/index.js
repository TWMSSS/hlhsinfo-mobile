import { useEffect, useState } from "react";
import { Dimensions, Image, View } from "react-native";
import { ActivityIndicator, Card, Text, useTheme } from "react-native-paper";

import Page from "../../Page";
import ProfileCard from "./ProfileCard";
import { getUserInfo } from "../../api/apis";
import { makeNeedLoginAlert } from "../../util";

export default ({ navigation }) => {
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);
    const [alert, setAlert] = useState(<></>);
    const theme = useTheme();

    useEffect(() => {
        async function a() {
            var scores = await getUserInfo(global.accountData?.token);
            if (!scores.data) {
                setAlert(makeNeedLoginAlert(() => {
                    navigation.goBack();
                    setAlert(<></>);
                    global.accountData = undefined;
                }));
                return;
            }

            scores = scores.data;

            var profileImg = <View key="userImg" style={{
                height: 200,
                width: Dimensions.get("window").width - 18,
                marginBottom: 15,
            }}>
                <Card style={{
                    borderRadius: 20,
                    backgroundColor: "#fff"
                }}>
                    <Image source={{ uri: scores.profileImg, height: 200 }} resizeMode="center" />
                </Card>
            </View>
            let list = [];
            for (let g of scores.data) {
                list.push(<ProfileCard key={g.name + Math.floor(Math.random() * 1000)} title={g.name} theme={theme} data={<Text variant="headlineSmall" style={{ fontWeight: "bold" }}>{g.value.trim().length !== 0 ? g.value : "(不適用)"}</Text>} />);
            }

            setDisplay([profileImg, ...list]);
        }

        a();
    }, []);

    return (
        <Page title="個人資料" isBackAble={true} backEvent={() => navigation.goBack()}>
            {alert}
            {display}
        </Page>
    )
}