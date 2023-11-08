// Name: Zay Yar Tun
// Class: DIT/FT/1B/02
// Admin No: 2235035


import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { convertTime, formatDetailDate, changeHeader } from './functions';
import { deleteUserData, editUserData } from '../firebase/userdata';
import CheckBox from './CheckBox';

export default function DetailScreen(props) {
    const { route, navigation, paramObj } = props;
    const { dataid, navigationName } = route.params;
    const { data, updateData } = paramObj;

    if (dataid === undefined) {
        alert('System Error');
        navigation.goBack();
    }
    const { typearr, colorarr, remindarr } = paramObj;

    let temparr = data.filter(e => e.id === dataid);
    const [detailDataState, setDetailDataState] = React.useState(temparr[0]);

    const detailNav = navigation.getParent(navigationName);

    React.useEffect(() => {
        temparr = data.filter(e => e.id === dataid);
        setDetailDataState(temparr[0]);
    }, [data]);

    function editFunction() {
        detailNav.navigate("AddDetailScreen", {
            action: "edit",
            type: detailDataState.type,
            dataid: detailDataState.id,
            navigationName: navigationName
        })
    }

    function deleteFunction() {
        deleteUserData(detailDataState.id)
            .then(function () {
                paramObj.updateData(paramObj.data.filter(e => e.id != dataid));
                detailNav.goBack();
            })
    }

    function updateStatus() {
        let newdata = detailDataState;
        if (newdata.status == "planned")
            newdata.status = "completed";
        else
            newdata.status = "planned";
        editUserData(newdata)
            .then(function () {
                data.splice(data.findIndex(e => e.id === detailDataState.id), 1);
                updateData([...data, newdata].sort((a, b) => {
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                }));
            })
            .catch(function (error) {
                console.log(error);
                alert('Error in saving data!');
            })
    }

    changeHeader(detailNav, { editFunction: editFunction, deleteFunction: deleteFunction });

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View style={{ padding: 24 }}>
                <Text style={styles.title}>{detailDataState.name}</Text>
                <View style={styles.horizontalView}>
                    <Text style={styles.label}>{formatDetailDate(detailDataState.startDate)}</Text>
                    <Text style={styles.value}>{convertTime(detailDataState.startTime)}</Text>
                </View>
                {
                    (
                        detailDataState.type == 0 && <View style={styles.horizontalView}>
                            <Text style={styles.label}>{formatDetailDate(detailDataState.endDate)}</Text>
                            <Text style={styles.value}>{convertTime(detailDataState.endTime)}</Text>
                        </View>
                    )
                }
                <View style={styles.horizontalView}>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.value}>{typearr[detailDataState.type].label}</Text>
                </View>
                <View style={styles.horizontalView}>
                    <Text style={styles.label}>Color</Text>
                    <Text style={styles.value}>{colorarr[detailDataState.color].label}</Text>
                </View>
                <View style={styles.horizontalView}>
                    <Text style={styles.label}>Remind</Text>
                    <Text style={styles.value}>{remindarr[detailDataState.remind].label}</Text>
                </View>
                <View style={styles.verticalView}>
                    <Text>Description</Text>
                    <Text style={styles.descriptionText}>{detailDataState.description}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    {
                        detailDataState.type == 1 && <CheckBox iconStyle={{ borderRadius: 10 }} innerIconStyle={{ borderRadius: 10 }} fillColor={colorarr[detailDataState.color].label.toLowerCase()} size={40} initialState={(detailDataState.status == "completed") ? true : false} updateStatus={updateStatus} />
                    }
                </View>
            </View>
        </ScrollView>
    );
}

const styles = {
    value: {
        flex: 1,
        textAlign: 'right'
    },
    label: {
        flex: 1
    },
    horizontalView: {
        flexDirection: 'row',
        padding: 8,
        marginBottom: 8
    },
    verticalView: {
        padding: 8,
        marginBottom: 8
    },
    descriptionText: {
        textAlign: 'justify',
        marginTop: 16,
        lineHeight: 20,
        padding: 4
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24
    }
};