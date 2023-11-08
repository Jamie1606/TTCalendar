// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022

import React from 'react';
import { Text, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import CheckBox from './CheckBox';
import { Dropdown } from 'react-native-element-dropdown';
import { convertTime, refreshContent } from './functions';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { editUserData } from '../firebase/userdata';

export default function CompletedScreen(props) {
    const flatListRef = React.useRef(null);
    const { paramObj } = props;
    const { data, colorarr, userid, updateData } = paramObj;
    const [sortValue, setSortValue] = React.useState(-1);
    const [refresh, setRefresh] = React.useState(false);
    const [completedData, setCompletedData] = React.useState(data.filter(e =>
        (e.status == "completed") && (e.type == 1)))

    const choice = [
        {
            label: "A-Z",
            value: "1"
        },
        {
            label: "Oldest",
            value: "2"
        },
        {
            label: "Newest",
            value: "3"
        }];
    React.useEffect(() => {
        setCompletedData(data.filter(e =>
            (e.status == "completed") && (e.type == 1)));
    }, [data]);//any update to (data), setCompletedData();

    function updateStatus(item) {
        item.status = "planned";
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
        let month = endDate.getMonth() + 1;
        let date = endDate.getDate();
        if (date < 10) {
            date = "0" + date;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let color = colorarr[item.color].label.toLowerCase();
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={() => props.navigation.navigate('DetailScreen', {
                dataid: item.id,
                navigationName: 'listStackNav'
            })}>
                <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 15, borderWidth: 1, borderColor: color, margin: 8, marginHorizontal: 16 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black" }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, paddingLeft: 5, opacity: 0.8, color: "black", paddingTop: 8 }}>
                            Date : {date + "-" + month + "-" + endDate.getFullYear()}
                        </Text>
                        <Text style={{ fontSize: 10, paddingLeft: 5, opacity: 0.7, color: "black", paddingTop: 8 }}>
                            {startTime}
                        </Text>
                    </View>
                    <View style={{ marginLeft: 8, justifyContent: 'center' }}>
                        {
                            <CheckBox
                                iconStyle={{ borderRadius: 10 }} innerIconStyle={{ borderRadius: 10 }} size={35} fillColor={color}
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
                        <Text style={{ flex: 1, alignItems: 'flex-start', paddingTop: 13, fontWeight: 'bold' }}> Completed ({completedData.length})</Text>
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
                                        (e.status === "completed") && (e.type === 1));
                                    if (e.value == 1) {
                                        setCompletedData(tempdata.sort((a, b) => {
                                            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                                        }))
                                    }
                                    else if (e.value == 2) {
                                        setCompletedData(tempdata.sort((a, b) => {
                                            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                                        }))
                                    }
                                    else if (e.value == 3) {
                                        setCompletedData(tempdata.sort((a, b) => {
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
                    if (completedData.length >= 5) {
                        return (<View style={{ padding: 40, alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ alignItems: 'center', }}
                                onPress={() => { flatListRef.current.scrollToOffset({ animated: true, offset: 0 }) }} >

                                <FeatherIcon color='#ff4331' style={{ fontSize: 20 }} name='chevron-up' />
                                <Text style={{ color: '#ff4331', fontSize: 15 }}>Scroll to Top</Text>
                            </TouchableOpacity>
                        </View>)
                    }
                    else {
                        return (<View style={{ padding: 50, alignItems: 'center' }}>
                        </View>)
                    }
                }}
                data={completedData}
                renderItem={renderItem}
                keyExtractor={item => item.id}

            />

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
            height: 3,
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