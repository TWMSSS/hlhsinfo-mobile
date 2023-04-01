import { useState } from "react";

import Page from "../../../Page";
import SelectCard from "../../../SelectCard";

import { showLoading, showSnackBar, saveLocal, showInput } from "../../../util";
import { defaultAPIURL } from "../../../api/httpRequest";
import Auth from "../../../api/Auth";

export default ({ navigation }) => {
    const [alert, setAlert] = useState(<></>);

    return (
        <Page title="設定" isBackAble={true} backEvent={() => navigation.goBack()}>
            {alert}
            <SelectCard icon="update" onPress={() => navigation.navigate("Version")}>版本資訊</SelectCard>
            <SelectCard icon="trash-can" onPress={async () => {
                if (!Auth.isLogined) return setAlert(showSnackBar("請先登入!", [], () => setAlert(<></>)));

                setAlert(showLoading());
                await Auth.clearCache();
                setAlert(showSnackBar("已清除伺服器快取!", [], () => setAlert(<></>)))
            }}>清除伺服器快取</SelectCard>
            <SelectCard icon="api" onPress={() => {
                var t = global.config.API_URL || defaultAPIURL;
                var ch = (val) => t = val;
                setAlert(
                    showInput(
                        "修改API位置",
                        <></>,
                        {
                            title: "API連結",
                            defaultValue: t,
                            onChangeText: ch
                        },
                        "確認",
                        async (type) => {
                            if (!type) setAlert(<></>);

                            await saveLocal("@data/config", JSON.stringify({ ...global.config, API_URL: t }));
                            global.config.API_URL = t;

                            setAlert(showSnackBar(`已修改API位置至 "${t}"，重新啟動以套用。`, [], () => setAlert(<></>)));
                        }
                    )
                )
            }}>修改 API 位置</SelectCard>
            <SelectCard icon="earth" onPress={() => {}}>修改登入位置 (Coming Soon!)</SelectCard>
        </Page>
    );
}