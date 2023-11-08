// Name: Zay Yar Tun
// Class: DIT/FT/1B/02
// Admin No: 2235035


import React from 'react';
import { Text, View, ScrollView, TextInput, StyleSheet, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimatedButton from './AnimatedButton';
import { changeHeader, formatTime, convertToTime } from './functions';
import { getUserDataNewID, addUserData, refreshUserDataID, editUserData } from '../firebase/userdata';

function changeState(state, setState, setState2, setState3, setState4) {
    setState(!state);
    setState2(false);
    setState3(false);
    setState4(false);
}

function changeDate(setState, year, month, day, setShow) {
    setState(new Date(year, month, day));
    if (Platform.OS === 'android') {
        setShow(false);
    }
}

function changeTime(setState, date, hour, minute, setShow) {
    setState(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute));
    if (Platform.OS === 'android') {
        setShow(false);
    }
}

export default function AddDetailScreen(props) {
    const { paramObj, navigation, route } = props;
    const { action, type, navigationName, dataid } = route.params;
    const { dateState, colorarr, typearr, remindarr, updateData, updateDate, userid, data } = paramObj;


    const scrollRef = React.useRef(null);

    let currentData;
    if (action == "edit") {
        currentData = data.filter(e => e.id === dataid);
        currentData = currentData[0];
    }

    const addDetailNav = navigation.getParent(navigationName);
    changeHeader(addDetailNav, { title: action.toUpperCase() + " " + typearr[type].label.toUpperCase() });


    let sdate, edate;
    if (action == "add" || currentData.status == "unplanned") {
        sdate = new Date(dateState.toISOString());
        edate = new Date(dateState.toISOString());
    }
    else {
        sdate = new Date(currentData.startDate);
        if (type == 1)
            edate = new Date(currentData.startDate);
        else
            edate = new Date(currentData.endDate);
    }

    if (action == "add") {
        if (sdate.getMinutes() != 0) {
            sdate.setMinutes(60);
        }
        if (edate.getMinutes() != 0) {
            edate.setMinutes(60);
        }
        edate.setHours(edate.getHours() + 1);
    }

    const [userDataID, setUserDataID] = React.useState(1);
    const [name, setName] = React.useState("");
    const [startDate, updateStartDate] = React.useState(sdate);
    const [endDate, updateEndDate] = React.useState(edate);
    const [typeValue, setTypeValue] = React.useState(type);
    const [colorValue, setColorValue] = React.useState(0);
    const [remindValue, setRemindValue] = React.useState(0);
    const [descriptionValue, setDescriptionValue] = React.useState("");
    const [startDateShow, setstartDateShow] = React.useState(false);
    const [endDateShow, setendDateShow] = React.useState(false);
    const [startTimeShow, setStartTimeShow] = React.useState(false);
    const [endTimeShow, setEndTimeShow] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (action == "edit") {
            setUserDataID(currentData.id);
            setColorValue(currentData.color);
            setRemindValue(currentData.remind);
            setDescriptionValue(currentData.description);
            setName(currentData.name);
        }
        getUserDataNewID()
            .then(function (data) {
                if (data != undefined && data.length != 0) {
                    if (action == "add")
                        setUserDataID(data.nextid);
                }
            })
    }, []);

    const daynames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthnames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function checkData() {
        let condition = true;
        if (name.trim() === "") {
            alert('Title cannot be empty!');
            condition = false;
        }
        else if (typeValue == 0) {
            if (startDate.getTime() >= endDate.getTime()) {
                alert('Start date must be before end date!');
                condition = false;
            }
        }
        return condition;
    }

    function saveData() {
        if (!checkData()) return;
        setSaving(true);
        let newdata = {
            userid: userid,
            id: userDataID,
            name: name.trim(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            startTime: convertToTime(startDate),
            endTime: convertToTime(endDate),
            type: typeValue,
            color: colorValue,
            remind: remindValue,
            description: descriptionValue.trim(),
            status: (action == "add") ? 'planned' : (currentData.status == "unplanned") ? 'planned' : currentData.status
        };

        if (action == "add") {
            refreshUserDataID(newdata.id + 1).then(function () {
                addUserData(newdata)
                    .then(function () {
                        updateData([...data, newdata].sort((a, b) => {
                            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                        }));
                        setSaving(false);
                        addDetailNav.goBack();
                    })
                    .catch(function (error) {
                        setSaving(false);
                        console.log(error);
                    });
            });
        }
        else {
            editUserData(newdata)
                .then(function () {
                    data.splice(data.findIndex(e => e.id === newdata.id), 1);
                    updateData([...data, newdata].sort((a, b) => {
                        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                    }));
                    setSaving(false);
                    addDetailNav.goBack();
                })
                .catch(function (error) {
                    setSaving(false);
                    console.log(error);
                })
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={80}>
            <ScrollView style={{ padding: 16, backgroundColor: 'white' }} ref={scrollRef}>
                <TextInput
                    style={{ fontSize: 22, borderBottomWidth: 1, padding: 8 }}
                    placeholder={(action == "edit") ? "" : 'Add Title'}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <View style={{ padding: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity style={{ flex: 1 }}
                            onPress={() => changeState(startDateShow, setstartDateShow, setendDateShow, setStartTimeShow, setEndTimeShow)}>
                            <Text style={styles.text}>
                                {daynames[startDate.getDay()] + ", " + startDate.getDate() + " " + monthnames[startDate.getMonth()]}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}
                            onPress={() => changeState(startTimeShow, setStartTimeShow, setstartDateShow, setEndTimeShow, setendDateShow)}>
                            <Text style={styles.text}>{formatTime(startDate.getHours(), startDate.getMinutes())}</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        startTimeShow && <DateTimePicker
                            display={(Platform.OS === 'ios') ? 'spinner' : 'default'}
                            value={new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes())}
                            mode="time"
                            onChange={(event, selectedDate) => {
                                changeTime(updateStartDate, selectedDate, selectedDate.getHours(), selectedDate.getMinutes(), setStartTimeShow)
                            }}
                        />
                    }
                    {
                        startDateShow && <DateTimePicker
                            display={(Platform.OS === 'ios') ? 'spinner' : 'default'}
                            value={new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())}
                            mode="date"
                            onChange={(event, selectedDate) => {
                                changeDate(updateStartDate, selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), setstartDateShow)
                            }}
                        />}
                    {
                        typeValue == 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity style={{ flex: 1 }}
                                onPress={() => changeState(endDateShow, setendDateShow, setstartDateShow, setStartTimeShow, setEndTimeShow, setendDateShow)}>
                                <Text style={styles.text}>
                                    {daynames[endDate.getDay()] + ", " + endDate.getDate() + " " + monthnames[endDate.getMonth()]}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}
                                onPress={() => changeState(endTimeShow, setEndTimeShow, setStartTimeShow, setstartDateShow, setendDateShow)}>
                                <Text style={styles.text}>{formatTime(endDate.getHours(), endDate.getMinutes())}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        typeValue == 0 && endDateShow && <DateTimePicker
                            display={(Platform.OS === 'ios') ? 'spinner' : 'default'}
                            value={new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())}
                            mode="date"
                            onChange={(event, selectedDate) => {
                                changeDate(updateEndDate, selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), setendDateShow)
                            }}
                        />
                    }
                    {
                        typeValue == 0 && endTimeShow && <DateTimePicker
                            display={(Platform.OS === 'ios') ? 'spinner' : 'default'}
                            value={new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes())}
                            mode="time"
                            onChange={(event, selectedDate) => {
                                changeTime(updateEndDate, selectedDate, selectedDate.getHours(), selectedDate.getMinutes(), setEndTimeShow)
                            }}
                        />
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.text}>Type</Text>
                        <Dropdown
                            style={{ paddingHorizontal: 16, marginBottom: 30, borderWidth: 1, flex: 1, borderRadius: 10 }}
                            data={typearr}
                            labelField="label"
                            valueField="value"
                            selectedTextStyle={styles.dropdownSelectedText}
                            placeholder={typearr[typeValue].label}
                            value={typeValue}
                            onChange={item => {
                                setTypeValue(item.value);
                            }}
                            statusBarIsTranslucent={(Platform.OS == "android" ? true : false)}
                            dropdownPosition="bottom"
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.text}>Color</Text>
                        <Dropdown
                            style={{ paddingHorizontal: 16, marginBottom: 30, borderColor: colorarr[colorValue].label.toLowerCase(), borderWidth: (colorValue == 0) ? 1 : 2, flex: 1, borderRadius: 10 }}
                            data={colorarr}
                            selectedTextStyle={{ fontSize: 15, color: colorarr[colorValue].label.toLowerCase() }}
                            labelField="label"
                            valueField="value"
                            placeholder={colorarr[colorValue].label}
                            value={colorValue}
                            onChange={item => {
                                setColorValue(item.value);
                            }}
                            statusBarIsTranslucent={(Platform.OS === "android" ? true : false)}
                            dropdownPosition="bottom"
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.text}>Remind</Text>
                        <Dropdown
                            style={{ paddingHorizontal: 16, marginBottom: 30, borderWidth: 1, flex: 1, borderRadius: 10 }}
                            data={remindarr}
                            labelField="label"
                            valueField="value"
                            selectedTextStyle={styles.dropdownSelectedText}
                            placeholder={remindarr[remindValue].label}
                            value={remindValue}
                            onChange={item => {
                                setRemindValue(item.value);
                            }}
                            statusBarIsTranslucent={(Platform.OS == "android" ? true : false)}
                            dropdownPosition="bottom"
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 15, marginBottom: 8 }}>Description</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={25}
                            style={{ borderWidth: 1, textAlignVertical: 'top', fontSize: 15, padding: 4 }}
                            onChangeText={(text) => setDescriptionValue(text)}
                            onFocus={() => {
                                if (Platform.OS === 'ios') {
                                    setTimeout(function () {
                                        scrollRef.current.scrollToEnd({ animated: true });
                                    }, 500);
                                }
                            }}
                            value={descriptionValue}
                        />
                    </View>
                    <AnimatedButton state={saving} pressfunction={saveData}
                        linearGradientStyle={{ alignSelf: 'flex-end', marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, marginBottom: 16, backgroundColor: '#4681f4' }} title="Save" textStyle={{ color: 'white', fontWeight: 'bold' }} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 30,
        flex: 1,
        fontSize: 15
    },
    dropdownSelectedText: {
        fontSize: 15
    }
});