// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListTabScreen from './ListTabScreen';
import AddDetailScreen from './AddDetailScreen';
import DetailScreen from './DetailScreen';
import SearchScreen from './SearchScreen';

const Stack = createNativeStackNavigator();

export default function ListStackScreen(props) {
    const { paramObj } = props;

    return (
        <Stack.Navigator id="listStackNav" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ListTab" children={props => <ListTabScreen {...props} paramObj={paramObj} />} />
            <Stack.Screen name="SearchScreen" children={props => <SearchScreen {...props} paramObj={paramObj} />} />
            <Stack.Screen name="AddDetailScreen" children={props => <AddDetailScreen {...props} paramObj={paramObj} />} />
            <Stack.Screen name="DetailScreen" children={props => <DetailScreen {...props} paramObj={paramObj} />} />
        </Stack.Navigator>
    );

}