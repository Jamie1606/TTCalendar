// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022

import React from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addUser } from '../firebase/userdata';
import { createUserCredential } from '../firebase/auth';
import AnimatedButton from './AnimatedButton';

function Input({ label, hidePass, error, setError, setState, ...props }) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hidePassword, setHidePassword] = React.useState(hidePass);
    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.inputContainer, { width: '95%' }, { borderColor: error ? 'red' : isFocused ? 'black' : '#BABBC3' }]}>
                    <TextInput
                        secureTextEntry={hidePassword} style={{ width: (hidePass) ? '90%' : '98%', alignItems: 'flex-start', color: "#000" }}{...props} placeholderTextColor='#BABBC3' onChangeText={(text) => setState(text.trim())} onFocus={() => { setIsFocused(true); setError("") }}
                        onBlur={() => setIsFocused(false)}
                    />
                    {
                        (hidePass && <Icon style={{ fontSize: 22, color: "#BABBC3", alignItems: 'flex-end' }}
                            onPress={() => setHidePassword(!hidePassword)}
                            name={hidePassword ? 'eye-off-outline' : 'eye-outline'} />)
                    }
                </View>
                <View style={{ width: '5%' }}>
                    {
                        error && <Text style={{ color: 'red', fontSize: 30, paddingLeft: 8, fontWeight: 'bold' }}>!</Text>
                    }
                </View>
            </View>
            <Text style={{ color: 'red', fontSize: 11 }}>{error}</Text>
        </View>
    );
}

export default function SignUpScreen(props) {
    const { navigation } = props;

    const [userName, setUserName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [saving, setSaving] = React.useState(false);
    const [userNameError, setUserNameError] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");

    function signUp() {
        let isValid = true;
        setUserNameError("");
        setEmailError("");
        setPasswordError("");
        if (!userName) {
            setUserNameError("Invalid username");
            isValid = false;
        }
        if (!email || !email.match(/\S+@\S+\.\S+/)) {
            setEmailError("Invalid email");
            isValid = false;
        }
        if (!password || password.length < 6) {
            setPasswordError("Invalid password");
            isValid = false;
        }

        if (isValid) {
            setSaving(true);
            createUserCredential(email, password)
                .then((userCredential) => {
                    let newuserinfo = {
                        userid: userCredential.user.uid,
                        username: userName,
                        email: userCredential.user.email,
                        password: password
                    };
                    addUser(newuserinfo)
                        .then(function () {
                            setSaving(false);
                            navigation.navigate("LogInScreen");
                        })
                        .catch(function (error) {
                            setSaving(false);
                            alert('Error in saving data!');
                        });
                })
                .catch((error) => {
                    setSaving(false);
                    if (error.code == "auth/invalid-email") {
                        // email error
                        setEmailError("Invalid email");
                    }
                    else if (error.code == "auth/internal-error") {
                        // email and password error
                        setEmailError("Invalid email");
                        setPasswordError("Invalid password");
                    }
                    else if (error.code == "auth/weak-password") {
                        // weak password (must have at least 6 characters)
                        setPasswordError("Password must have at least 6 characters");
                    }
                    else {
                        // firebase error
                        console.log(error);
                        alert('Server Error!');
                    }
                });
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 8 }}>
            <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <View style={{ justifyContent: 'center', flex: 1, marginHorizontal: 20, alignItems: 'center' }}>
                    <View style={{ width: 70, height: 70, borderWidth: 3, borderRadius: 100, justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                        <Icon style={{ fontSize: 60, color: "#000000" }} name='account-outline' />
                    </View>
                    <Input label="Username" setState={setUserName} placeholder="Username" error={userNameError} setError={setUserNameError} />
                    <Input label="Email" setState={setEmail} placeholder="Email" error={emailError} setError={setEmailError} />
                    <Input label="Password" setState={setPassword} placeholder="Password" hidePass={true} error={passwordError} setError={setPasswordError} />
                    <View style={{ flexDirection: 'row', width: '45%' }}>
                        <AnimatedButton state={saving} pressfunction={signUp} linearGradientStyle={{ flex: 1, borderRadius: 10 }} title="SIGN UP" textStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }} buttonStyle={{ marginVertical: 5, alignItems: 'center', height: 50, justifyContent: 'center', borderRadius: 8 }} />
                    </View>
                </View>
            </KeyboardAvoidingView>
            <View style={{ justifyContent: 'flex-end', paddingBottom: 30, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('LogInScreen')}>
                    <Text style={{ fontWeight: 'bold' }}>Have an account? Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


//styles
const styles = {
    label: {
        marginVertical: 5,
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 5
    },
    inputContainer: {
        height: 55,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderWidth: 0.8,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 8,
        fontSize: 13
    }
}