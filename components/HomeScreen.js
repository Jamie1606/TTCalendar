// Name: Zay Yar Tun
// Class: DIT/FT/1B/02
// Admin No: 2235035


import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListStackScreen from './ListStackScreen';
import SettingStackScreen from './SettingStackScreen';
import HomeStackScreen from './HomeStackScreen';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { getUserData } from '../firebase/userdata';

const bottomTab = createBottomTabNavigator();

export default function HomeScreen(props) {
    const { route } = props;
    const { userid } = route.params;

    const colorarr = [
        { label: "Black", value: 0 },
        { label: "Red", value: 1 },
        { label: "Blue", value: 2 },
        { label: "Green", value: 3 },
        { label: "Purple", value: 4 },
        { label: "DarkBlue", value: 5 },
        { label: "Gray", value: 6 },
        { label: "Coral", value: 7 },
        { label: "Indigo", value: 8 },
        { label: "Olive", value: 9 },
        { label: "MidnightBlue", value: 10 },
        { label: "SaddleBrown", value: 11 },
        { label: "SlateGray", value: 12 }
    ]

    const typearr = [
        { label: "Event", value: 0 },
        { label: "List", value: 1 }
    ];

    const remindarr = [
        { label: "5 min before", value: 0 },
        { label: "10 min before", value: 1 },
        { label: "15 min before", value: 2 },
        { label: "30 min before", value: 3 },
        { label: "45 min before", value: 4 },
        { label: "1 hour before", value: 5 },
        { label: "2 hour before", value: 6 },
        { label: "1 day before", value: 7 }
    ]

    const [data, updateData] = React.useState([]);
    const [dateState, updateDate] = React.useState(new Date());

    const paramObj = {
        dateState: dateState,
        updateDate: updateDate,
        data: data,
        updateData: updateData,
        colorarr: colorarr,
        typearr: typearr,
        remindarr: remindarr,
        userid: userid
    };

    React.useEffect(() => {
        getUserData(userid)
            .then(function (userdata) {
                updateData(userdata.sort((a, b) => {
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                }));
            })
    }, []);

    return (
        <bottomTab.Navigator initialRouteName='Home' id="mainNav" screenOptions={
            ({ route }) => (
                {
                    tabBarIcon: ({ focused }) => {
                        if (route.name == "Home") {
                            return <MaterialIcon name="home" size={24} color={(focused) ? "blue" : "black"} />;
                        }
                        else if (route.name == "List") {
                            return <MaterialIcon name="playlist-edit" size={24} color={(focused) ? "blue" : "black"} />;
                        }
                        else {
                            return <Ionicon name="settings" size={20} color={(focused) ? "blue" : "black"} />;
                        }
                    },
                    headerTitleAlign: 'left',
                    tabBarLabel: ({ focused }) => {
                        if (route.name == "Home") {
                            return <Text style={(focused) ? styles.focusedTabLabel : styles.normalTabLabel}>{route.name}</Text>;
                        }
                        else if (route.name == "List") {
                            return <Text style={(focused) ? styles.focusedTabLabel : styles.normalTabLabel}>{route.name}</Text>;
                        }
                        else {
                            return <Text style={(focused) ? styles.focusedTabLabel : styles.normalTabLabel}>{route.name}</Text>;
                        }
                    }
                }
            )
        }>
            <bottomTab.Screen name="Home" children={props => <HomeStackScreen {...props} paramObj={paramObj} />} />
            <bottomTab.Screen name="List" children={props => <ListStackScreen {...props} paramObj={paramObj} />} />
            <bottomTab.Screen name="Setting" children={props => <SettingStackScreen {...props} paramObj={paramObj} />} />
        </bottomTab.Navigator>
    );
}

const styles = {
    focusedTabLabel: {
        fontWeight: 'bold',
        fontSize: 13,
        color: 'blue'
    },
    normalTabLabel: {
        fontWeight: 'normal',
        fontSize: 12,
        color: 'black'
    }
}