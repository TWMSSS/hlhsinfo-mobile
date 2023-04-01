import React, { useState, useEffect } from "react";
import { ActivityIndicator, useTheme } from "react-native-paper";
import SelectCard from "../../SelectCard";

import Page from "../../Page";
import Auth from "../../api/Auth";
import { makeNeedLoginAlert } from "../../util";

export default ({ navigation }) => {
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);
    const [alert, setAlert] = useState(<></>);
    const theme = useTheme();

    useEffect(() => {
        async function a() {
            var scores = await Auth.getScoreList();
            if (!scores) {
                setAlert(makeNeedLoginAlert(() => {
                    navigation.goBack();
                    setAlert(<></>);
                }));
                return;
            }
            var dp = [];

            for (let g of scores) {
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