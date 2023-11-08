// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022

import { Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { getUser } from '../firebase/userdata';
import { changeHeader } from './functions';


function Setting({ label, icon, color, navigation }) {
    return (
        <View>
            <TouchableOpacity style={[styles.setting]} onPress={() => { navigation.navigate("ComingSoonScreen") }}>
                <FeatherIcon color={color} style={styles.icon} name={icon} />
                <Text style={[styles.label]}>{label}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, height: 0.5, width: 1, backgroundColor: '#797979' }} />
        </View>
    );
}

export default function SettingScreen(props) {
    const { navigation, paramObj } = props;
    const { userid, settingState } = paramObj;
    const [userName, setUserName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const settingStackNav = navigation.getParent("settingStackNav");
    const [refresh, setRefresh] = React.useState(false);
    changeHeader(settingStackNav, {});

    React.useEffect(() => {
        getUser(userid)
            .then(function (data) {
                setUserName(data[0].username);
                setEmail(data[0].email);
            })
            .catch(function (error) {
                alert('Error in retrieving user data!');
            })
    }, [settingState]);

    function refreshUser() {
        setRefresh(true);
        getUser(userid)
            .then(function (data) {
                setUserName(data[0].username);
                setEmail(data[0].email);
            })
            .catch(function (error) {
                alert('Error in retrieving user data!');
            })
        setRefresh(false);
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshUser} />}>
            <TouchableOpacity
                style={{ flexDirection: 'row', paddingVertical: 30, paddingHorizontal: 10, backgroundColor: '#fff' }}
                onPress={() => navigation.navigate('ProfileScreen')}>
                <View style={{
                    width: 50, height: 50, borderWidth: 3, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginHorizontal: 25
                }}>
                    <Icon style={{ fontSize: 40, color: "#000000" }} name='account-outline' />
                </View>
                <View style={{ flex: 1, marginHorizontal: 15 }}>
                    <Text style={{ fontWeight: 'bold' }}>{userName}</Text>
                    <Text style={{ color: '#797979' }}>{email}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <Icon name="chevron-right" size={35} style={{ fontWeight: 'bold' }} />
                </View>
            </TouchableOpacity>
            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            <Setting color='black' navigation={navigation} label="Account" icon="user" />
            <Setting color='black' navigation={navigation} label="Notifications" icon="bell" />
            <Setting color='black' navigation={navigation} label="Calendar Settings" icon="calendar" />
            <Setting color='black' navigation={navigation} label="Appearance" icon="tool" />
            <Setting color='black' navigation={navigation} label="App Language" icon="globe" />
            <Setting color='black' navigation={navigation} label="About us" icon="info" />
            <Setting color='black' navigation={navigation} label="FAQ" icon="help-circle" />
            <TouchableOpacity style={{ backgroundColor: '#ff4331', alignItems: 'center', height: 75, justifyContent: 'center' }} onPress={
                () => {
                    AsyncStorage.clear();
                    navigation.navigate("LogInScreen");
                }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, }}>LOG OUT</Text>
            </TouchableOpacity>
        </ScrollView>);
}

const styles = {
    setting: {
        backgroundColor: "#fff",
        height: 80,
        alignItems: 'center',
        flexDirection: 'row'
    },
    label: {
        fontSize: 16
    },
    icon: {
        paddingHorizontal: 30,
        fontSize: 30,
        opacity: 0.4
    }
}