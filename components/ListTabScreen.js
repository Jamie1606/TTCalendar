// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022

import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UnplannedScreen from './UnplannedScreen';
import PlannedScreen from './PlannedScreen';
import CompletedScreen from './CompletedScreen';
import { changeHeader } from './functions';

const Tab = createMaterialTopTabNavigator();

export default function ListTabScreen(props) {
    const { paramObj, navigation } = props;
    const listStackNav = navigation.getParent("listStackNav");

    changeHeader(listStackNav, {});

    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { textTransform: 'none', fontSize: 14 }
        }}>
            <Tab.Screen name="Unplanned" children={props => <UnplannedScreen {...props} paramObj={paramObj} />} />
            <Tab.Screen name="Planned" children={props => <PlannedScreen {...props} paramObj={paramObj} />} />
            <Tab.Screen name="Completed" children={props => <CompletedScreen {...props} paramObj={paramObj} />} />
        </Tab.Navigator>
    );
}