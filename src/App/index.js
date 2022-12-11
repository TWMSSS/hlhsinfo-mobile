import { useEffect } from "react";
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from "react-native-device-info";

import Navigation from "../Navigation";
import { readLocal, saveLocal } from "../util";

export default () => {
    useEffect(() => {
        async function a() {
            var d = await readLocal("@data/config");
            if (!d) await saveLocal("@data/config", JSON.stringify({}));
            global.config = JSON.parse(await readLocal("@data/config")) || {};

            global.deviceInfo = {
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
            }

            SplashScreen.hide();
        }

        a();
    }, []);

    return <Navigation />;
};