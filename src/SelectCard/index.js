import React from "react";
import {
    Text,
    Card,
    MD3Colors
} from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getTheme } from "../util";

export default SelectCard = ({ title, onPress, style = {
    color: getTheme().colors.onBackground
} }) =>
    <Card elevation={1} onPress={onPress} style={{
        marginBottom: 15,
        borderRadius: 15,
        ...style
    }}>
        <Card.Content style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
            <Text variant="headlineLarge" style={{
                color: style.color ?? ""
            }}>{title}</Text>
            <MaterialCommunityIcons
                name="greater-than"
                size={45}
                style={{
                    color: style.color ?? ""
                }}
            />
        </Card.Content>
    </Card>;