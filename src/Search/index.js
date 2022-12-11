import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

import ScoreList from "./ScoreList";
import Choise from "./Choise";
import Lack from "./Lack";
import Score from "./Score";
import Profile from "./Profile";
import RewAndPun from "./RewAndPun";
import ScoreAll from "./Score/ScoreAll";

export default ({ route, navigation }) => {
    return (
        <Stack.Navigator initialRouteName="Choise" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Choise" component={Choise} initialParams={{
                d: route.params ? false : true
            }} />
            <Stack.Screen name="ScoreList" component={ScoreList} />
            <Stack.Screen name="Score" component={Score} />
            <Stack.Screen name="ScoreAll" component={ScoreAll} />
            <Stack.Screen name="Lack" component={Lack} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="RewAndPun" component={RewAndPun} />
        </Stack.Navigator>
    );
}