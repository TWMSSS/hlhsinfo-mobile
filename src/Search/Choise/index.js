import { useNavigation } from "@react-navigation/native";

import SelectCard from "../../SelectCard";
import { getTheme } from "../../util";

export default ChoiseRender = () => {
    const navigation = useNavigation();

    return <Page
        title="資料查詢"
        extraButton={
            [{
                key: "qrcode",
                icon: "qrcode-scan",
                onPress: () => navigation.navigate("QRCodeScanner")
            }]
        }
    >
        <SelectCard title="個人資料查詢" onPress={() => navigation.navigate("Profile")} style={{
            backgroundColor: getTheme().colors.onPrimary,
            color: getTheme().colors.primary
        }} />
        <SelectCard title="成績查詢" onPress={() => navigation.navigate("ScoreList")} />
        <SelectCard title="缺曠查詢" onPress={() => navigation.navigate("Lack")} />
        <SelectCard title="獎懲查詢" onPress={() => navigation.navigate("RewAndPun")} />
    </Page>;
}