import { Text, Card } from "react-native-paper";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Page from "../../Page";
import LicenseFile from "./LICENSES.json";
import { getTheme } from "../../util";

export default License = ({ navigation }) => {
    return (
        <Page
            title="開放原始碼授權"
            isBackAble={true}
            backEvent={() => navigation.goBack()}
        >
            <View style={{
                marginBottom: 30,
                backgroundColor: getTheme().colors.primaryContainer,
                padding: 20,
                borderRadius: 32
            }}>
                <Text variant="displaySmall">花中查詢</Text>
                <Text variant="displayLarge" style={{ color: "#37b2d4" }}>使用了 <Text style={{ fontWeight: "bold", color: "#fc6b03" }}>{LicenseFile.length}</Text> 個</Text>
                <Text variant="displayLarge" style={{ color: "#d49a37" }}><MaterialCommunityIcons name="github" size={50} />開源項目</Text>
                <Text variant="displaySmall">來</Text>
                <Text variant="displayMedium" style={{ color: "#37d470" }}><MaterialCommunityIcons name="code-tags" size={50} /> 開發</Text>
                <Text variant="labelSmall">(如果要全部計算的話，花中查詢使用了超過 <Text style={{ fontWeight: "bold", color: "#fc6b03" }}>1000</Text> 個開源套件，不過都是引用來引用去的)</Text>
                <Text>我們感謝這些項目的開發者們， 讓我們得以開發花中查詢。</Text>
            </View>
            <View>
                <Text variant="headlineLarge">原始碼授權</Text>
                {
                    LicenseFile.map(e => {
                        return (
                            <Card key={`${e.name}@${e.installedVersion}-${e.author}`} style={{
                                marginBottom: 15,
                                fontFamily: "monospace"
                            }}>
                                <Card.Content>
                                    <Text variant="labelMedium" style={{
                                        fontWeight: "bold",
                                        fontFamily: "monospace",
                                        marginBottom: 10
                                    }}>{e.name}@{e.installedVersion} - {e.author}</Text>
                                    <Text>License: <Text style={{ fontWeight: "bold", fontFamily: "monospace" }}>{e.licenseType}</Text></Text>
                                    <Text>Git: <Text style={{ fontWeight: "bold", fontFamily: "monospace" }}>{e.link}</Text></Text>
                                </Card.Content>
                            </Card>
                        )
                    })
                }
            </View>
        </Page>
    )
}