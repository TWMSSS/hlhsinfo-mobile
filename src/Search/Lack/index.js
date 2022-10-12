import { useState, useEffect } from "react";
import { getLack } from "../../api/apis";
import { ContributionGraph } from "react-native-chart-kit";
import { Dimensions, View } from "react-native";
import { Text } from "react-native-paper";

import Page from "../../Page";
import { colorWithOpcy, getTheme, chartConfig } from "../../util";

export default Lack = ({ navigation }) => {
    const [lack, setLack] = useState();

    useEffect(() => {
        async function a() {
            const data = await getLack(global.accountData.token);
            console.log(JSON.stringify(data))
        }
        a();
    }, []);

    const commitsData = [
        { date: "2022-09-02", count: 1 },
        { date: "2022-09-03", count: 2 },
        { date: "2022-09-04", count: 3 },
        { date: "2022-09-05", count: 4 },
        { date: "2022-09-06", count: 5 },
        { date: "2022-09-31", count: 3 },
        { date: "2022-10-01", count: 2 },
        { date: "2022-10-02", count: 4 },
        { date: "2022-10-05", count: 2 },
        { date: "2022-09-30", count: 4 }
    ];

    return (
        <Page
            title="缺曠紀錄"
            isBackAble={true}
            backEvent={() => navigation.goBack()}
            style={{
                marginTop: -15
            }}
        >
            <View>
                <ContributionGraph
                    values={commitsData}
                    endDate={new Date()}
                    numDays={100}
                    width={Dimensions.get("window").width}
                    height={220}
                    chartConfig={chartConfig}
                />
            </View>
        </Page>
    )
}