import React from "react";
import { Card, Text } from "react-native-paper";
import { View } from "react-native";

export default ({
    title = "",
    data = "",
    extra = "",
    theme = {}
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
                        <Text variant="headlineLarge" style={{ marginBottom: 5, color: theme.colors.outline }}>{title}</Text>
                        <View>
                            {data}
                        </View>
                        {extra && <View>
                            {extra}
                        </View>}
                    </View>
                </View>
            </Card.Content>
        </Card>
    )
}