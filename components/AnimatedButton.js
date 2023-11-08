import React from 'react';
import { Animated, TouchableOpacity, Text, Easing } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function AnimatedButton(props) {
    const { state, pressfunction, linearGradientStyle, title, buttonStyle, textStyle } = props;

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

    return (
        <LinearGradient colors={['#ff4331', '#ff4066', '#ff4331']} start={[0, 0]} end={[1, 1]} location={[0.25, 0.4, 1]} style={linearGradientStyle}>
            <TouchableOpacity style={buttonStyle} disabled={state} onPress={pressfunction}>
                {
                    (!state && <Text style={textStyle}>{title}</Text>)
                }
                {
                    (
                        state && <Animated.View style={{ transform: [{ rotate: spin }], alignSelf: 'center' }}>
                            <AntDesign name="loading2" color={"white"} size={24} />
                        </Animated.View>
                    )
                }
            </TouchableOpacity>
        </LinearGradient>
    );
}