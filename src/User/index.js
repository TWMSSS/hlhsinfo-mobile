import { createStackNavigator } from "@react-navigation/stack";
import License from "./License";

import Login from "./Login";
import Menu from "./Menu";

const Stack = createStackNavigator();

export default User = ({ navigation }) => {
    return (
        <Stack.Navigator initialRouteName="Menu" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="License" component={License} />
        </Stack.Navigator>
    )
}