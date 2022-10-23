import { createStackNavigator } from "@react-navigation/stack";

import License from "./License";
import Login from "./Login";
import Menu from "./Menu";
import Setting from "./Setting";
import Support from "./Support";

const Stack = createStackNavigator();

export default User = ({ navigation }) => {
    return (
        <Stack.Navigator initialRouteName="Menu" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="License" component={License} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="Setting" component={Setting} />
        </Stack.Navigator>
    )
}