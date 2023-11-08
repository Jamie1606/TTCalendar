// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022

import React from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserCredential } from '../firebase/auth';
import AnimatedButton from './AnimatedButton';
import CheckBox from './CheckBox';

const Input = React.forwardRef((props, ref) => {
    const { label, setState, hidePass, error, setError } = props;
    const [isFocused, setIsFocused] = React.useState(false);
    const [hidePassword, setHidePassword] = React.useState(hidePass);
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.inputContainer, { width: '95%' }, { borderColor: error ? 'red' : isFocused ? 'black' : '#BABBC3' }]}>
                    <TextInput ref={ref} secureTextEntry={hidePassword}
                        style={{ width: (hidePass) ? '90%' : '98%', alignItems: 'flex-start', color: '#000' }}
                        {...props} placeholderTextColor='#BABBC3'
                        onChangeText={(text) => setState(text.trim())}
                        onFocus={() => { setIsFocused(true); setError(false); }}  // isFocused
                        onBlur={() => { setIsFocused(false) }}  // not focused
                    />
                    {
                        hidePass && <Icon style={{ fontSize: 22, color: '#BABBC3', alignItems: 'flex-end' }}
                            onPress={() => setHidePassword(!hidePassword)}
                            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                        />
                    }
                </View>
                <View style={{ width: '5%' }}>
                    {
                        error && <Text style={{ color: 'red', fontSize: 30, paddingLeft: 8, fontWeight: 'bold' }}>!</Text>
                    }
                </View>
            </View>
        </View>
    );
})

export default function LogInScreen(props) {
    const { navigation } = props;

    const emailInputRef = React.useRef();
    const passwordInputRef = React.useRef();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [remember, setRemember] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [logging, setLogging] = React.useState(false);

    function login() {
        let isValid = true;
        if (!email) {
            setEmailError(true);
            isValid = false;
        }
        if (!password) {
            setPasswordError(true);
            isValid = false;
        }
        if (isValid) {
            setLogging(true);
            getUserCredential(email, password)
                .then(function (userCredential) {
                    if (remember) {
                        AsyncStorage.setItem('user', JSON.stringify(userCredential.user))
                            .then(function () {
                                setEmail("");
                                setPassword("");
                                setRemember(false);
                                setLogging(false);
                                setEmailError(false);
                                setPasswordError(false);
                                emailInputRef.current.clear();
                                passwordInputRef.current.clear();
                                emailInputRef.current.focus();
                                navigation.navigate('HomeScreen', {
                                    userid: userCredential.user.uid
                                });
                            })
                            .catch(function (error) {
                                // local storage error
                                console.log(error);
                                setLogging(false);
                                alert("Error in storing data locally!");
                            })
                    }
                    else {
                        setEmail("");
                        setPassword("");
                        setRemember(false);
                        setLogging(false);
                        setEmailError(false);
                        setPasswordError(false);
                        emailInputRef.current.clear();
                        passwordInputRef.current.clear();
                        emailInputRef.current.focus();
                        navigation.navigate('HomeScreen', {
                            userid: userCredential.user.uid
                        });
                    }
                })
                .catch((error) => {
                    // login error
                    console.log(error);
                    setEmailError(true);
                    setPasswordError(true);
                    setLogging(false);
                    alert('Invalid email and password!');
                });
        }
        else {
            alert('Invalid email and password');
        }
    }

    function updateStatus() {
        setRemember(!remember);
    }

    return (
        <View style={{ flex: 1, padding: 8, backgroundColor: 'white' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <View style={{ justifyContent: 'center', flex: 1, marginHorizontal: 20, alignItems: 'center' }}>
                    <View style={{
                        width: 70, height: 70, borderWidth: 3, borderRadius: 100, justifyContent: 'center', alignItems: 'center', margin: 10
                    }}>
                        <Icon style={{ fontSize: 60, color: '#000000' }} name="account-outline" />
                    </View>
                    <Input ref={emailInputRef} label="Email" setState={setEmail} error={emailError} setError={setEmailError} placeholder="Email" hidePass={false} />
                    <Input ref={passwordInputRef} label="Password" setState={setPassword} error={passwordError} setError={setPasswordError} placeholder="Password" hidePass={true} />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingBottom: 25, width: '100%' }}>
                        <CheckBox iconStyle={{ borderRadius: 5 }} innerIconStyle={{ borderRadius: 5 }} size={18} fillColor="black" initialState={remember} updateStatus={updateStatus} />
                        <Text style={{ fontSize: 13 }}>Remember Me</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '35%' }}>
                        <AnimatedButton state={logging} pressfunction={login} linearGradientStyle={{ flex: 1, borderRadius: 10 }} title="LOG IN" textStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }} buttonStyle={{ marginVertical: 5, alignItems: 'center', height: 50, justifyContent: 'center', borderRadius: 8 }} />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 30,
                        }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        <View>
                            <Text style={{ width: 50, textAlign: 'center', fontWeight: 'bold' }}>OR</Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    </View>
                    <TouchableOpacity>
                        <Text style={{ fontWeight: 'bold' }}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <View
                style={{
                    justifyContent: 'flex-end',
                    paddingBottom: 30,
                    alignItems: 'center',
                }}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('SignUpScreen')}>
                    <Text style={{ fontWeight: 'bold' }}>
                        Don't have an account? Sign up
                    </Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}

//styles
const styles = {
    label: {
        marginVertical: 5,
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 5,
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
        fontSize: 13,
    }

}