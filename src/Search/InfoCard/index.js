import React from "react";
import { Card, Text } from "react-native-paper";
import { View } from "react-native";
import { getTheme } from "../../util";

export default (prop = {
    title: "",
    data: "",
    extra: ""
}) => {
    return (
        <Card style={{
            marginBottom: 10,
            borderRadius: 15
        }}>
            <Card.Content>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignContent: "center"
                }}>
                    <View>
                        <Text variant="headlineLarge" style={{ marginBottom: 5, color: getTheme().colors.outline }}>{prop.title}</Text>
                        <View>
                            {prop.data}
                        </View>
                        {prop.extra && <View>
                            {prop.extra}
                        </View>}
                    </View>
                </View>
            </Card.Content>
        </Card>
    )
}