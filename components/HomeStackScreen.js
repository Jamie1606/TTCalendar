// Name: Zay Yar Tun
// Class: DIT/FT/1B/02
// Admin No: 2235035


import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MonthScreen from './MonthScreen';
import SearchScreen from './SearchScreen';
import AddDetailScreen from './AddDetailScreen';
import DetailScreen from './DetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackScreen(props) {
    const { paramObj } = props;

    return (
        <Stack.Navigator id="homeStackNav" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeTab" children={props => <MonthScreen {...props} paramObj={paramObj} />} />
            <Stack.Screen name="SearchScreen" children={props => <SearchScreen {...props} paramObj={paramObj} />} />
            <Stack.Screen name="AddDetailScreen" children={props => <AddDetailScreen {...props} paramObj={paramObj} />} />
            <Stack.Screen name="DetailScreen" children={props => <DetailScreen {...props} paramObj={paramObj} />} />
        </Stack.Navigator>
    );
}