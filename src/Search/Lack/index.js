import { useState, useEffect } from "react";
import { getLack } from "../../api/apis";
import { ContributionGraph } from "react-native-chart-kit";
import { Dimensions, View, ScrollView } from "react-native";
import { Text, DataTable, Portal, Modal, useTheme } from "react-native-paper";

import Page from "../../Page";
import { chartConfig, makeNeedLoginAlert, className, showLoading, calcPage, calcFromTo } from "../../util";
import InfoCard from "../InfoCard";

export default ({ navigation }) => {
    const [lack, setLack] = useState();
    const [alert, setAlert] = useState(showLoading());
    const [page, setPage] = useState(0);
    const theme = useTheme();

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

            var record = data.data;
            record.record = record.record.reverse();

            setLack(record);
            setAlert(<></>);
        }
        a();
    }, []);

    const lackData = [];
    const lackDataDetail = [];
    const totData = [];

    function createDetail(res) {
        function hide() {
            setAlert(<></>);
        }
        function Title(prop) {
            return <Text variant="headlineSmall" style={{
                color: theme.colors.outline
            }}>{prop.children}</Text>
        }
        function Desc(prop) {
            return <Text variant="bodyLarge" style={{
                fontWeight: "bold"
            }}>{prop.children}</Text>
        }

        function Ti(prop) {
            return <View style={{
                marginBottom: 15
            }}>
                <Title>{prop.title}</Title>
                <Desc>{prop.desc}</Desc>
            </View>
        }

        const data = lack.record[res];

        setAlert(
            <Portal>
                <Modal visible={true} onDismiss={hide} contentContainerStyle={{
                    backgroundColor: theme.colors.background,
                    padding: 30,
                    margin: 20,
                    borderRadius: 30
                }}>
                    <Text variant="displaySmall">詳細資料</Text>
                    <ScrollView style={{
                        marginTop: 15
                    }}>
                        <Ti title="日期" desc={data.date} />
                        <Ti title="紀錄" desc={data.data.map((e, index) => e === null ? null : `${className(index)}: ${e}假`).filter(e => e !== null).join("\n")} />
                    </ScrollView>
                </Modal>
            </Portal>
        )
    }

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
                        color: theme.colors.outline,
                        marginLeft: 5
                    }}>節</Text>
                </View>
            </View>;
        }

        for (let i = 0; i < lack.record.length; i++) {
            var g = lack.record[i];
            lackData.push({
                date: g.date.replace(/\//gm, "-"),
                count: g.data.filter(e => e !== null).length
            });
            if (i + 1 > page * PageView && i + 1 < (page + 1) * PageView + 1) {
                lackDataDetail.push(<DataTable.Row key={Math.floor(Math.random() * 10000000)}>
                    <DataTable.Cell>{g.date}</DataTable.Cell>
                    <DataTable.Cell numeric onPress={() => createDetail(i)}>{g.data.map((e, index) => e === null ? null : `${className(index)}(${e})`).filter(e => e !== null).join(", ")}</DataTable.Cell>
                </DataTable.Row>);
            }
        }

        for (let i = 0; i < lack.total.termUp.length; i++) {
            if (lack.total.termUp[i].value > 0 || lack.total.termDown[i].value > 0) {
                totData.push(<InfoCard
                    key={Math.floor(Math.random() * 10000)}
                    title={lack.total.termUp[i].name}
                    theme={theme}
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
                    color: theme.colors.outline,
                    textAlign: "center",
                    top: -20
                }}>近100天的缺曠紀錄</Text>
            </View>

            {totData}

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>時間</DataTable.Title>
                    <DataTable.Title numeric>紀錄 (點擊看詳細)</DataTable.Title>
                </DataTable.Header>

                {lackDataDetail}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={calcPage(lack?.record.length, PageView)}
                    onPageChange={(page) => setPage(page)}
                    label={`第 ${page + 1} 頁 之 ${calcFromTo(page, lack?.record.length, PageView)}, 共 ${calcPage(lack?.record.length, PageView)} 頁 共 ${lack?.record.length ?? 0} 筆資料`}
                />
            </DataTable>
        </Page>
    )
}