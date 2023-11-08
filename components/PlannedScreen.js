// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022

import React from 'react';
import { Text, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { convertTime, refreshContent } from './functions';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { editUserData } from '../firebase/userdata';
import CheckBox from './CheckBox';

export default function PlannedScreen(props) {
    const flatListRef = React.useRef(null);
    const { paramObj } = props;
    const { data, colorarr, updateData, userid } = paramObj;
    const [sortValue, setSortValue] = React.useState(-1);
    const [refresh, setRefresh] = React.useState(false);
    const [plannedData, setPlannedData] = React.useState(
        data.filter(e => (e.status == "planned") && (e.type == 1))
    ); // filter the (planned data) only
    const choice = [
        {
            label: "A-Z",
            value: 1
        },
        {
            label: "Oldest",
            value: 2
        },
        {
            label: "Newest",
            value: 3
        }];

    React.useEffect(() => {
        setPlannedData(data.filter(e =>
            (e.status == "planned") && (e.type == 1)));
    }, [data]);//any update to (data), setPlannedData();

    function updateStatus(item) {
        item.status = "completed";
        editUserData(item)
            .then(function () {
                data.splice(data.findIndex(e => e.id === item.id), 1);
                updateData([...data, item].sort((a, b) => {
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                }));
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const renderItem = ({ item }) => {
        let startTime = convertTime(item.startTime);
        let endDate = new Date(item.startDate);
        let date = endDate.getDate();
        let month = endDate.getMonth() + 1;
        if (date < 10) {
            date = "0" + date;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let color = colorarr[item.color].label.toLowerCase();
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={() => props.navigation.navigate('DetailScreen', {
                data: item,
                dataid: item.id,
                navigationName: 'listStackNav',
            })}>
                <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 15, borderWidth: 1, margin: 8, borderColor: color, marginHorizontal: 16 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black" }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: "black", opacity: 0.8, paddingLeft: 5, paddingTop: 8 }}>
                            Due Date : {date + "-" + month + "-" + endDate.getFullYear()}
                        </Text>
                        <Text style={{ fontSize: 10, color: "black", opacity: 0.7, paddingLeft: 5, paddingTop: 8 }}>{startTime}</Text>
                    </View>
                    <View style={{ marginLeft: 8, justifyContent: 'center' }}>
                        {
                            <CheckBox
                                iconStyle={{ borderRadius: 10 }}
                                innerIconStyle={{ borderRadius: 10 }}
                                size={35}
                                fillColor={color}
                                initialState={(item.status == "completed") ? true : false}
                                updateStatus={() => updateStatus(item)}
                            />
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={{ flex: 1, paddingHorizontal: 5, backgroundColor: 'white' }}>
            <FlatList
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => refreshContent(userid, setRefresh, updateData)} />}
                ref={flatListRef}
                ListHeaderComponent={() => (
                    <View style={{ flexDirection: 'row', padding: 20 }}>
                        <Text style={{ flex: 1, alignItems: 'flex-start', paddingTop: 13, fontWeight: 'bold' }}> Planned ({plannedData.length})</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={choice}
                                labelField="label"
                                valueField="value"
                                placeholder={(sortValue == -1) ? 'Sort By' : choice[sortValue].label}
                                value={null}
                                onChange={e => {
                                    setSortValue(e.value - 1);
                                    let tempdata = data.filter(e =>
                                        (e.status === "planned") && (e.type === 1));
                                    if (e.value == 1) {
                                        setPlannedData(tempdata.sort((a, b) => {
                                            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                                        }))
                                    }
                                    else if (e.value == 2) {
                                        setPlannedData(tempdata.sort((a, b) => {
                                            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                                        }))
                                    }
                                    else if (e.value == 3) {
                                        setPlannedData(tempdata.sort((a, b) => {
                                            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                                        }))
                                    }
                                }}
                                statusBarIsTranslucent={(Platform.OS == "android" ? true : false)}
                            />
                        </View>
                    </View>
                )}
                ListFooterComponent={() => {
                    if (plannedData.length >= 5) {
                        return (<View style={{ padding: 40, alignItems: 'center' }}>
                            <TouchableOpacity style={{ alignItems: 'center', }}
                                onPress={() => { flatListRef.current.scrollToOffset({ animated: true, offset: 0 }) }} >
                                <FeatherIcon color='#ff4331' style={{ fontSize: 20 }} name='chevron-up' />
                                <Text style={{ color: '#ff4331', fontSize: 15 }}>Scroll to Top</Text>
                            </TouchableOpacity>
                        </View>)
                    }
                    else {
                        return (
                            <View style={{ padding: 50, alignItems: 'center' }}></View>
                        )
                    }
                }}
                data={plannedData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <LinearGradient colors={['#ff4331', '#ff4066', '#ff4331']} start={[0, 0]} end={[1, 1]} location={[0.25, 0.4, 1]} style={{ position: 'absolute', width: 70, height: 70, bottom: 20, right: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => props.navigation.navigate("AddDetailScreen", {
                    action: "add",
                    type: 1,
                    navigationName: 'listStackNav'
                })}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>+</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const styles = {
    dropdown: {
        height: 40,
        width: 120,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: {
            height: 3
        },
        elevation: 3
    },
    placeholderStyle: {
        fontSize: 13,
        marginLeft: 8
    },
    selectedTextStyle: {
        fontSize: 13,
        marginLeft: 8
    }
}