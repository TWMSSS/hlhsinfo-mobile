import React, { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View, Image } from 'react-native';
import { Text, MD3Colors } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppIntroSlider from 'react-native-app-intro-slider';

import Navigation from '../Navigation';
import { saveLocal, readLocal } from '../util';

const slides = [
    {
        key: 1,
        title: '全新介面\n依舊實用!',
        text: '享受全新花中查詢手機板介面，暢查學校資料!',
        backgroundColor: '#432ff7',
        image: require("../images/intro1.png")
    },
    {
        key: 2,
        title: '成績查詢\n毫無阻礙!',
        text: '資料有限，分析無限!',
        backgroundColor: '#febe29',
        image: require("../images/intro2.png")
    },
    {
        key: 3,
        title: '立即使用新版\n花 中 查 詢 ！',
        text: '立即使用功能豐富又開源的花中查詢手機版吧!',
        backgroundColor: '#458BFF',
        image: require("../images/intro3.png")
    }
];

const styles = StyleSheet.create({
    buttonCircle: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 30
    },
    slides: {
        width: "100%",
        height: "100%"
    },
    inSlides: {
        top: 30,
        alignItems: "center",
        // width: "80%"
        margin: 30
    },
    desc: {
        textAlign: "center",
        width: "100%",
        bottom: 120,
        color: "#fff"
    },
    introImg: {
        // top: 0,
        // margin: 15,
        width: Dimensions.get("screen").width,
        marginTop: -100
        // height: 300
    }
});

export default class AppIntro extends React.Component {
    constructor(props) {
        super(props);
        this.state = { done: false };
        this._checkIntro();
    }
    _checkIntro = async () => {
        var intro = await readLocal("@app/intro");
        if (intro && !this.state.done) this.setState({ done: true });
    }
    _renderItem = ({ item }) => {
        return (
            <View style={{ ...styles.slides, backgroundColor: item.backgroundColor }}>
                <View style={styles.inSlides}>
                    <Text variant="displayLarge" style={{ fontWeight: "bold", color: "#fff" }}>{item.title}</Text>
                    <View style={{ overflow: "hidden", height: "80%" }}>
                        <Image style={styles.introImg} source={item.image} resizeMode="center" />
                    </View>
                    <Text style={styles.desc}>{item.text}</Text>
                </View>
            </View>
        );
    }
    _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <MaterialCommunityIcons
                    name="greater-than"
                    size={50}
                    color="#fff"
                />
            </View>
        );
    };
    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <MaterialCommunityIcons
                    name="check"
                    size={50}
                />
            </View>
        );
    };
    _onDone = () => {
        saveLocal("@app/intro", true);
        this.setState({ done: true });
    }
    render = () => {
        return !this.state.done ? <AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this._onDone} renderDoneButton={this._renderDoneButton} renderNextButton={this._renderNextButton}/> : <Navigation />;
    }
}