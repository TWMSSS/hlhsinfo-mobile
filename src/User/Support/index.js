import { Text } from "react-native-paper";

import Page from "../../Page";
import { getTheme, openLink } from "../../util";

export default Support = ({ navigation }) => {
    return (
        <Page title="支持我們" isBackAble={true} backEvent={() => navigation.goBack()}>
            <Text variant="headlineMedium">即將來臨!</Text>
            <Text variant="labelSmall" style={{
                color: getTheme().colors.outline
            }}>(如果我再不做好這個功能，我就要吃西北風了。架設花中查詢需要的VPS吃了我很多錢。<Text onPress={() => openLink("https://docs.google.com/spreadsheets/d/1Zd4euyVrNzV1RjcTbENpQTRMQWgw-BV_FbppCjVCBic/view")}>詳情請看此Excel表格。</Text>)</Text>
        </Page>
    )
}