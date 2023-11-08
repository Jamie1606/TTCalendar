import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { changeHeader } from './functions';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function ComingSoonScreen(props) {
    const { navigation } = props;
    const [hourState, setHourState] = React.useState(1);
    const [minState, setMinState] = React.useState(0);
    const [secondState, setSecondState] = React.useState(0);
    const [timer, setTimer] = React.useState("");
    const [colorState1, setColorState1] = React.useState("#000000");
    const [colorState2, setColorState2] = React.useState("#000000");
    const settingStackNav = navigation.getParent("settingStackNav");
    changeHeader(settingStackNav);
    const randColorarr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

    const getTimer = () => {
        let timerstr = "";
        if (hourState < 10)
            timerstr += "0" + hourState + ":";
        else
            timerstr += hourState + ":";
        if (minState < 10)
            timerstr += "0" + minState + ":";
        else
            timerstr += minState + ":";
        if (secondState < 10)
            timerstr += "0" + secondState;
        else
            timerstr += secondState;
        setTimer(timerstr);
    }

    const backValue = new Animated.Value(0);
    Animated.timing(backValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: true
    }).start();

    const back = backValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 150]
    })

    const frontValue = new Animated.Value(0);
    Animated.timing(frontValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: true
    }).start();

    const front = frontValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -150]
    })

    const getRandomColor = (setState) => {
        let randColor = "#";
        for (let i = 0; i < 6; i++) {
            let rand = Math.floor(Math.random() * randColorarr.length);
            randColor += randColorarr[rand];
        }
        setState(randColor);
    };

    React.useEffect(() => {
        setTimeout(() => {
            if (secondState <= 0) {
                setSecondState(59);
                if (minState <= 0) {
                    setMinState(59);
                    setHourState(hourState - 1);
                }
                else
                    setMinState(minState - 1);
            }
            else
                setSecondState(secondState - 1);
            if (hourState <= 0 && minState <= 0 && secondState <= 0)
                setHourState(1);
            getRandomColor(setColorState1);
            getRandomColor(setColorState2);
            getTimer();
        }, 1000);
    }, [secondState, minState, hourState]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', padding: 16 }}>
                <Animated.View style={{ transform: [{ translateX: front }] }}>
                    <AntDesign name="fastbackward" size={25} />
                </Animated.View>
                <Animated.View style={{ transform: [{ translateX: back }] }}>
                    <AntDesign name="fastforward" size={25} />
                </Animated.View>
            </View>
            <Text style={{ fontSize: 20, color: colorState2, fontWeight: 'bold' }}>Coming Soon</Text>
            <Text style={{ padding: 20, color: colorState1, fontSize: 15 }}>{timer}</Text>
        </View >
    );
}