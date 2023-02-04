import React from "react";
import { Card, Text, useTheme } from "react-native-paper";
import { View } from "react-native";

export default (prop = {
    title: "",
    data: ""
}) => {
    const theme = useTheme();
    
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
                        <Text variant="headlineLarge" style={{ marginBottom: 5, color: theme.colors.outline }}>{prop.title}</Text>
                        <View>
                            {prop.data}
                        </View>
                    </View>
                </View>
            </Card.Content>
        </Card>
    )
}