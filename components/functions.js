// Name: Zay Yar Tun
// Class: DIT/FT/1B/02
// Admin No: 2235035

import React from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { getUserData } from '../firebase/userdata';

export function convertTime(time) {
    let hour = Math.floor(time / 60);
    let minute = Math.floor(time % 60);
    let ampm = "AM";
    if (hour >= 12) {
        hour -= 12;
        ampm = "PM";
        if (hour >= 12) {
            hour -= 12;
            ampm = "AM";
        }
    }
    if (hour == 0)
        hour = 12;

    if (hour < 10)
        hour = "0" + hour;

    if (minute < 10)
        minute = "0" + minute;

    return hour + ":" + minute + " " + ampm;
}

export function convertToTime(date) {
    return (date.getHours() * 60) + date.getMinutes();
}

export function formatDetailDate(date) {
    date = new Date(date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return days[date.getDay()] + ", " + date.getDate() + " " + months[date.getMonth()];
}

export function changeHeader(navigation, required) {
    const state = navigation.getState();
    const mainNav = navigation.getParent("mainNav");

    React.useEffect(() => {
        const currentName = state.routes[state.index].name;
        if (currentName == "HomeTab") {
            mainNav.setOptions({
                headerTitle: () => (
                    <Text style={{ fontWeight: 'bold', color: "black" }}>CALENDAR</Text>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => required.updateDate(new Date())}>
                            <Text style={{ padding: 2, marginRight: 8, paddingHorizontal: 12, backgroundColor: "black", color: 'white', fontWeight: 'bold' }}>{new Date().getDate()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'white', color: 'black', marginRight: 10 }} onPress={() => navigation.navigate("SearchScreen", {
                            navigationName: 'homeStackNav'
                        })}>
                            <Icon style={{ paddingHorizontal: 4 }} name="search" size={24} />
                        </TouchableOpacity>
                    </View>
                )
            })
        }
        if (currentName == "DetailScreen") {
            mainNav.setOptions({
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backButton}>➤</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleFont}>DETAIL</Text>
                    </View>
                ),
                headerRight: () => (
                    <Menu>
                        <MenuTrigger style={{ padding: 8 }}>
                            <Icon name="menu" size={30} />
                        </MenuTrigger>
                        <MenuOptions customStyles={{
                            optionsContainer: {
                                marginTop: 45
                            }
                        }}>
                            <MenuOption onSelect={() => { required.editFunction() }}>
                                <Text style={{ padding: 8 }}>Edit</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => {
                                Alert.alert('Confirm Delete', 'Are you sure you want to delete?', [
                                    {
                                        text: 'Yes',
                                        onPress: () => required.deleteFunction()
                                    }, { text: 'No' }
                                ])
                            }}>
                                <Text style={{ padding: 8 }}>Delete</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                )
            });
        }
        if (currentName == "AddDetailScreen") {
            mainNav.setOptions({
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backButton}>➤</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleFont}>{required.title}</Text>
                    </View>
                ),
                headerRight: ""
            });
        }
        if (currentName == "SearchScreen") {
            mainNav.setOptions({
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backButton}>➤</Text>
                        </TouchableOpacity>
                    </View>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={{ borderWidth: 1, flex: 1, borderRadius: 10, marginHorizontal: 8, padding: 8 }}
                            placeholder="Search ..."
                            clearButtonMode='while-editing'
                            onChangeText={(text) => { required.updateSearch(text.trim()) }}
                        />
                    </View>
                )
            });
        }
        if (currentName == "ListTab") {
            mainNav.setOptions({
                headerTitle: () => (<Text style={styles.titleFont}>TO-DO LIST</Text>),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: 'white', color: 'black', marginRight: 10 }} onPress={() => navigation.navigate("SearchScreen", {
                            navigationName: 'listStackNav'
                        })}>
                            <Icon style={{ paddingHorizontal: 4 }} name="search" size={24} />
                        </TouchableOpacity>
                    </View>
                )
            });
        }
        if (currentName == "SettingScreen") {
            mainNav.setOptions({
                headerTitle: () => (<Text style={styles.titleFont}>SETTING</Text>),
                headerRight: ""
            });
        }
        if (currentName == "ProfileScreen") {
            mainNav.setOptions({
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backButton}>➤</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleFont}>PROFILE</Text>
                    </View>
                ),
                headerRight: ""
            });
        }
        if (currentName == "ComingSoonScreen") {
            mainNav.setOptions({
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backButton}>➤</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleFont}>COMING SOON</Text>
                    </View>
                ),
                headerRight: ""
            });
        }
    }, [state]);
}

export function checkSameDate(date1, date2) {
    if (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear())
        return true;
    else
        return false;
}

export function formatTime(hour, minute) {
    let str = "", ampm = " AM";
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (hour >= 12) {
        ampm = " PM";
        hour -= 12;
    }
    if (hour == 0) {
        hour = 12;
    }
    if (hour < 10) {
        str += "0" + hour + ":" + minute + ampm;
    }
    else {
        str += hour + ":" + minute + ampm;
    }
    return str;
}

export function refreshContent(userid, setRefresh, updateData) {
    setRefresh(true);
    getUserData(userid)
        .then(function (userdata) {
            updateData(userdata.sort((a, b) => {
                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            }));
        })
        .catch(function (error) {
            console.log(error);
        })
    setRefresh(false);
}

const styles = {
    backButton: {
        fontSize: 25,
        marginRight: 16,
        transform: [{ scaleX: -1 }, { scaleY: 1 }]
    },
    titleFont: {
        fontWeight: 'bold'
    }
};