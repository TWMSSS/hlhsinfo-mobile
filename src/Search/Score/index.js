import { useEffect, useState, useRef } from "react";
import {
    Text,
    ActivityIndicator,
    SegmentedButtons
} from "react-native-paper";
import { Dimensions, View, ScrollView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet, { BottomSheetScrollView, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Share from "react-native-share";

import { getAllScores, getScore, getShared, getSharedImage, shareScore, shareScoreImage } from "../../api/apis";
import Page from "../../Page";
import { showAlert, getTheme, makeNeedLoginAlert, showLoading, blobToBase64, QRCodeDisplay } from "../../util";
import ScoreCard from "./ScoreCard";
import * as ScoreUtil from "./util";

export default Score = ({ route, navigation }) => {
    const { score } = route.params;
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);
    const [scoreData, setScoreData] = useState({
        score: {
            data: []
        },
        type: "",
        ranking: [],
        isShared: !!0,
        scoreID: ""
    });
    const [alert, setAlert] = useState(<></>);
    const [displayChoise, setDisplayChoise] = useState(false);
    const [showSubject, setShowSubject] = useState("overview");
    const [subjects, setSubjects] = useState([]);
    const [isRendered, setIsRendered] = useState(false);
    const [displayName, setDisplayName] = useState("成績查詢");
    const [bottomSheetStatus, setBottomSheetStatus] = useState(-1);

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

    function sS(scoreD, tp, scoreID) {
        if (!scoreD) {
            return notFound();
        }

        var ranking = [...scoreD.data];
        ranking.sort((a, b) => a.score - b.score);

        var d = {
            score: scoreD,
            type: tp,
            ranking,
            isShared: !!scoreD.userInfo,
            scoreID
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

    function createQRCodeDisplay(qrcode) {
        function hide() {
            setAlert(<></>);
        }
        setAlert(<QRCodeDisplay onDismiss={hide} data={qrcode} />);
    }

    useEffect(() => {
        async function a() {
            if (score === "all") {
                if (!global.accountData) {
                    navigation.goBack();
                    return;
                }
                const scoreD = await getAllScores(global.accountData?.token);
                if (!scoreD.data) {
                    setAlert(makeNeedLoginAlert(() => {
                        navigation.goBack();
                        setAlert(<></>);
                        window.accountData = undefined;
                    }));
                    return;
                }
                return sS(scoreD.data, "all", "all");
            }

            if (score.split("-").length !== 3) {
                const scoreD = (await getShared(score)).data;
                return sS(scoreD, "score", score);
            }

            if (!global.accountData) {
                navigation.goBack();
                return;
            }
            const ids = score.split("-");
            const scoreD = await getScore(ids[0], ids[1], ids[2], global.accountData?.token);
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
        if (showSubject === "overview") {
            var maxSubj = scoreData.score.data.reduce((a, b) => {
                return (a.score > b.score) ? a : b
            });
            var minSubj =scoreData.score.data.reduce((a, b) => {
                return (a.score < b.score) ? a : b
            });
            setDisplay(<>
                <ScoreCard
                    subject="總覽"
                    score={<>
                        <View>
                            <ScoreUtil.MdB name={maxSubj.name} desc={<>
                                是您成績中<Text style={{
                                    color: "#36d646",
                                    fontWeight: "bold"
                                }}>最佳</Text>的科目
                            </>} onPress={() => sH(maxSubj.name)} />
                            <ScoreUtil.MdB name={minSubj.name} desc={<>
                                是您成績中<Text style={{
                                    color: getTheme().colors.onErrorContainer,
                                    fontWeight: "bold"
                                }}>最差</Text>的科目
                            </>} onPress={() => sH(minSubj.name)} />

                            <ScoreUtil.MdP
                                data={[(Number(scoreData.score.extra.find(e => e.type === "平均").value) / 100)]}
                                display={scoreData.score.extra.find(e => e.type === "平均").value}
                                desc={<>
                                    是您的<Text style={{
                                        color: getTheme().colors.secondary
                                    }}>平均分數</Text>
                                </>} />
                            <ScoreUtil.MdP
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
                        <ScoreUtil.Mr title="班級排名" display={scoreData.score.extra.find(e => e.type === "排名")?.value ?? "不適用"} />
                        <ScoreUtil.Mr title="年級排名" display={scoreData.score.extra.find(e => e.type === "年級排名")?.value ?? "不適用"} />
                        <ScoreUtil.Mr title="科別排名" display={scoreData.score.extra.find(e => e.type === "科別排名")?.value ?? "不適用"} />
                        <ScoreUtil.Mr title="類組排名" display={scoreData.score.extra.find(e => e.type === "類組排名")?.value ?? "不適用"} />
                    </>}
                />
            </>);
            return;
        }
        var subj = scoreData.score.data[scoreData.score.data.findIndex(e => e.name === showSubject)];
        var data = {
            userAverage: Number(scoreData.score.extra.find(e => e.type === "平均").value),
            average: Number(subj.gpa),
            userScore: Number(subj.score),
            rank: scoreData.ranking.findIndex(e => e.name === subj.name) + 1,
            isUnpass: {
                score: scoreData.score.unpass.findIndex(e => e.name === subj.name && e.type === "score") !== -1,
                gpa: scoreData.score.unpass.findIndex(e => e.name === subj.name && e.type === "gpa") !== -1 || Number(subj.gpa) < 60
            },
            userScoreAndAverage: 1,
            userScoreAndUserAverage: 1
        }
        data.userScoreAndAverage = data.userScore === data.average ? 1 : (data.userScore > data.average ? 2 : 0);
        data.userScoreAndUserAverage = data.userScore === data.userAverage ? 1 : (data.userScore > data.userAverage ? 2 : 0);
        setDisplay(<>
            <ScoreCard key={subj.name + subj.score} subject={subj.name} score={<>
                <View>
                    <ScoreUtil.MdPT
                        data={[data.userScore / 100]}
                        title="您的成績"
                        display={<Text style={{
                            color: !data.isUnpass.score ? "" : getTheme().colors.error
                        }}>{subj.score}</Text>}
                        chartConfig={
                            !data.isUnpass.score ? ScoreUtil.getChartConfig() : ScoreUtil.mCCF(getTheme().colors.error)
                        } />
                    <ScoreUtil.MdPT
                        data={[data.average / 100]}
                        title="班級平均"
                        display={<Text style={{
                            color: !data.isUnpass.gpa ? "" : getTheme().colors.error
                        }}>{subj.gpa}</Text>}
                        chartConfig={
                            !data.isUnpass.gpa ? ScoreUtil.getChartConfig() : ScoreUtil.mCCF(getTheme().colors.error)
                        } />
                </View>
            </>} />

            <ScoreCard
                subject="詳細資訊"
                score={<>
                    <ScoreUtil.Mr title={<>在您<Text style={{
                        color: getTheme().colors.secondary
                    }}>所有成績中</Text>排</>} display={data.rank} />

                    <ScoreUtil.MrP title={<>與<Text style={{
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
                    <ScoreUtil.MrP title={<>與<Text style={{
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
        </>);
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
                
                if (scoreData.isShared) {
                    genLink(score);
                    return;
                }

                var scoreD = await shareScore(scoreData.scoreID[0], scoreData.scoreID[1], scoreData.scoreID[2], global.accountData?.token);
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
                        filename: "score.png",
                        type: "image/png",
                        url: base64,
                        useInternalStorage: true
                    }).then(() => console.log("User share the score.")).catch(() => console.log("User cancel the share"));
                }
                
                if (scoreData.isShared) {
                    var data = await (await getSharedImage(score)).blob();
                    try {
                        data = (await blobToBase64(data)).replace("application/octet-stream", "image/png");
                    } catch (err) {
                        setAlert(showAlert("錯誤", "無法生成成績圖片!", "關閉", () => {
                            setAlert(<></>);
                        }));
                        return;
                    }
                    genImage(data);
                    return;
                }

                var data = (await (await shareScoreImage(scoreData.scoreID[0], scoreData.scoreID[1], scoreData.scoreID[2], global.accountData?.token)).blob());
                try {
                    data = (await blobToBase64(data)).replace("application/octet-stream", "image/png");
                } catch (err) {
                    setAlert(showAlert("錯誤", "無法生成成績圖片!", "關閉", () => {
                        setAlert(<></>);
                    }));
                    return;
                }
                genImage(data);
                break;
            
            case 2:
                if (scoreData.isShared) {
                    createQRCodeDisplay(`https://hlhsinfo.ml/s/${score}`);
                    return;
                }

                var ids = score.split("-");
                var scoreD = await shareScore(ids[0], ids[1], ids[2], global.accountData?.token);
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
                {
                    displayChoise
                    ? <ScrollView style={{
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
                    : <></>
                }
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
                    snapPoints={["25%", "50%"]}
                    style={{
                        backgroundColor: "#000000A0"
                    }}
                    backgroundStyle={{
                        backgroundColor: getTheme().colors.background
                    }}
                    handleIndicatorStyle={{
                        backgroundColor: getTheme().colors.onBackground
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
                        <ScoreUtil.ShOption text="以連結分享" icon="link" onPress={() => shareScoreData(0)} />
                        <ScoreUtil.ShOption text="以圖片分享" icon="image" onPress={() => shareScoreData(1)} />
                        <ScoreUtil.ShOption text="以 QR Code 分享" icon="qrcode" onPress={() => shareScoreData(2)} />
                    </BottomSheetScrollView>
                        
                </BottomSheet>
            </BottomSheetModalProvider>
        </>
    )
}