import React, { useState, useEffect } from "react";
import { ActivityIndicator, useTheme } from "react-native-paper";
import SelectCard from "../../SelectCard";

import Page from "../../Page";
import { makeNeedLoginAlert } from "../../util";
import { getAllScoresList } from "../../api/apis";

export default ({ navigation }) => {
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);
    const [alert, setAlert] = useState(<></>);
    const theme = useTheme();

    useEffect(() => {
        async function a() {
            var scores = await getAllScoresList(global.accountData?.token);
            if (!scores.data) {
                setAlert(makeNeedLoginAlert(() => {
                    navigation.goBack();
                    setAlert(<></>);
                    global.accountData = undefined;
                }));
                return;
            }
            var dp = [];

            global.accountData.scoreList = scores.data;

            for (let g of scores.data) {
                dp.push(<SelectCard key={`${g.year}-${g.term}-${g.times}-${g.testID}`} onPress={
                    () => navigation.navigate("Score", {
                        score: `${g.year}-${g.term}-${g.times}-${g.testID}`
                    })
                }>{g.name}</SelectCard>);
            }
            dp.unshift(<SelectCard key={"all"} style={{
                backgroundColor: theme.colors.onPrimary,
                color: theme.colors.primary
            }} onPress={() => navigation.navigate("ScoreAll")}>所有成績比較</SelectCard>);
            setDisplay(dp);
        }
        a();
    }, []);

    return (
        <>
            {alert}
            <Page
                title="查詢成績"
                isBackAble={true}
                backEvent={() => navigation.goBack()}
            >
                {display}
            </Page>
        </>
    )
}