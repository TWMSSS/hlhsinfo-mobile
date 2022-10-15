import { useEffect, useState } from "react";
import { Dimensions, Image } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import Page from "../../Page";
import ProfileCard from "./ProfileCard";
import { getUserInfo } from "../../api/apis";

export default Profile = ({ navigation }) => {
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);
    const [alert, setAlert] = useState(<></>);

    useEffect(() => {
        async function a() {
            var scores = await getUserInfo(global.accountData.token);
            if (!scores.data) {
                setAlert(makeNeedLoginAlert(() => {
                    navigation.goBack();
                    setAlert(<></>);
                    global.accountData = undefined;
                }));
                return;
            }

            scores = scores.data;

            var profileImg = <Image key="userImg" source={{ uri: scores.profileImg, height: 200, width: Dimensions.get("window").width - 18 }} resizeMode="center" style={{
                borderRadius: 20,
                marginBottom: 15
            }} />
            var list = [];
            for (var g of scores.data) {
                list.push(<ProfileCard key={g.name + Math.floor(Math.random() * 1000)} title={g.name} data={<Text variant="headlineSmall" style={{ fontWeight: "bold" }}>{g.value.trim().length !== 0 ? g.value : "(不適用)"}</Text>} />);
            }

            setDisplay([profileImg, ...list]);
        }

        a();
    }, []);

    return (
        <Page title="個人資料" isBackAble={true} backEvent={() => navigation.goBack()} style={{
            // position: "relative"
        }}>
            {alert}
            {display}
        </Page>
    )
}