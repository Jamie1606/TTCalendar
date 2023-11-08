import React from 'react';
import { View, Text, TextInput, Animated, Easing } from 'react-native';
import { changeHeader } from './functions';
import { getUser, editUser } from '../firebase/userdata';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedButton from './AnimatedButton';

export default function ProfileScreen(props) {
    const { navigation, paramObj } = props;
    const { userid, settingState, setSettingState } = paramObj;
    const [userName, setUserName] = React.useState("");
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [colorState, setColorState] = React.useState("#000000");
    const randColorarr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    const settingStackNav = navigation.getParent("settingStackNav");
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        getUser(userid).then(
            function (data) {
                setUserName(data[0].username);
                setEmail(data[0].email);
                setPassword(data[0].password);
            })
    }, []);

    React.useEffect(() => {
        setTimeout(() => {
            let randColor = "#";
            for (let i = 0; i < 6; i++) {
                let randnum = Math.floor(Math.random() * randColorarr.length);
                randColor += randColorarr[randnum];
            }
            setColorState(randColor);
        }, 2000);
    }, [colorState]);

    // animation
    const backValue = new Animated.Value(-1);
    Animated.timing(backValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bounce,
        useNativeDriver: true
    }).start();

    const back = backValue.interpolate({
        inputRange: [-1, 1],
        outputRange: [-100, 100]
    })
    // animation

    changeHeader(settingStackNav);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 30 }}>
            <View style={{ margin: 15, alignItems: 'center' }} >
                <Animated.View style={{
                    borderColor: colorState, alignItems: 'center', borderWidth: 3, borderRadius: 100, justifyContent: 'center', alignItems: 'center', transform: [{ translateX: back }]
                }}>
                    <Icon style={{ color: colorState, padding: 8 }} size={60} name="account-outline" />
                </Animated.View>
                <View style={{ flexDirection: 'row', paddingVertical: 30 }}>
                    <Text style={styles.title}>Name</Text>
                    <TextInput
                        value={userName}
                        onChangeText={(text) => setUserName(text)}
                        style={styles.inputContainer}></TextInput>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.title}>Email</Text>
                    <Text
                        style={{
                            alignItems: 'flex-end', flex: 3,
                            backgroundColor: '#EDEDED',
                            borderRadius: 8, padding: 15,
                            alignItems: 'flex-end',
                        }}
                    >{email}</Text>
                </View>
                <View style={{
                    flexDirection: 'row', width: '45%', paddingTop: 30
                }}>
                    <AnimatedButton state={saving}
                        pressfunction={() => {
                            if (userName.trim() != "") {
                                setSaving(true);
                                let userinfo = {
                                    userid: userid,
                                    username: userName.trim(),
                                    email: email,
                                    password: password,
                                };
                                editUser(userinfo)
                                    .then(function () {
                                        setSaving(false);
                                        setSettingState(!settingState);
                                        navigation.navigate("SettingScreen");
                                    })
                                    .catch(function (error) {
                                        setSaving(false);
                                        alert('Error in saving data!');
                                    });
                            }
                        }}
                        linearGradientStyle={{ flex: 1, borderRadius: 10 }}
                        title="SAVE" textStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }} buttonStyle={{ marginVertical: 5, alignItems: 'center', height: 50, justifyContent: 'center', borderRadius: 8 }} />
                </View>
            </View>
        </View>
    );
}

const styles = {
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        flex: 1,
        alignItems: 'flex-start',
        padding: 10,
    },
    icon: {
        paddingHorizontal: 10,
        fontSize: 30,
        opacity: 0.4
    },
    inputContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 0.8,
        alignItems: 'center',
        borderRadius: 8,
        fontSize: 13,
        alignItems: 'flex-end',
        flex: 3
    }
};