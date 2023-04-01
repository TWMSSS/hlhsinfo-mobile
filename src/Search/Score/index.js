import { useEffect, useState, useRef } from "react";
import {
    Text,
    ActivityIndicator,
    SegmentedButtons,
    useTheme
} from "react-native-paper";
import { Dimensions, View, ScrollView, LayoutAnimation } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Share from "react-native-share";

import { getScore, getShared, getSharedImage, shareScore, shareScoreImage } from "../../api/apis";
import Page from "../../Page";
import { showAlert, makeNeedLoginAlert, showLoading, QRCodeDisplay } from "../../util";
import InfoCard from "../InfoCard";
import * as ScoreUtil from "./util";
import Auth from "../../api/Auth";

export default ({ route, navigation }) => {
    const { score } = route.params;
    const [scoreData, setScoreData] = useState({
        thisScore: {
            score: {
                data: []
            },
            type: "",
            ranking: [],
            isShared: !!0,
            scoreID: "",
            scoreAna: {},
            maxSubject: "",
            minSubject: "",
            totalScore: 0
        },
        bfScore: {}
    });
    const [alert, setAlert] = useState(<></>);
    const [showSubject, setShowSubject] = useState("overview");
    const [subjects, setSubjects] = useState([]);
    const [displayName, setDisplayName] = useState("成績查詢");
    const [bottomSheetStatus, setBottomSheetStatus] = useState(-1);

    const theme = useTheme();

    var display = <ActivityIndicator animating={true} />;

    const bottomSheetRef = useRef();

    function notFound() {
        setAlert(showAlert("找不到成績", "無法找尋該成績", "返回", () => {
            setAlert(<></>);
            navigation.goBack();
        }));
        return;
    }

    function showBottomSheets() {
        bottomSheetRef.current.expand();
    }

    async function sS(scoreD, tp, scoreID) {
        if (!scoreD || scoreD.data.length === 0) {
            return notFound();
        }

        const scoreBefore = Auth.scoreList.filter(e => e.type === 1) || [];
        const thisS = scoreBefore.findIndex(e => e.year === scoreID[0] && e.term === scoreID[1] && e.times === scoreID[2]);

        function dtl(scoreData) {
            var ranking = [...scoreData.data];
            ranking.sort((a, b) => Number(b.score) - Number(a.score));

            var d = {
                score: scoreData,
                type: tp,
                ranking,
                isShared: !!scoreData.userInfo,
                scoreID,
                scoreAna: {},
                maxSubject: "",
                minSubject: "",
                totalScore: 0
            };

            d.score.extra = d.score.extra.map(e => {
                return { type: e.type, value: e.value === "" ? undefined : e.value };
            });

            d.maxSubject = d.score.data.reduce((a, b) => {
                return (a.score > b.score) ? a : b
            }).name;
            d.minSubject = d.score.data.reduce((a, b) => {
                return (a.score < b.score) ? a : b
            }).name;

            for (var h of d.score.data) {
                const useravg = Number(d.score.extra.find(e => e.type === "平均").value);
                var data = {
                    userAverage: useravg === useravg ? useravg : 0,
                    average: Number(h.gpa),
                    userScore: Number(h.score),
                    rank: d.ranking.findIndex(e => e.name === h.name) + 1,
                    isUnpass: {
                        score: d.score.unpass.findIndex(e => e.name === h.name && e.type === "score") !== -1,
                        gpa: d.score.unpass.findIndex(e => e.name === h.name && e.type === "gpa") !== -1 || Number(h.gpa) < 60
                    },
                    userScoreAndAverage: 1,
                    userScoreAndUserAverage: 1,
                }
                data.userScoreAndAverage = data.userScore === data.average ? 1 : (data.userScore > data.average ? 2 : 0);
                data.userScoreAndUserAverage = data.userScore === data.userAverage ? 1 : (data.userScore > data.userAverage ? 2 : 0);

                d.scoreAna[h.name] = data;
            }

            return d;
        }

        var thisScore = dtl(scoreD);
        var bfScore;

        if (thisS > 0 && !thisScore.isShared) {
            var g = scoreBefore[thisS - 1];
            bfScore = await Auth.callAPI(getScore, g["year"], g["term"], g["times"], g["testID"]).then(e => e.data);
        } else if (thisScore.isShared) {
            setDisplayName(`${thisScore.score.userInfo.userName ?? schoolNumber} (${thisScore.score.userInfo.schoolNumber}) 的成績分享`);
        }

        setScoreData({
            thisScore,
            bfScore
        });
        return;
    }

    function sH(type) {
        setShowSubject(type);
    }

    function createQRCodeDisplay(qrcode) {
        function hide() {
            setAlert(<></>);
        }
        setAlert(<QRCodeDisplay onDismiss={hide} data={qrcode} />);
    }

    useEffect(() => {
        async function a() {
            if (score.split("-").length !== 4) {
                const scoreD = (await getShared(score)).data;
                return sS(scoreD, "score", score);
            }

            if (!Auth.isLogined) {
                navigation.goBack();
                return;
            }
            const ids = score.split("-");
            const scoreD = await Auth.callAPI(getScore, ids[0], ids[1], ids[2], ids[3]);
            if (!scoreD.data) {
                setAlert(makeNeedLoginAlert(() => {
                    navigation.goBack();
                    setAlert(<></>);
                    window.accountData = undefined;
                }));
                return;
            }

            return sS(scoreD.data, "score", ids);
        }

        a();
    }, []);

    function mD() {
        const thm = Object.assign({}, theme);
        LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.spring,
            duration: 200
        });

        if (showSubject === "overview") {
            var maxSubj = scoreData.thisScore.score.data.find(e => e.name === scoreData.thisScore.maxSubject);
            var minSubj = scoreData.thisScore.score.data.find(e => e.name === scoreData.thisScore.minSubject);

            const average = Number(scoreData.thisScore.score.extra.find(e => e.type === "平均").value);
            const total = Number(scoreData.thisScore.score.extra.find(e => e.type === "總分").value);
            display = <>
                <InfoCard
                    title="總覽"
                    theme={thm}
                    data={<>
                        <View>
                            <ScoreUtil.MdB name={maxSubj.name} desc={<>
                                是您成績中<Text style={{
                                    color: "#36d646",
                                    fontWeight: "bold"
                                }}>最佳</Text>的科目
                            </>} onPress={() => sH(maxSubj.name)} />
                            <ScoreUtil.MdB name={minSubj.name} desc={<>
                                是您成績中<Text style={{
                                    color: theme.colors.onErrorContainer,
                                    fontWeight: "bold"
                                }}>最差</Text>的科目
                            </>} onPress={() => sH(minSubj.name)} />

                            <ScoreUtil.MdP
                                data={[((average === average ? average : 0) / 100)]}
                                display={average === average ? String(average) : "不適用"}
                                desc={<>
                                    是您的<Text style={{
                                        color: theme.colors.secondary
                                    }}>平均分數</Text>
                                </>} />
                            <ScoreUtil.MdP
                                data={[((average === average ? average : 0) / 100)]}
                                display={total === total ? String(total) : "不適用"}
                                desc={<>
                                    是您的<Text style={{
                                        color: theme.colors.secondary
                                    }}>總分</Text>
                                </>} />
                        </View>
                    </>}
                />

                <InfoCard
                    title="排名"
                    theme={thm}
                    data={<>
                        <ScoreUtil.Mr title="班級排名" display={scoreData.thisScore.score.extra.find(e => e.type === "排名")?.value ?? "不適用"} />
                        <ScoreUtil.Mr title="年級排名" display={scoreData.thisScore.score.extra.find(e => e.type === "年級排名")?.value ?? "不適用"} />
                        <ScoreUtil.Mr title="科別排名" display={scoreData.thisScore.score.extra.find(e => e.type === "科別排名")?.value ?? "不適用"} />
                        <ScoreUtil.Mr title="類組排名" display={scoreData.thisScore.score.extra.find(e => e.type === "類組排名")?.value ?? "不適用"} />
                    </>}
                />
            </>;
            return;
        }

        var subj = scoreData.thisScore.score.data.find(e => e.name === showSubject);
        var data = scoreData.thisScore.scoreAna[showSubject];
        display = <>
            <InfoCard key={subj.name + subj.score} title={subj.name} theme={thm} data={<>
                <View>
                    <ScoreUtil.MdPT
                        data={[(data.userScore / 100)]}
                        title="您的成績"
                        display={<Text style={{
                            color: !data.isUnpass.score ? "" : theme.colors.error,
                            fontWeight: "bold"
                        }} >{subj.score}</Text>}
                        chartConfig={
                            !data.isUnpass.score ? ScoreUtil.getChartConfig() : ScoreUtil.mCCF(theme.colors.error)
                        } />
                    <ScoreUtil.MdPT
                        data={[(data.average / 100)]}
                        title="班級平均"
                        display={<Text style={{
                            color: !data.isUnpass.gpa ? "" : theme.colors.error,
                            fontWeight: "bold"
                        }}>{subj.gpa}</Text>}
                        chartConfig={
                            !data.isUnpass.gpa ? ScoreUtil.getChartConfig() : ScoreUtil.mCCF(theme.colors.error)
                        } />
                </View>
            </>} />

            <InfoCard
                title="詳細資訊"
                theme={thm}
                data={<>
                    <ScoreUtil.Mr title={<>在您<Text style={{
                        color: theme.colors.secondary
                    }}>所有成績中</Text>排</>} display={data.rank} />

                    <ScoreUtil.MrD type="班級的平均" scoreType={data.userScoreAndAverage} score={(Math.abs(data.average - data.userScore)).toFixed(2)} theme={theme} />
                    <ScoreUtil.MrD type="您的總平均" scoreType={data.userScoreAndUserAverage} score={(Math.abs(data.userAverage - data.userScore)).toFixed(2)} theme={theme} />
                </>}
            />
        </>;
    }

    async function shareScoreData(type) {
        switch (type) {
            case 0:
                function genLink(scoreID) {
                    Share.open({
                        title: "分享成績!",
                        message: "這是我在花中查詢上查到的成績!",
                        url: `https://hlhsinfo.ml/s/${scoreID}`
                    }).then(() => console.log("User share the score.")).catch(() => console.log("User cancel the share."));
                }
                
                if (scoreData.thisScore.isShared) {
                    genLink(score);
                    return;
                }

                var scoreD = await Auth.callAPI(shareScore, scoreData.thisScore.scoreID[0], scoreData.thisScore.scoreID[1], scoreData.thisScore.scoreID[2], scoreData.thisScore.scoreID[3]);
                if (!scoreD.data) {
                    setAlert(makeNeedLoginAlert(() => {
                        navigation.goBack();
                        setAlert(<></>);
                        window.accountData = undefined;
                    }));
                    return;
                }
                genLink(scoreD.data.id);
                break;
            
            case 1:
                setAlert(showLoading());
                function genImage(base64) {
                    setAlert(<></>);
                    Share.open({
                        title: "分享成績!",
                        message: "這是我在花中查詢上查到的成績!",
                        filename: "score",
                        type: "image/png",
                        url: base64,
                        useInternalStorage: true
                    }).then(() => console.log("User share the score.")).catch(() => console.log("User cancel the share"));
                }
                
                if (scoreData.thisScore.isShared) {
                    try {
                        var data = "data:image/png;base64," + await getSharedImage(score).then(e => e.base64());
                    } catch (err) {
                        setAlert(showAlert("錯誤", "無法生成成績圖片!", "關閉", () => {
                            setAlert(<></>);
                        }));
                        return;
                    }
                    genImage(data);
                    return;
                }

                try {
                    var data = "data:image/png;base64," + await Auth.callAPI(shareScoreImage, scoreData.thisScore.scoreID[0], scoreData.thisScore.scoreID[1], scoreData.thisScore.scoreID[2], scoreData.thisScore.scoreID[3]).then(e => e.base64());
                } catch (err) {
                    setAlert(showAlert("錯誤", "無法生成成績圖片!", "關閉", () => {
                        setAlert(<></>);
                    }));
                    return;
                }
                genImage(data);
                break;
            
            case 2:
                if (scoreData.thisScore.isShared) {
                    createQRCodeDisplay(`https://hlhsinfo.ml/s/${score}`);
                    return;
                }

                var scoreD = await Auth.callAPI(shareScore, scoreData.thisScore.scoreID[0], scoreData.thisScore.scoreID[1], scoreData.thisScore.scoreID[2], scoreData.thisScore.scoreID[3]);
                if (!scoreD.data) {
                    setAlert(makeNeedLoginAlert(() => {
                        navigation.goBack();
                        setAlert(<></>);
                        window.accountData = undefined;
                    }));
                    return;
                }

                createQRCodeDisplay(`https://hlhsinfo.ml/s/${scoreD.data.id}`);
                break;
        }
    }

    if (scoreData.thisScore.type && scoreData.thisScore.score.data.length !== 0) {
        if (subjects.length === 0) {
            var t = [];
            t.push({
                value: 'overview',
                label: "總覽",
                icon: "view-dashboard"
            })
            for (var g of scoreData.thisScore.score.data) {
                t.push({
                    value: g.name,
                    label: g.name
                });
            }

            setSubjects(t);
        }
        const type = {
            all: () => { },
            score: () => mD()
        };
        (type[scoreData.thisScore.type] ?? (() => console.error(`[Type Error] Unknown score type: ${scoreData.thisScore.type}`)))();
    }

    return (
        <>
            <Page
                title={displayName}
                isBackAble={true}
                backEvent={() => navigation.goBack()}
                extraButton={[
                    {
                        key: "share",
                        icon: "share-variant",
                        onPress: () => {
                            showBottomSheets();
                        }
                    }
                ]}
            >
                {alert}
                <ScrollView style={{
                    overflow: "scroll",
                    width: Dimensions.get("window").width,
                    marginBottom: 15,
                    marginLeft: -10
                }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <SegmentedButtons
                        value={showSubject}
                        onValueChange={setShowSubject}
                        buttons={subjects}
                        style={{
                            overflow: "scroll",
                            width: "100%",
                            marginBottom: 15,
                            paddingStart: 15,
                            paddingEnd: 15
                        }}
                    />
                </ScrollView>
                {display}
            </Page>
            <BottomSheetModalProvider style={{
                backgroundColor: "#000000A0"
            }}>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={bottomSheetStatus}
                    enabledGestureInteraction={true}
                    enablePanDownToClose={true}
                    snapPoints={["25%", "50%", "75%"]}
                    style={{
                        backgroundColor: "#000000A0"
                    }}
                    backgroundStyle={{
                        backgroundColor: theme.colors.background
                    }}
                    handleIndicatorStyle={{
                        backgroundColor: theme.colors.onBackground
                    }}
                    containerStyle={{
                        backgroundColor: bottomSheetStatus !== -1 ? "#000000A0" : "#00000000",
                        marginTop: -80
                    }}
                    onChange={(e) => setBottomSheetStatus(e)}
                >
                    <View style={{
                        margin: 15
                    }}>
                        <Text variant="headlineLarge">成績分享</Text>
                        
                    </View>

                    <BottomSheetScrollView style={{
                        margin: 15
                    }}>
                        <ScoreUtil.ShOption text="以連結分享" icon="link" onPress={() => shareScoreData(0)} theme={theme} />
                        <ScoreUtil.ShOption text="以圖片分享" icon="image" onPress={() => shareScoreData(1)} theme={theme} />
                        <ScoreUtil.ShOption text="以 QR Code 分享" icon="qrcode" onPress={() => shareScoreData(2)} theme={theme} />
                    </BottomSheetScrollView>
                        
                </BottomSheet>
            </BottomSheetModalProvider>
        </>
    )
}