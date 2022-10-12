import React from "react";
import { Card, Text, Avatar, Paragraph } from "react-native-paper";
import { View } from "react-native";

export default ClassCard = (prop = {
    class: "",
    extra: "",
    classTime: ""
}) => {
    return (
        <Card style={{
            marginBottom: 5,
            borderRadius: 15
        }}>
            <Card.Content>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignContent: "center"
                }}>
                    <Avatar.Text label={prop.classTime} style={{
                        marginRight: 15
                    }} size={30} />
                    <View>
                        <Text variant="headlineLarge" style={{ marginBottom: 5 }}>{prop.class}</Text>
                        {prop.extra}
                    </View>
                </View>
            </Card.Content>
        </Card>
    )
}