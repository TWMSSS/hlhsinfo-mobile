import React from "react";
import {
    Appbar,
} from "react-native-paper";
import { View, ScrollView, SafeAreaView } from "react-native";

export default (prop = {
    title: "",
    subTitle: "",
    isBackAble: false,
    isSearchAble: false,
    isNotShowBanner: true,
    backEvent: (() => { }),
    searchEvent: (() => { }),
    extraButton: ([ ]),
    inner: "",
    style: {},
    children: <></>,
    scrollViewProps: {},
    onScroll: (() => { })
}) => {
    prop = {
        extraButton: [],
        searchEvent: () => { },
        backEvent: () => { },
        scrollViewProps: { },
        onScroll: () => { },
        ...prop
    }
    return (
        <>
            <Appbar.Header mode="medium" elevated={true}>
                {prop.isBackAble ? <Appbar.BackAction onPress={prop.backEvent} /> : <></>}
                {prop.isMenuShown ? <Appbar.BackAction icon="menu" onPress={prop.menuEvent} /> : <></>}
                <Appbar.Content title={prop.title}/>
                {prop.isSearchAble ? <Appbar.Action icon="magnify" onPress={prop.searchEvent} /> : <></>}
                {prop.extraButton.map(e => <Appbar.Action key={e.key} icon={e.icon} onPress={e.onPress} />)}
            </Appbar.Header>
                
            <SafeAreaView style={{
                marginBottom: 110,
                top: 0
            }}>
                <ScrollView {...prop.scrollViewProps} onScroll={prop.onScroll}>
                    {/* {
                        !prop.isNotShowBanner
                            ? <Banner
                                visible={true}
                                icon="test-tube"
                                actions={[]}>您正在使用<Text style={{ fontWeight: "bold" }}>「花中查詢測試版」</Text>，因此我們無法提供您最佳的體驗! <Text style={{ fontWeight: "bold" }}>轉移至正式版以取得最佳體驗!</Text></Banner>
                            : <></>
                    } */}
                    <View style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15
                    }}>
                        <View style={{
                            width: "95%",
                            paddingBottom: 15,
                            ...prop.style
                        }}>
                            {prop.children}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
};