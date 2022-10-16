import 'react-native-reanimated';

import { useEffect, useState } from "react";
import { Linking, StyleSheet, View, SafeAreaView, Dimensions } from "react-native";
import { Paragraph, Text } from 'react-native-paper';
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { URL } from "react-native-url-polyfill";

import Page from '../Page';
import { isHLHSInfoURL, showAlert } from '../util';

export default QRCodeScanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [frameProcessor, barcodes] = useScanBarcodes([
        BarcodeFormat.QR_CODE
    ]);
    const [alert, setAlert] = useState(<></>);
    const [barcode, setBarcode] = useState('');
    const [isScanned, setIsScanned] = useState(false);

    // console.log(barcodes);

    const devices = useCameraDevices();
    const device = devices.back;

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
            if (status !== "authorized") {
                setAlert(showAlert("需要權限", "您必須允許「花中查詢」使用您的相機，以便您使用 QR Code 快速查詢分享之成績。", "前往設定", () => { Linking.openSettings(); navigation.goBack(); }))
            }
        })();
    }, []);

    const styles = StyleSheet.create({
        container: {
            height: Dimensions.get("window").height - 112
        },
        barcodeText: {
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
        },
    });

    useEffect(() => {
        toggleActiveState();
        return () => {
            barcodes;
        };
    }, [barcodes]);

    const toggleActiveState = async () => {
        if (barcodes && barcodes.length > 0 && isScanned === false) {
            setIsScanned(true);
            barcodes.forEach(async (scannedBarcode) => {
                if (scannedBarcode.rawValue !== '') {
                    setBarcode(scannedBarcode.rawValue);
                }
            });
        }
    };

    const path = barcode.split("//")[1];
    if (isHLHSInfoURL(barcode) && path.includes("/s/")) {
        setBarcode("");
        setIsScanned(true);
        navigation.navigate("Home", {
            screen: "search",
            params: {
                screen: "Score",
                params: {
                    score: path.split("/")[2]
                },
                initial: false
            }
        });
    } else if (isScanned && barcode) {
        setBarcode("");
        setIsScanned(false);
    }

    return (
        <>
            {alert}
            <Page
                title='QR Code 掃描'
                isBackAble={true}
                backEvent={() => navigation.goBack()}
                style={{
                    flex: 1,
                    width: "100%",
                    marginTop: -15,
                    paddingBottom: 0
                }}
                isNotShowBanner={true}
            >
                <SafeAreaView style={styles.container}>
                    {
                        device != null &&
                        hasPermission && (
                            <>
                                <Camera
                                    style={StyleSheet.absoluteFill}
                                    device={device}
                                    isActive={!isScanned}
                                    frameProcessor={frameProcessor}
                                    frameProcessorFps="auto"
                                />
                            </>
                        )
                    }
                    <View style={{
                        backgroundColor: "#000000c0",
                        height: 250,
                        width: Dimensions.get("window").width,
                        bottom: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <View style={{
                            margin: 30
                        }}>
                            <Text variant="headlineLarge" style={{
                                marginBottom: 15,
                                color: "#fff"
                            }}>掃描成績分享QR Code</Text>
                            <Paragraph style={{
                                color: "#fff"
                            }}>掃描其他人成績分享之QR Code，讓你快速查看他人成績!</Paragraph>
                        </View>
                    </View>
                </SafeAreaView>
            </Page>
        </>
    );
}