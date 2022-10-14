import { useState, useEffect } from "react";
import { getLack } from "../../api/apis";
import { ContributionGraph } from "react-native-chart-kit";
import { Dimensions, View } from "react-native";
import { Text, DataTable } from "react-native-paper";

import Page from "../../Page";
import { colorWithOpcy, getTheme, chartConfig, makeNeedLoginAlert, className } from "../../util";
import LackCard from "./LackCard";

export default Lack = ({ navigation }) => {
    const [lack, setLack] = useState();
    const [alert, setAlert] = useState(<></>);
    const [page, setPage] = useState(0);

    const PageView = 10;

    useEffect(() => {
        async function a() {
            const data = await getLack(global.accountData?.token);
            if (!data.data) {
                setAlert(makeNeedLoginAlert(() => {
                    navigation.goBack();
                    setAlert(<></>);
                    window.accountData = undefined;
                }));
                return;
            }

            setLack(data.data);
        }
        a();
    }, []);

    const lackData = [];
    const lackDataDetail = [];
    const totData = [];

    if (lack) {
        function Mk(prop) {
            return <View style={{
                marginRight: 30
            }}>
                <Text variant="headlineSmall">{prop.title}</Text>
                <View style={{
                    display: "flex",
                    alignItems: "baseline",
                    flexDirection: "row",
                    margin: 10
                }}>
                    <Text variant="displayLarge" style={{
                        fontWeight: "bold"
                    }}>{prop.value}</Text>
                    <Text variant="bodyMedium" style={{
                        color: getTheme().colors.outline,
                        marginLeft: 5
                    }}>節</Text>
                </View>
            </View>;
        }

        for (var i = 0; i < lack.record.length; i++) {
            var g = lack.record[i];
            lackData.push({
                date: g.date.replace(/\//gm, "-"),
                count: g.data.filter(e => e !== null).length
            });
            if (i + 1 > page * PageView && i + 1 < (page + 1) * PageView + 1) lackDataDetail.push(<DataTable.Row key={Math.floor(Math.random() * 10000000)}>
                <DataTable.Cell>{g.date}</DataTable.Cell>
                <DataTable.Cell numeric>{g.data.map((e, index) => e === null ? null : `${className(index)}(${e})`).filter(e => e !== null).join(", ")}</DataTable.Cell>
            </DataTable.Row>);
        }

        for (var i = 0; i < lack.total.termUp.length; i++) {
            if (lack.total.termUp[i].value > 0 || lack.total.termDown[i].value > 0) {
                totData.push(<LackCard
                    key={Math.floor(Math.random() * 10000)}
                    title={lack.total.termUp[i].name}
                    data={<>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                        }}>
                            {
                                    lack.total.termUp[i].value > 0
                                        ? <Mk title="上學期" value={lack.total.termUp[i].value} />
                                        : <></>
                                }
                                {
                                    lack.total.termDown[i].value > 0
                                        ? <Mk title="下學期" value={lack.total.termDown[i].value} />
                                        : <></>
                                }
                        </View>
                        </>}
                    />)
            }
        }
    }

    return (
        <Page
            title="缺曠紀錄"
            isBackAble={true}
            backEvent={() => navigation.goBack()}
            style={{
                marginTop: -15
            }}
        >
            {alert}
            <View>
                <ContributionGraph
                    values={lackData}
                    endDate={new Date()}
                    numDays={100}
                    width={Dimensions.get("window").width}
                    height={220}
                    chartConfig={chartConfig}
                />
                <Text variant="labelMedium" style={{
                    color: getTheme().colors.outline,
                    textAlign: "center",
                    top: -20
                }}>近100天的缺曠紀錄</Text>
            </View>

            {totData}

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>時間</DataTable.Title>
                    <DataTable.Title numeric>紀錄</DataTable.Title>
                </DataTable.Header>

                {lackDataDetail}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.round(lack?.record.length / PageView) ?? 0}
                    onPageChange={(page) => setPage(page)}
                    label={`第 ${page + 1} 頁 之 ${page * PageView + 1}-${((page + 1) * PageView) < (lack?.record.length ?? 0) ? (page + 1) * PageView : page * PageView + (lack?.record.length ?? 0) % 10}, 共 ${Math.round((lack?.record.length ?? 0) / PageView)} 頁 共 ${lack?.record.length ?? 0} 筆資料`}
                />
            </DataTable>
        </Page>
    )
}