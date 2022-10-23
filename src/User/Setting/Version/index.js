import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import DeviceInfo from "react-native-device-info";

import Page from "../../../Page";

export default Version = ({ navigation }) => {
    const [display, setDisplay] = useState(<ActivityIndicator animating={true} />);

    useEffect(() => {
        async function a() {
            var info = {
                Device_API: DeviceInfo.getApiLevelSync(),
                Device_Build_ID: DeviceInfo.getBuildIdSync(),
                Device_System_ID: DeviceInfo.getAndroidIdSync(),
                Device_System_OS: DeviceInfo.getBaseOsSync(),
                Device_System_OS_Name: DeviceInfo.getSystemName(),
                Device_System_OS_Version: DeviceInfo.getSystemVersion(),
                Device_Brand: DeviceInfo.getBrand(),
                Device_ID: DeviceInfo.getDeviceId(),
                Device_isEmulator: DeviceInfo.isEmulatorSync(),
                Device_Type: DeviceInfo.getDeviceType(),
                Device_Supported_ABIs: DeviceInfo.supportedAbisSync().join(", "),

                Application_Name: DeviceInfo.getApplicationName(),
                Application_Full_Version: DeviceInfo.getReadableVersion(),
                Application_Version: DeviceInfo.getVersion(),
                Application_Build_Number: DeviceInfo.getBuildNumber(),
                Application_Package_Name: DeviceInfo.getBundleId(),
                Application_First_Install: new Date(DeviceInfo.getFirstInstallTimeSync()).toLocaleString(),
                Application_Update: new Date(DeviceInfo.getLastUpdateTimeSync()).toLocaleString(),
                Application_Install_From: DeviceInfo.getInstallerPackageNameSync(),
                Application_Build_Tag: DeviceInfo.getTagsSync(),
                Application_Build_Type: DeviceInfo.getTypeSync(),
                Application_User_Agent: DeviceInfo.getUserAgentSync()
            };

            var output = [];
            
            for (var g in info) {
                output.push(<View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }} key={g}>
                    <Text variant="bodyMedium">{g}:</Text>
                    <Text variant="bodyMedium">{info[g]}</Text>
                </View>);
            }

            setDisplay(output);
        }

        a();
    }, []);

    return (
        <Page title="版本資訊" isBackAble={true} backEvent={() => navigation.goBack()}>
            {display}
        </Page>
    )
}