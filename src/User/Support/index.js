import { Text } from "react-native-paper";

import Page from "../../Page";

export default Support = ({ navigation }) => {
    return (
        <Page title="支持我們" isBackAble={true} backEvent={() => navigation.goBack()}>
            <Text variant="headlineMedium">即將來臨!</Text>
        </Page>
    )
}