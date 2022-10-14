import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

import ScoreList from "./ScoreList";
import Choise from "./Choise";
import Lack from "./Lack";
import Score from "./Score";
import SearchLogin from "./SearchLogin";
import Profile from "./Profile";
import RewAndPun from "./RewAndPun";

export default Search = ({ route, navigation }) => {
    return (
        <Stack.Navigator initialRouteName={!global.accountData ? "SearchLogin" : "Choise"} screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="SearchLogin" component={SearchLogin} initialParams={{
                d: route.params ? false : true
            }} />
            <Stack.Screen name="Choise" component={Choise} />
            <Stack.Screen name="ScoreList" component={ScoreList} />
            <Stack.Screen name="Score" component={Score} />
            <Stack.Screen name="Lack" component={Lack} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="RewAndPun" component={RewAndPun} />
        </Stack.Navigator>
    );
}