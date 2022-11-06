import { useState } from "react";

import Page from "../../../Page";
import SelectCard from "../../../SelectCard";

import { cleanCache } from "../../../api/apis";
import { showLoading, showSnackBar } from "../../../util";

export default Choise = ({ navigation }) => {
    const [alert, setAlert] = useState(<></>);

    return (
        <Page title="設定" isBackAble={true} backEvent={() => navigation.goBack()}>
            {alert}
            <SelectCard icon="update" onPress={() => navigation.navigate("Version")}>版本資訊</SelectCard>
            <SelectCard icon="trash-can" onPress={async () => {
                if (!global.accountData?.token) return setAlert(showSnackBar("請先登入!", [], () => setAlert(<></>)));

                setAlert(showLoading());
                await cleanCache(global.accountData?.token);
                setAlert(showSnackBar("已清除伺服器快取!", [], () => setAlert(<></>)))
            }}>清除伺服器快取</SelectCard>
            <SelectCard icon="api" onPress={() => {}}>修改 API 位置 (Coming Soon!)</SelectCard>
            <SelectCard icon="earth" onPress={() => {}}>修改登入位置 (Coming Soon!)</SelectCard>
        </Page>
    );
}