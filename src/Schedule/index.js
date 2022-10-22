import { useState, useEffect } from 'react';
import { ScrollView, View, Dimensions, LayoutAnimation } from "react-native";
import {
    Text,
    Paragraph,
    Button,
    ActivityIndicator,
    SegmentedButtons,
    Divider
} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

import { getAllSchedule, getSchedule } from "../api/apis";
import {
    readLocal,
    replaceClassTime,
    saveLocal
} from "../util";
import ClassCard from "./ClassCard";
import Page from "../Page";

export default Schedule = () => {
    const [type, setType] = useState("def");
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);
    const [IntervalList, setIntervalList] = useState([]);
    const [displayChoise, setDisplayChoise] = useState(false);
    const [schedule, setSchedule] = useState();
    const [scheduleTime, setScheduleTime] = useState([]);
    const [rendered, setRendered] = useState(false);
    const navigation = useNavigation();

    function changeDisplay() {
        for (var g of IntervalList) clearInterval(g);
        setIntervalList([]);
        setRendered(false);
    }

    if (type !== "def" && !rendered && schedule && displayChoise) {
        changeDisplay();

        LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.spring,
            duration: 200
        });

        var weekDay = Number(type) - 1;
        var list = [];
        for (var i = 0; i < schedule.length; i++) {
            if (!schedule[i]) continue;
            if (schedule[i].class[weekDay] === null) continue;
            if (!schedule[i].class[weekDay]) continue;
            list.push({
                ...schedule[i].class[weekDay],
                section: schedule[i].section,
                time: scheduleTime[i]
            });
        }

        list.push({
            className: "放學",
            section: "放",
            time: {
                start: "16:00",
                end: "明天"
            },
            teacher: []
        });

        var dpList = [];

        for (var t of list) {
            if (!t.className) continue;
            var teacher = t.teacher && t.teacher?.length !== 0 ? `由 ${t.teacher.join("老師、")}老師 授課` : "自由探索";
            dpList.push(<ClassCard key={`${weekDay}-${t.className}-${t.section}`} class={t.className} classTime={replaceClassTime(t.section)} extra={<Paragraph>{t.time.start} ~ {t.time.end} · {teacher}</Paragraph>} />);
        }
        setDisplay(dpList);
        setRendered(true);

        return;
    } else if (type === "def" && !rendered && schedule && displayChoise) {
        changeDisplay();
        a();
    }

    async function a() {
        changeDisplay();
        setDisplayChoise(true);
        setRendered(true);
        var schedulea = schedule ?? JSON.parse(await readLocal("@data/schedule"));
        if (!schedule) setSchedule(schedulea);
        if (!schedulea) {
            schedulea = await getAllSchedule(global.accountData.token);
            schedulea = schedulea.data.schedules;
            schedulea = (await getSchedule(schedulea[0].class, schedulea[0].teacher, global.accountData.token)).data.schedule;
            setSchedule(schedulea);
            saveLocal("@data/schedule", JSON.stringify(schedulea));
        }

        schedulea = schedulea.filter(e => e !== null);
        var times = [];
        for (var t of schedulea) {
            times.push({
                ...t.time
            });
        }

        if (scheduleTime.length === 0) setScheduleTime(times);

        var scheduleF = schedulea.map(e => {
            if (!e) return null;
            const todayTime = new Date();
            todayTime.setHours(0);
            todayTime.setMinutes(0);
            todayTime.setSeconds(0);
            todayTime.setMilliseconds(0);

            var startTime = e.time.start;
            var endTime = e.time.end;

            if (!Number.isNaN(Number(startTime)) && !Number.isNaN(Number(endTime))) return e;

            var startTime = startTime.split(":");
            todayTime.setHours(Number(startTime[0]));
            todayTime.setMinutes(Number(startTime[1]));
            e.time.start = todayTime.getTime();

            var endTime = endTime.split(":");
            todayTime.setHours(Number(endTime[0]));
            todayTime.setMinutes(Number(endTime[1]));
            e.time.end = todayTime.getTime();

            return e;
        });

        function load() {
            LayoutAnimation.configureNext({
                ...LayoutAnimation.Presets.spring,
                duration: 200
            });

            var classNowIndex = scheduleF.findIndex(b => Date.now() > b.time.start && Date.now() < b.time.end && b.class.filter(e => e !== null).length !== 0);
            var isNotClass = false;
            if (classNowIndex === -1) {
                isNotClass = true;
                classNowIndex = scheduleF.findIndex(b => Date.now() < b.time.end && b.class.filter(e => e !== null).length !== 0) - 1;
                if (classNowIndex === 0) classNowIndex = -1;
            }

            if (classNowIndex === -2) {
                classNowIndex = Date.now() < scheduleF[0].time.start ? -1 : -2;
            }

            var weekDay = new Date().getDay() - 1;

            var list = [];
            var dpList = [];

            if (scheduleF[classNowIndex] && scheduleF[classNowIndex].class[weekDay] && !isNotClass)
                list.push({
                    ...scheduleF[classNowIndex].class[weekDay],
                    section: scheduleF[classNowIndex].section,
                    time: scheduleTime[classNowIndex] ?? times[classNowIndex]
                });
            if (scheduleF[classNowIndex] && scheduleF[classNowIndex].class[weekDay] && isNotClass)
                list.push({
                    className: "下課",
                    section: "下",
                    time: {
                        start: scheduleTime[classNowIndex]?.end ?? times[classNowIndex].end,
                        end: scheduleTime[classNowIndex + 1]?.start ?? times[classNowIndex + 1]?.start ?? "N/A"
                    },
                    teacher: []
                });
            if (classNowIndex < 0)
                list.push({
                    className: "暫無課程",
                    section: "無",
                    time: {
                        start: "N/A",
                        end: scheduleTime[classNowIndex + 1]?.start ?? times[classNowIndex + 1]?.start ?? "N/A"
                    },
                    teacher: []
                });
            if (classNowIndex !== -2) for (var i = classNowIndex + 1; i < scheduleF.length; i++) {
                if (!scheduleF[i]) continue;
                if (scheduleF[i].class[weekDay] === null) continue;
                if (!scheduleF[i].class[weekDay]) continue;
                list.push({
                    ...scheduleF[i].class[weekDay],
                    section: scheduleF[i].section,
                    time: scheduleTime[i] ?? times[i]
                });
            };

            list.push({
                className: "放學",
                section: "放",
                time: {
                    start: "16:00",
                    end: "明天"
                },
                teacher: []
            });

            if (list.length === 1) {
                list.push({
                    className: "尚無課程",
                    section: "無",
                    time: {
                        start: "N/A",
                        end: "N/A"
                    },
                    teacher: []
                });
            }

            for (var t of list) {
                if (!t.className) continue;
                var teacher = t.teacher && t.teacher?.length !== 0 ? `由 ${t.teacher.join("老師、")}老師 授課` : "自由探索";
                dpList.push(<ClassCard key={`${weekDay}-${t.className}-${t.section}`} class={t.className} classTime={replaceClassTime(t.section)} extra={<Paragraph>{t.time.start} ~ {t.time.end} · {teacher}</Paragraph>} />);
            }

            setDisplay(<>
                <View style={{ borderBottomWidth: 1 }}>
                    <Text variant="titleLarge" style={{ margin: 15 }}>當前課程</Text>
                    {dpList.shift()}
                </View>

                <Divider />

                <View>
                    <Text variant="titleLarge" style={{ margin: 15 }}>剩餘課程</Text>
                    {dpList}
                </View>
            </>);
        }
        load();

        setIntervalList([setInterval(load, 1000), ...IntervalList]);
    }

    useEffect(() => {
        async function b() {
            var schedule = JSON.parse(await readLocal("@data/schedule"));
            if (!schedule) {
                setDisplay(<View>
                    <Text variant="headlineLarge" style={{
                        marginBottom: 30
                    }}>請先登入</Text>
                    <Button mode="contained" onPress={() => navigation.navigate("user")}>登入</Button>
                </View>);
                var t = setInterval(() => {
                    if (typeof global.accountData === "object" && global.accountData.schoolNumber) {
                        setDisplay(<ActivityIndicator animating={true} />);
                        clearInterval(t);
                        a();
                    }
                }, 200);

                return;
            }
            if (schedule !== null) a();
        }

        b();
    }, []);

    return (
        <Page
            title='課程表'
            extraButton = {
                [{
                    key: "qrcode",
                    icon: "qrcode-scan",
                    onPress: () => navigation.navigate("QRCodeScanner")
                }]
            }
        >
            {
                displayChoise
                ? <ScrollView style={{
                        overflow: "scroll",
                        width: Dimensions.get("window").width,
                        marginBottom: 15,
                        marginLeft: -10
                    }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <SegmentedButtons
                            value={type}
                            onValueChange={setType}
                            buttons={[
                                {
                                    value: 'def',
                                    label: '當前課程',
                                    icon: "clock",
                                    onPress: changeDisplay
                                },
                                {
                                    value: '1',
                                    label: '周一',
                                    onPress: changeDisplay
                                },
                                {
                                    value: '2',
                                    label: '周二',
                                    onPress: changeDisplay
                                },
                                {
                                    value: '3',
                                    label: '周三',
                                    onPress: changeDisplay
                                },
                                {
                                    value: '4',
                                    label: '周四',
                                    onPress: changeDisplay
                                },
                                {
                                    value: '5',
                                    label: '周五',
                                    onPress: changeDisplay
                                },
                            ]}
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
    )
}