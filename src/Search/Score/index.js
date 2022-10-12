import { useEffect, useState } from "react";
import {
    Text,
    ActivityIndicator,
    SegmentedButtons
} from "react-native-paper";
import { Dimensions, View, ScrollView, StyleSheet } from "react-native";
import { PieChart, BarChart, LineChart, ProgressChart } from "react-native-chart-kit";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getAllScores, getScore, getShared } from "../../api/apis";
import Page from "../../Page";
import { showAlert, chartConfig, getTheme, colorWithOpcy } from "../../util";
import ScoreCard from "./ScoreCard";

export default Score = ({ route, navigation }) => {
    const { score } = route.params;
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);
    const [scoreData, setScoreData] = useState({
        score: {
            data: []
        },
        type: "",
        ranking: [],
        isShared: !!0
    });
    const [alert, setAlert] = useState(<></>);
    const [displayChoise, setDisplayChoise] = useState(false);
    const [showSubject, setShowSubject] = useState("overview");
    const [subjects, setSubjects] = useState([]);
    const [isRendered, setIsRendered] = useState(false);
    const [displayName, setDisplayName] = useState("成績查詢");

    chartConfig.backgroundGradientToOpacity = 0;
    chartConfig.backgroundGradientFromOpacity = 0;
    chartConfig.propsForVerticalLabels = {
        fontSize: "30"
    }

    function mCCF(color) {
        return {
            ...chartConfig,
            color: (opcy = 1) => colorWithOpcy(color, opcy)
        };
    }

    const style = StyleSheet.create({
        f: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        d: {
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
        },
        p: {
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
            marginTop: 30
        },
        s: {
            fontWeight: "bold",
            marginLeft: 15
        },
        ss: {
            color: getTheme().colors.outline,
            marginLeft: 5,
            overflow: "hidden"
        }
    })

    function notFound() {
        setAlert(showAlert("找不到成績", "無法找尋該成績", "返回", () => {
            setAlert(<></>);
            navigation.goBack();
        }));
        return;
    }

    function sS(scoreD, tp) {
        if (!scoreD) {
            return notFound();
        }

        var ranking = [...scoreD.data];
        ranking.sort((a, b) => a.score - b.score);

        var d = {
            score: scoreD,
            type: tp,
            ranking,
            isShared: !!scoreD.userInfo
        }

        if (d.isShared) {
            setDisplayName(`${d.score.userInfo.userName ?? schoolNumber} (${d.score.userInfo.schoolNumber}) 的成績分享`)
        }

        setScoreData(d);
        setDisplayChoise(true);
        return;
    }

    function changeDisplay() {
        setIsRendered(false);
    }

    function sH(type) {
        setShowSubject(type);
        changeDisplay();
    }

    // Functions for display blocks
    function M(prop) {
        return (
            <View style={style.p}>
                {prop.children}
            </View>
        )
    }
    function MdB(prop) {
        return (<M>
            <Text variant="displayMedium" style={{
                ...style.s,
                marginLeft: 0
            }} onPress={() => sH(prop.name)}>{prop.name}</Text>
            <Text variant="headlineSmall" style={{
                ...style.ss,
                marginLeft: 0
            }}>{prop.desc}</Text>
        </M>)
    }
    function MdP(prop) {
        return (<M>
            <View style={style.f}>
                <ProgressChart
                    data={{
                        data: prop.data
                    }}
                    height={100}
                    width={100}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={true}
                />
                <View style={style.d}>
                    <Text variant="displayMedium" style={style.s}>{prop.display}</Text>
                    <Text style={style.ss}>分</Text>
                </View>
            </View>
            <Text variant="headlineSmall" style={{
                ...style.ss,
                marginLeft: 0
            }}>{prop.desc}</Text>
        </M>)
    }
    function MsP(prop) {
        return (<>
            <Text variant="headlineSmall" style={{
                margin: 15
            }}>{prop.title}</Text>
            <View style={style.f}>
                {prop.children}
            </View>
        </>)
    }
    function MdPT(prop) {
        return (<MsP title={prop.title}>
            <ProgressChart
                data={{
                    data: prop.data
                }}
                height={100}
                width={100}
                strokeWidth={16}
                radius={32}
                chartConfig={prop.chartConfig ?? chartConfig}
                hideLegend={true}
            />
            <View style={style.d}>
                <Text variant="displayMedium" style={style.s}>{prop.display}</Text>
                <Text style={style.ss}>分</Text>
            </View>
        </MsP>)
    }
    function Md(prop) {
        return (<M>
            <Text variant="headlineSmall" style={{
                ...style.ss,
                marginLeft: 0
            }}>{prop.title}</Text>
            <View style={style.d}>
                {prop.children}
            </View>
        </M>);
    }
    function Mr(prop) {
        return (<Md title={prop.title}>
            <Text style={style.ss}>第</Text>
            <Text variant="displayMedium" style={style.s}>{prop.display}</Text>
            <Text style={style.ss}>名</Text>
        </Md>);
    }
    function MrP(prop) {
        return (<Md title={prop.title}>
            <Text variant="displayMedium" style={style.s}>{prop.display}</Text>
            <Text style={style.ss}>分</Text>
        </Md>);
    }

    useEffect(() => {
        async function a() {
            if (score === "all") {
                if (!global.accountData) {
                    navigation.goBack();
                    return;
                }
                const scoreD = (await getAllScores(global.accountData.token)).data;
                return sS(scoreD, "all");
            }

            if (score.split("-").length !== 3) {
                const scoreD = (await getShared(score)).data;
                return sS(scoreD, "score");
            }

            if (!global.accountData) {
                navigation.goBack();
                return;
            }
            const ids = score.split("-");
            const scoreD = (await getScore(ids[0], ids[1], ids[2], global.accountData.token)).data;
            return sS(scoreD, "score");
        }

        a();
    }, []);

    function mD() {
        if (showSubject === "overview") {
            var maxSubj = scoreData.score.data.reduce((a, b) => {
                return (a.score > b.score) ? a : b
            });
            var minSubj =scoreData.score.data.reduce((a, b) => {
                return (a.score < b.score) ? a : b
            });
            var doc = <>
                <ScoreCard
                    subject="總覽"
                    score={<>
                        <View>
                            <MdB name={maxSubj.name} desc={<>
                                是您成績中<Text style={{
                                    color: "#36d646",
                                    fontWeight: "bold"
                                }}>最佳</Text>的科目
                            </>} />
                            <MdB name={minSubj.name} desc={<>
                                是您成績中<Text style={{
                                    color: getTheme().colors.onErrorContainer,
                                    fontWeight: "bold"
                                }}>最差</Text>的科目
                            </>} />

                            <MdP
                                data={[(Number(scoreData.score.extra.find(e => e.type === "平均").value) / 100)]}
                                display={scoreData.score.extra.find(e => e.type === "平均").value}
                                desc={<>
                                    是您的<Text style={{
                                        color: getTheme().colors.secondary
                                    }}>平均分數</Text>
                                </>} />
                            <MdP
                                data={[(Number(scoreData.score.extra.find(e => e.type === "總分").value) / (scoreData.score.data.length * 100))]}
                                display={scoreData.score.extra.find(e => e.type === "總分").value}
                                desc={<>
                                    是您的<Text style={{
                                        color: getTheme().colors.secondary
                                    }}>總分</Text>
                                </>} />
                        </View>
                    </>}
                />

                <ScoreCard
                    subject="排名"
                    score={<>
                        <Mr title="班級排名" display={scoreData.score.extra.find(e => e.type === "排名")?.value ?? "不適用"} />
                        <Mr title="年級排名" display={scoreData.score.extra.find(e => e.type === "年級排名")?.value ?? "不適用"} />
                        <Mr title="科別排名" display={scoreData.score.extra.find(e => e.type === "科別排名")?.value ?? "不適用"} />
                        <Mr title="類組排名" display={scoreData.score.extra.find(e => e.type === "類組排名")?.value ?? "不適用"} />
                    </>}
                />
            </>

            setDisplay(doc);
            return;
        }
        var subj = scoreData.score.data[scoreData.score.data.findIndex(e => e.name === showSubject)];
        var isUnpass = {
            score: scoreData.score.unpass.findIndex(e => e.name === subj.name && e.type === "score") !== -1,
            gpa: scoreData.score.unpass.findIndex(e => e.name === subj.name && e.type === "gpa") !== -1 || Number(subj.gpa) < 60
        }
        var data = {
            userAverage: Number(scoreData.score.extra.find(e => e.type === "平均").value),
            average: Number(subj.gpa),
            userScore: Number(subj.score),
            rank: scoreData.ranking.findIndex(e => e.name === subj.name) + 1
        }
        data = {
            ...data,
            userScoreAndAverage: data.userScore === data.average ? 1 : (data.userScore > data.average ? 2 : 0),
            userScoreAndUserAverage: data.userScore === data.userAverage ? 1 : (data.userScore > data.userAverage ? 2 : 0),
        }
        var doc = <>
            <ScoreCard key={subj.name + subj.score} subject={subj.name} score={<>
                <View>
                    <MdPT
                        data={[data.userScore / 100]}
                        title="您的成績"
                        display={<Text style={{
                            color: !isUnpass.score ? "" : getTheme().colors.error
                        }}>{subj.score}</Text>}
                        chartConfig={
                            !isUnpass.score ? chartConfig : mCCF(getTheme().colors.error)
                        } />
                    <MdPT
                        data={[data.average / 100]}
                        title="班級平均"
                        display={<Text style={{
                            color: !isUnpass.gpa ? "" : getTheme().colors.error
                        }}>{subj.gpa}</Text>}
                        chartConfig={
                            !isUnpass.gpa ? chartConfig : mCCF(getTheme().colors.error)
                        } />
                </View>
            </>} />

            <ScoreCard
                subject="詳細資訊"
                score={<>
                    <Mr title={<>在您<Text style={{
                        color: getTheme().colors.secondary
                    }}>所有成績中</Text>排</>} display={data.rank} />

                    <MrP title={<>與<Text style={{
                        color: getTheme().colors.secondary
                    }}>班級的平均</Text>差距</>} display={<Text style={{
                        color: data.userScoreAndAverage === 0 ? getTheme().colors.error : ""
                    }}><MaterialCommunityIcons name={
                        data.userScoreAndAverage === 2
                            ? "chevron-up"
                            : data.userScoreAndAverage !== 1
                                ? "chevron-down"
                                : "check-circle"
                    } size={45} /> {(Math.abs(data.average - data.userScore)).toFixed(2)}</Text>} />
                    <MrP title={<>與<Text style={{
                        color: getTheme().colors.secondary
                    }}>您的總平均</Text>差距</>} display={<Text style={{
                        color: data.userScoreAndUserAverage === 0 ? getTheme().colors.error : ""
                    }}><MaterialCommunityIcons name={
                        data.userScoreAndUserAverage === 2
                            ? "chevron-up"
                            : data.userScoreAndUserAverage !== 1
                                ? "chevron-down"
                                : "check-circle"
                    } size={45} /> {(Math.abs(data.userAverage - data.userScore)).toFixed(2)}</Text>} />
                </>}
            />
        </>;

        setDisplay(doc);
    }

    if (!isRendered && scoreData.type) {
        if (subjects.length === 0) {
            var t = [];
            t.push({
                value: 'overview',
                label: "總覽",
                icon: "view-dashboard",
                onPress: changeDisplay
            })
            for (var g of scoreData.score.data) {
                t.push({
                    value: g.name,
                    label: g.name,
                    onPress: changeDisplay
                });
            }

            setSubjects(t);
        }
        switch (scoreData.type) {
            case "all":
                break;
            
            case "score":
                mD();
                break;
        }
        setIsRendered(true);
    }

    return (
        <Page
            title={displayName}
            isBackAble={true}
            backEvent={() => navigation.goBack()}
        >
            {alert}
                {
                    displayChoise
                    ? <ScrollView style={{
                            overflow: "scroll",
                            width: Dimensions.get("window").width - 30,
                            marginBottom: 15
                        }} horizontal={true}>
                            <SegmentedButtons
                                value={showSubject}
                                onValueChange={setShowSubject}
                                buttons={subjects}
                                style={{
                                    overflow: "scroll",
                                    width: "100%",
                                    marginBottom: 15
                                }}
                            />
                        </ScrollView>
                    : <></>
                }
                {display}
        </Page>
    )
}