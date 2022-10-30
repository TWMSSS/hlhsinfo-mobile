import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import SelectCard from "../../SelectCard";

import Page from "../../Page";
import { getTheme, makeNeedLoginAlert } from "../../util";
import { getAllScoresList } from "../../api/apis";

export default ScoreList = ({ navigation }) => {
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);
    const [alert, setAlert] = useState(<></>);

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
            for (var g of scores.data) {
                dp.push(<SelectCard key={`${g.year}-${g.term}-${g.times}-${g.testID}`} onPress={
                    () => navigation.navigate("Score", {
                        score: `${g.year}-${g.term}-${g.times}-${g.testID}`
                    })
                }>{g.name}</SelectCard>);
            }
            dp.unshift(<SelectCard key={"all"} style={{
                backgroundColor: getTheme().colors.onPrimary,
                color: getTheme().colors.primary
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
                isSearchAble={true}
                searchEvent={console.log}
            >
                {display}
            </Page>
        </>
    )
}