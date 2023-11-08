// Name: Zay Yar Tun
// Class: DIT/FT/1B/02
// Admin No: 2235035


import React from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { changeHeader, convertTime } from './functions';


function formatDateTime(startDate, startTime, endDate, endTime, type) {
    let str = "";
    startDate = new Date(startDate);
    const monthnames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (type == 0) {
        endDate = new Date(endDate);
        str += startDate.getDate() + " " + monthnames[startDate.getMonth()] + " ";
        str += convertTime(startTime) + " - ";
        str += endDate.getDate() + " " + monthnames[endDate.getMonth()] + " ";
        str += convertTime(endTime);
    }
    else {
        str += startDate.getDate() + " " + monthnames[startDate.getMonth()] + " ";
        str += convertTime(startTime);
    }
    return str;
}

export default function SearchScreen(props) {
    const { navigation, route, paramObj } = props;
    const { data, colorarr } = paramObj;
    const { navigationName } = route.params;
    const [search, updateSearch] = React.useState("");
    const [searchData, updateSearchData] = React.useState([]);
    const searchNav = navigation.getParent(navigationName);

    changeHeader(searchNav, { updateSearch: updateSearch, search: search });
    
    React.useEffect(() => {
        if (search.trim() == "") {
            updateSearchData([]);
        }
        else {
            let arr = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
            updateSearchData(arr);
        }
    }, [search]);


    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            {
                searchData.map((data, index) => {
                    let color = colorarr[data.color].label.toLowerCase();
                    return (
                        <TouchableOpacity key={index} onPress={() => {
                            updateSearch("");
                            updateSearchData([]);
                            if (data.status == "unplanned") {
                                searchNav.navigate("AddDetailScreen", {
                                    action: "edit",
                                    type: data.type,
                                    data: data,
                                    dataid: data.id,
                                    navigationName: navigationName
                                })
                            }
                            else {
                                searchNav.navigate("DetailScreen", {
                                    dataid: data.id,
                                    navigationName: navigationName
                                })
                            }

                        }}>
                            <View style={{ padding: 16, borderWidth: 1, borderColor: color, borderRadius: 15, margin: 16, marginVertical: 8 }}>
                                <Text style={{ fontSize: 16, color: "black" }}>{data.name}</Text>
                                <Text style={{ color: "black", opacity: 0.7, fontSize: 12, paddingTop: 8 }}>{(data.status == "unplanned") ? "Unplanned" : formatDateTime(data.startDate, data.startTime, data.endDate, data.endTime, data.type)}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })
            }
        </ScrollView>
    );
}