// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingScreen from './SettingScreen';
import ProfileScreen from './ProfileScreen';
import ComingSoonScreen from './ComingSoonScreen';

const Stack = createNativeStackNavigator();

export default function SettingStackScreen(props) {
    const { paramObj } = props;
    const [settingState, setSettingState] = React.useState(true);
    paramObj.settingState = settingState;
    paramObj.setSettingState = setSettingState;

    return (
        <Stack.Navigator id="settingStackNav" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SettingScreen" children={props => <SettingScreen {...props} paramObj={paramObj} />} />
            <Stack.Screen name="ProfileScreen" children={props => <ProfileScreen {...props} paramObj={paramObj} />} />
            <Stack.Screen name="ComingSoonScreen" children={props => <ComingSoonScreen {...props} />} />
        </Stack.Navigator>
    );
}