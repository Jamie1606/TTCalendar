// Name: Zay Yar Tun
// Class: DIT/FT/1B/02
// Admin No: 2235035
// arrow emoji taken from https://fsymbols.com/signs/arrow/

import React from 'react';
import { Text, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import CheckBox from './CheckBox';
import { convertTime, checkSameDate, changeHeader, refreshContent } from './functions';
import { LinearGradient } from 'expo-linear-gradient';
import { editUserData } from '../firebase/userdata';

function CalendarMonth(props) {
    const { dateState, updateDate, tasks, data } = props;
    const calendarData = data.filter(e => e.status != "unplanned" && dateState.getMonth() == new Date(e.startDate).getMonth());
    let year = dateState.getFullYear();
    let month = dateState.getMonth();
    const daynames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let date = new Date(year, month, 1);        // year, month, day
    let newdate = new Date(year, month + 1, 1);
    let diff = (newdate - date) / 1000 / 3600 / 24;
    let count = 0;
    while (date.getDay() != 0) {
        date.setDate(date.getDate() - 1);
        count--;
    }
    count = Math.abs(count) + diff;

    let temparr = [], datearr = [];
    for (let i = 0; i < (count / 7); i++) {
        temparr = [];
        for (let j = 0; j < 7; j++) {
            temparr.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
            date.setDate(date.getDate() + 1);
        }
        datearr.push(temparr);
    }

    const dayList = daynames.map((day, index) => {
        return <Text style={{ flex: 1, color: '#333', textAlign: 'center', fontWeight: 'bold' }} key={index}>{day}</Text>;
    })

    let colorStyle, fontStyle, borderWidth;
    const dateList = datearr.map((date, index) => {
        return <View style={{ flex: 1, justifyContent: 'space-around', flexDirection: 'row', padding: 4 }} key={index}>
            {
                date.map((date, index) => {
                    borderWidth = 0;
                    if (date.getMonth() != dateState.getMonth()) {
                        colorStyle = "#bbb";
                        fontStyle = "normal";
                    }
                    else {
                        colorStyle = "#000";
                        fontStyle = "normal";
                        if (calendarData.length != 0 && calendarData.findIndex(e => new Date(e.startDate).getDate() === date.getDate()) != -1) {
                            borderWidth = 1.5;
                        }
                    }
                    if (checkSameDate(date, dateState)) {
                        return (
                            <LinearGradient key={index} colors={['#ff4331', '#ff4066', '#ff4331']} start={[0, 0]} end={[1, 1]} location={[0.25, 0.4, 1]} style={{
                                flex: 1, borderRadius: 50, justifyContent: 'center', padding: 8
                            }}>
                                <TouchableOpacity
                                    onPress={() => { updateDate(new Date(date.getFullYear(), date.getMonth(), date.getDate())) }}
                                >
                                    <Text style={{ flex: 1, textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{date.getDate()}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        );
                    }
                    else {
                        return (
                            <TouchableOpacity style={{
                                flex: 1, borderRadius: 50, justifyContent: 'center', padding: 8, borderBottomWidth: borderWidth, borderBottomColor: 'red'
                            }} key={index}
                                onPress={() => { updateDate(new Date(date.getFullYear(), date.getMonth(), date.getDate())) }}
                            >
                                <Text style={{ flex: 1, textAlign: 'center', color: colorStyle, fontWeight: fontStyle }}>{date.getDate()}</Text>
                            </TouchableOpacity>
                        );
                    }
                })}
        </View>;
    });

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', padding: 4 }}>
                {dayList}
            </View>
            {dateList}
            <Text style={{ padding: 16, fontWeight: 'bold' }}>Upcoming ({tasks})</Text>
        </View>
    );
}

export default function MonthScreen(props) {
    const { paramObj, navigation } = props;
    const { dateState, updateDate, data, updateData, colorarr, userid } = paramObj;
    const [calendarData, updateCalendarData] = React.useState(data);
    const [refresh, setRefresh] = React.useState(false);
    const homeStackNav = navigation.getParent("homeStackNav");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    changeHeader(homeStackNav, { updateDate: updateDate });

    React.useEffect(() => {
        var tempData = data.filter(item => item.status != "unplanned" && checkSameDate(new Date(item.startDate), dateState));
        updateCalendarData(tempData);
    }, [dateState, data]);

    function changeMonth(num) {
        updateDate(new Date(dateState.getFullYear(), dateState.getMonth() + num));
    }

    function updateStatus(item) {
        let newdata = item;
        if (newdata.status == "planned")
            newdata.status = "completed";
        else
            newdata.status = "planned";
        editUserData(newdata)
            .then(function () {
                data.splice(data.findIndex(e => e.id === item.id), 1);
                updateData([...data, newdata].sort((a, b) => {
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                }));
            })
            .catch(function (error) {
                alert('Error in saving data!');
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => refreshContent(userid, setRefresh, updateData)} />}
                ListHeaderComponent={() => (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: 8 }}>
                            <TouchableOpacity onPress={() => changeMonth(-1)}>
                                <Text style={styles.backArrow}>➤</Text>
                            </TouchableOpacity>
                            <Text style={styles.currentMonth}>{months[dateState.getMonth()]}, {dateState.getFullYear()}</Text>
                            <TouchableOpacity onPress={() => changeMonth(1)}>
                                <Text style={styles.frontArrow}>➤</Text>
                            </TouchableOpacity>
                        </View>
                        <CalendarMonth dateState={dateState} data={data} updateDate={updateDate} tasks={calendarData.length} />
                    </>
                )}
                ListFooterComponent={() => (
                    <View style={{ paddingBottom: 70 }}></View>
                )}
                data={calendarData}
                renderItem={({ item }) => {
                    let color = colorarr[item.color].label.toLowerCase();
                    let remainingtime = "";
                    let diff = new Date(item.startDate).getTime() - new Date().getTime();
                    if (checkSameDate(new Date(), new Date(item.startDate))) {
                        let temptime = Math.floor(diff / (1000 * 60 * 60));
                        if (temptime > 1) {
                            remainingtime = "In " + temptime + " hour";
                        }
                        else if (temptime == 0) {
                            temptime = Math.floor(diff / (1000 * 60));
                            remainingtime = "In " + temptime + " min";
                        }
                    }
                    else {
                        let tempday = Math.floor(diff / (1000 * 60 * 60 * 24));
                        if (tempday == 0) {
                            tempday = Math.floor(diff / (1000 * 60 * 60));
                            if (tempday == 0) {
                                tempday = Math.floor(diff / (1000 * 60));
                                remainingtime = "In " + tempday + " min";
                            }
                            else {
                                remainingtime = "In " + tempday + " hour";
                            }
                        }
                        else if (tempday >= 1) {
                            remainingtime = "In " + tempday + " day";
                        }
                    }
                    return (
                        <TouchableOpacity onPress={() => {
                            homeStackNav.navigate("DetailScreen",
                                {
                                    dataid: item.id,
                                    navigationName: 'homeStackNav'
                                })
                        }}>
                            <View style={[styles.listOuterView, { borderColor: color }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black" }}>{item.name}</Text>
                                    <Text style={{ fontSize: 12, color: "black", opacity: 0.7, paddingTop: 8 }}>
                                        {
                                            (item.type == 0) ? convertTime(item.startTime) + " - " + convertTime(item.endTime) : convertTime(item.startTime)
                                        }
                                    </Text>
                                </View>
                                <View style={{ marginLeft: 8, justifyContent: 'center' }}>
                                    {
                                        item.type == 1 && <CheckBox iconStyle={{ borderRadius: 10 }} innerIconStyle={{ borderRadius: 10 }} size={35} fillColor={color} initialState={(item.status == "completed") ? true : false} updateStatus={() => updateStatus(item)} />
                                    }
                                    {
                                        item.type == 0 && <Text>{remainingtime}</Text>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={item => item.id}
            />
            <LinearGradient colors={['#ff4331', '#ff4066', '#ff4331']} start={[0, 0]} end={[1, 1]} location={[0.25, 0.4, 1]} style={{ position: 'absolute', width: 70, height: 70, bottom: 20, right: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => homeStackNav.navigate("AddDetailScreen", {
                    action: "add",
                    type: 0,
                    navigationName: 'homeStackNav'
                })}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>+</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const styles = {
    frontArrow: {
        fontSize: 30
    },
    backArrow: {
        fontSize: 30,
        transform: [
            { scaleX: -1 },
            { scaleY: 1 }
        ]
    },
    listOuterView: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 15,
        borderWidth: 1,
        margin: 8,
        marginHorizontal: 16
    },
    currentMonth: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black'
    }
};