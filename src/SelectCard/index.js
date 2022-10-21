import {
    Text,
    Card
} from "react-native-paper";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getTheme } from "../util";

export default SelectCard = ({ title, onPress, icon, style = {
    color: getTheme().colors.onBackground
} }) =>
    <Card elevation={1} onPress={onPress} style={{
        marginBottom: 15,
        borderRadius: 15,
        ...style
    }}>
        <Card.Content style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {icon && <MaterialCommunityIcons name={icon} size={35} color={getTheme().colors.onBackground} />}
                <Text variant="headlineLarge" style={{
                    color: style.color ?? "",
                    marginLeft: icon ? 10 : 0
                }}>{title}</Text>
            </View>
                
            <MaterialCommunityIcons
                name="greater-than"
                size={45}
                style={{
                    color: style.color ?? ""
                }}
            />
        </Card.Content>
    </Card>;