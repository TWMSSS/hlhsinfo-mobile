import { useEffect, useState } from "react";
import { DataTable, Text, Modal, Portal } from "react-native-paper";
import { View, ScrollView } from "react-native";
import { getRewAndPun } from "../../api/apis";

import Page from "../../Page";
import InfoCard from "../InfoCard";
import { makeNeedLoginAlert, getTheme, showLoading, calcPage, calcFromTo } from "../../util";

export default ({ navigation }) => {
    const [record, setRecord] = useState();
    const [alert, setAlert] = useState(showLoading());
    const [page, setPage] = useState(0);
    const PageView = 10;
    
    useEffect(() => {
        async function a() {
            var t = await getRewAndPun(window.accountData?.token);
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
                color: getTheme().colors.outline
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
                    backgroundColor: getTheme().colors.background,
                    padding: 30,
                    margin: 20,
                    borderRadius: 30
                }}>
                    <Text variant="displaySmall">????????????</Text>
                    <ScrollView style={{
                        marginTop: 15
                    }}>
                        <Ti title="????????????" desc={data.type} />
                        <Ti title="????????????" desc={data.start} />
                        <Ti title="????????????" desc={data.signed} />
                        <Ti title="????????????" desc={data.reason} />
                        <Ti title="????????????" desc={data.execute} />
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
                        color: getTheme().colors.outline,
                        marginLeft: 5
                    }}>???</Text>
                </View>
            </View>;
        }

        for (var i = 0; i < record.status.length; i++) {
            if (record.status[i].times > 0 || record.status[i].times > 0) {
                status.push(<InfoCard
                    key={Math.floor(Math.random() * 10000)}
                    title={record.status[i].type}
                    data={
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                        }}>
                            <Mk title="??????" value={record.status[i].times} />
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
                    <DataTable.Cell key={Math.round(Math.random() * 65814)} numeric onPress={() => createDetail(i)}>????????????</DataTable.Cell>
                </DataTable.Row>;
                detail.push(d);
            }
        }
    }

    return (
        <Page
            title="????????????"
            isBackAble={true}
            backEvent={() => navigation.goBack()}
        >
            {alert}
            {status}

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>??????</DataTable.Title>
                    <DataTable.Title>????????????</DataTable.Title>
                    <DataTable.Title numeric>??????</DataTable.Title>
                    <DataTable.Title numeric>????????????</DataTable.Title>
                </DataTable.Header>

                {detail}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={calcPage(record?.detail.length, PageView)}
                    onPageChange={(page) => setPage(page)}
                    label={`??? ${page + 1} ??? ??? ${calcFromTo(page, record?.detail.length, PageView)}, ??? ${calcPage(record?.detail.length, PageView)} ??? ??? ${record?.detail.length ?? 0} ?????????`}
                />
            </DataTable>
        </Page>
    );
}