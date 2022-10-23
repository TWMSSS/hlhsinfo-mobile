import Page from "../../../Page";
import SelectCard from "../../../SelectCard";

export default Choise = ({ navigation }) => {
    return (
        <Page title="設定" isBackAble={true} backEvent={() => navigation.goBack()}>
            <SelectCard icon="update" onPress={() => navigation.navigate("Version")}>版本資訊</SelectCard>
        </Page>
    );
}