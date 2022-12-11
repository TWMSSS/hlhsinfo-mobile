import { createStackNavigator } from "@react-navigation/stack";
import Choise from "./Choise";
import Version from "./Version";

const Stack = createStackNavigator();

export default () => {
    return (
        <Stack.Navigator initialRouteName="Choise" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Choise" component={Choise} />
            <Stack.Screen name="Version" component={Version} />
        </Stack.Navigator>
    );
}