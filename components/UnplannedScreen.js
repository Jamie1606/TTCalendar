// Name: THU HTET SAN
// Class: DIT/FT/1B/02
// Admin No: 2235022

import React from 'react';
import { Text, View, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { refreshContent } from './functions';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserDataNewID, refreshUserDataID, addUserData } from '../firebase/userdata';

export default function UnplannedScreen(props) {
    const flatListRef = React.useRef(null);
    const { paramObj, navigation } = props;
    const { data, userid, updateData } = paramObj;
    // set userdataid to 1 by default in case there is no data in firebase
    const [userDataID, setUserDataID] = React.useState(1);
    const [saving, setSaving] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);
    const [sortValue, setSortValue] = React.useState(-1);
    const [unplannedData, setUnplannedData] = React.useState(data.filter(e =>
        (e.status == "unplanned") && (e.type == 1)));

    const choice = [{
        label: "A - Z",
        value: "1"
    },
    {
        label: "Z - A",
        value: "2"
    },
    {
        label: "Default",
        value: "3"
    }];

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                navigation.navigate("AddDetailScreen",
                    {
                        action: "edit",
                        type: item.type,
                        dataid: item.id,
                        navigationName: "listStackNav"
                    })
            }
            }>
                <View style={{ padding: 26, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 15, borderWidth: 0.8, margin: 10, marginHorizontal: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    React.useEffect(() => {
        // get new user data id
        getUserDataNewID()
            .then(function (data) {
                // check whether there is data or not
                if (data != undefined && data.length != 0) {
                    // set new data state to userdata state
                    setUserDataID(data.nextid);
                }
            })
        setUnplannedData(data.filter(e =>
            (e.status == "unplanned") && (e.type == 1)));
    }, [data]);

    function saveUnplanned(event) {
        if (event.nativeEvent.text.trim() != "") {
            setSaving(true);
            let newdata = {
                userid: userid,
                id: userDataID,
                name: event.nativeEvent.text.trim(),
                startDate: '',
                endDate: '',
                startTime: 0,
                endTime: 0,
                type: 1,
                color: 0,
                remind: 0,
                description: '',
                status: 'unplanned'
            };

            // update userdataid by increment 1 in firebase
            refreshUserDataID(newdata.id + 1).then(function () {
                // add new userdata to firebase
                addUserData(newdata)
                    .then(function () {
                        // updating data in data state with sorted recent
                        setSaving(false);
                        updateData([...data, newdata].sort((a, b) => {
                            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                        }));
                    })
                    .catch(function (error) {
                        setSaving(false);
                        console.log(error);
                    });
            });
        }
    }

    return (
        <View style={{ flex: 1, paddingHorizontal: 5, backgroundColor: 'white' }}>
            <FlatList
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => refreshContent(userid, setRefresh, updateData)} />}
                ref={flatListRef}
                ListHeaderComponent={() => (
                    <View>
                        <View style={{ flexDirection: 'row', padding: 20 }}>
                            <Text style={{ flex: 1, alignItems: 'flex-start', paddingTop: 13, fontWeight: 'bold' }}> Unplanned ({unplannedData.length})</Text>
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
                                            (e.status === "unplanned") && (e.type === 1));
                                        if (e.value == 1) {
                                            setUnplannedData(tempdata.sort((a, b) => {
                                                return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                                            }))
                                        }
                                        else if (e.value == 2) {
                                            setUnplannedData(tempdata.sort((a, b) => {
                                                return (b.name < a.name) ? -1 : (b.name > a.name) ? 1 : 0;
                                            }))
                                        }
                                        else if (e.value == 3) {
                                            setUnplannedData(tempdata.sort((a, b) => {
                                                return (a.id - b.id);
                                            }));
                                        }
                                    }}
                                    statusBarIsTranslucent={(Platform.OS == "android" ? true : false)}
                                />
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', padding: 20, marginBottom: 20 }}>
                            <LinearGradient colors={['#ff4331', '#ff4066', '#ff4331']} start={[0, 0]} end={[1, 1]} location={[0.25, 0.4, 1]} style={{ height: 40, padding: 1.5, borderRadius: 8 }}>
                                <View style={{
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    paddingHorizontal: 15,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    borderRadius: 8,
                                    height: 37,
                                }}>
                                    <TextInput
                                        editable={!saving}
                                        selectTextOnFocus={!saving}
                                        placeholder='Enter new list'
                                        style={{ width: '100%', color: '#000' }}
                                        placeholderTextColor='#BABBC3'
                                        onSubmitEditing={(event) => saveUnplanned(event)}
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                )}
                ListFooterComponent={() => {
                    if (unplannedData.length >= 6) {
                        return (
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <TouchableOpacity style={{ alignItems: 'center', }}
                                    onPress={() => { flatListRef.current.scrollToOffset({ animated: true, offset: 0 }) }} >
                                    <FeatherIcon color='#ff4331' style={{ fontSize: 20 }} name='chevron-up' />
                                    <Text style={{ color: '#ff4331', fontSize: 15 }}>Scroll to Top</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }
                    else {
                        return (<View style={{ padding: 50, alignItems: 'center' }}></View>);
                    }
                }}
                data={unplannedData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <LinearGradient colors={['#ff4331', '#ff4066', '#ff4331']} start={[0, 0]} end={[1, 1]} location={[0.25, 0.4, 1]} style={{ position: 'absolute', width: 70, height: 70, bottom: 20, right: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate("AddDetailScreen", {
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