import { useEffect, useState } from "react";
import { DataTable, Text, Modal, Portal, useTheme } from "react-native-paper";
import { View, ScrollView } from "react-native";
import { getRewAndPun } from "../../api/apis";

import Page from "../../Page";
import InfoCard from "../InfoCard";
import Auth from "../../api/Auth";
import { makeNeedLoginAlert, showLoading, calcPage, calcFromTo } from "../../util";

export default ({ navigation }) => {
    const [record, setRecord] = useState();
    const [alert, setAlert] = useState(showLoading());
    const [page, setPage] = useState(0);
    const theme = useTheme();
    const PageView = 10;
    
    useEffect(() => {
        async function a() {
            var t = await Auth.callAPI(getRewAndPun);
            if (!t.data) {
                setAlert(makeNeedLoginAlert(() => {
                    navigation.goBack();
                    setAlert(<></>);
                    window.accountData = undefined;
                }));
                return;
            }

            t.data.detail = t.data.detail.map(e => {
                return {
                    ...e,
                    id: Math.floor(Math.random() * 10000000)
                }
            }).reverse();

            setRecord(t.data);
            setAlert(<></>);
        }
        a();
    }, []);

    const status = [];
    const detail = [];

    function createDetail(id) {
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

        const data = record.detail[id];

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
                        <Ti title="懲處類別" desc={data.type} />
                        <Ti title="起始日期" desc={data.start} />
                        <Ti title="簽署日期" desc={data.signed} />
                        <Ti title="懲處原因" desc={data.reason} />
                        <Ti title="懲處方式" desc={data.execute} />
                    </ScrollView>
                </Modal>
            </Portal>
        )
    }

    if (record) {
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
                    }}>支</Text>
                </View>
            </View>;
        }

        for (var i = 0; i < record.status.length; i++) {
            if (record.status[i].times > 0 || record.status[i].times > 0) {
                status.push(<InfoCard
                    key={Math.floor(Math.random() * 10000)}
                    title={record.status[i].type}
                    theme={theme}
                    data={
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                        }}>
                            <Mk title="總計" value={record.status[i].times} />
                        </View>
                    }
                    />)
            }
        }

        for (let i = 0; i < record.detail.length; i++) {
            var g = record.detail[i];
            if (i + 1 > page * PageView && i + 1 < (page + 1) * PageView + 1) {
                var d = <DataTable.Row key={g.id}>
                    <DataTable.Cell>{g.start}</DataTable.Cell>
                    <DataTable.Cell>{g.signed}</DataTable.Cell>
                    <DataTable.Cell numeric>{g.type}</DataTable.Cell>
                    <DataTable.Cell key={Math.round(Math.random() * 65814)} numeric onPress={() => createDetail(i)}>詳細資料</DataTable.Cell>
                </DataTable.Row>;
                detail.push(d);
            }
        }
    }

    return (
        <Page
            title="懲處紀錄"
            isBackAble={true}
            backEvent={() => navigation.goBack()}
        >
            {alert}
            {status}

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>日期</DataTable.Title>
                    <DataTable.Title>簽署日期</DataTable.Title>
                    <DataTable.Title numeric>類型</DataTable.Title>
                    <DataTable.Title numeric>詳細資料</DataTable.Title>
                </DataTable.Header>

                {detail}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={calcPage(record?.detail.length, PageView)}
                    onPageChange={(page) => setPage(page)}
                    label={`第 ${page + 1} 頁 之 ${calcFromTo(page, record?.detail.length, PageView)}, 共 ${calcPage(record?.detail.length, PageView)} 頁 共 ${record?.detail.length ?? 0} 筆資料`}
                />
            </DataTable>
        </Page>
    );
}