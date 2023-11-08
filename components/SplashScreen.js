import React from 'react';
import { Text, View, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getUser } from '../firebase/userdata';

export default function SplashScreen(props) {
    const { navigation } = props;

    const [state, setState] = React.useState(true);
    const spinValue = React.useRef(new Animated.Value(0));
    const animation = React.useRef(
        Animated.loop(
            Animated.timing(spinValue.current, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true
            })
        )).current;

    React.useEffect(() => {
        if (state) {
            animation.start();
        }
        else {
            animation.stop();
            spinValue.current.setValue(0);
        }
    }, [state]);

    const spin = spinValue.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    React.useEffect(() => {
        setTimeout(() => {
            AsyncStorage.getItem('user')
                .then(function (data) {
                    setState(false);
                    if (!data) {
                        navigation.navigate('LogInScreen');
                    }
                    else {
                        let uid = JSON.parse(data).uid;
                        getUser(uid)
                            .then(function (data) {
                                if (data.length == 1) {
                                    navigation.navigate('HomeScreen', {
                                        userid: uid
                                    })
                                }
                                else {
                                    AsyncStorage.clear();
                                    navigation.navigate('LogInScreen');
                                }
                            })
                    };
                })
                .catch(function (error) {
                    setState(false);
                    alert(error);
                })
        }, (Math.floor(Math.random() * 3) + 1) * 1000);
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'blue', padding: 25, fontSize: 25, fontWeight: 'bold' }}>TT CALENDAR</Text>
            <Text>Planning events and lists for life</Text>
            <Animated.View style={{ transform: [{ rotate: spin }], alignSelf: 'center', padding: 40 }}>
                <AntDesign name="loading2" color={"black"} size={24} />
            </Animated.View>
            <View style={{ position: 'absolute', bottom: 30, left: '25%' }}>
                <Text style={{ textAlign: 'center', fontSize: 16, padding: 8 }}>Developed by</Text>
                <Text style={{ fontWeight: 'bold' }}>Thu Htet San, Zay Yar Tun</Text>
            </View>
        </View>
    );
}