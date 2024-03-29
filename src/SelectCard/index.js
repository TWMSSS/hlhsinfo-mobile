import {
    Text,
    Card,
    useTheme
} from "react-native-paper";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getTheme } from "../util";

export default ({ children, onPress, icon, style = {
    color: getTheme().colors.onBackground
} }) => {
    const theme = useTheme();
    
    return <Card elevation={1} onPress={onPress || undefined} style={{
        marginBottom: 15,
        borderRadius: 15,
        ...style
    }}>
        <Card.Content style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {icon && <MaterialCommunityIcons name={icon} size={35} color={theme.colors.onBackground} />}
                <Text variant="headlineLarge" style={{
                    color: style.color ?? "",
                    marginLeft: icon ? 10 : 0
                }}>{children}</Text>
            </View>
                
            {
                onPress && <MaterialCommunityIcons
                    name="greater-than"
                    size={45}
                    style={{
                        color: style.color ?? ""
                    }}
                />
            }
        </Card.Content>
    </Card>;
}