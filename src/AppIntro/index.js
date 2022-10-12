import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Image } from 'react-native';
import { Text, MD3Colors } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppIntroSlider from 'react-native-app-intro-slider';

import Navigation from '../Navigation';
import { saveLocal, readLocal } from '../util';

const slides = [
    {
        key: 1,
        title: '查詢你的成績',
        text: '快速查詢你的花蓮高中成績',
        backgroundColor: '#59b2ab',
        image: require("../images/intro1.png")
    },
    {
        key: 2,
        title: '分享你的成績',
        text: 'Other cool stuff',
        backgroundColor: '#febe29',
    },
    {
        key: 3,
        title: 'Rocket guy',
        text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
        backgroundColor: '#22bcb5',
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
        bottom: -30
    },
    introImg: {
        // top: 0,
        // margin: 15,
        width: 400,
        height: 1000
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
                    <Text variant="displayLarge" style={{ fontWeight: "bold" }}>{item.title}</Text>
                    <View style={{ overflow: "hidden", height: "80%", justifyContent: "flex-start" }}>
                        <Image style={styles.introImg} source={item.image} resizeMethod="resize" resizeMode="center" />
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