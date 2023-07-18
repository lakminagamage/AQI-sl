import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, Image, TouchableOpacity, Switch, ActivityIndicator, AppState } from 'react-native';
import { useState, useEffect, useCallback, useRef } from 'react';
import { buttonStyles } from '../assets/styles/button';
import { defcolors } from '../assets/colors/colors';
import { pageLayouts } from '../assets/styles/pageLayouts';
import { dropdownStyles } from '../assets/styles/dropdown';
import { Dropdown } from 'react-native-element-dropdown';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, deleteDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/core';
import RNSpeedometer from 'react-native-speedometer';88
import * as Progress from 'react-native-progress';
import { client } from '../mqttClient';
import globalData from '../globalData';
import { BottomSheet } from 'react-native-btr';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import debounce from "lodash.debounce";
const DEBOUNCE_TIME = 300;


let pathArray = [];
let subscribedCount = 0; 
const bulletPointUnicode = '\u2022';


const HomeScreen = () => {



    const btmdeviceSelectData = [];
    for (device in globalData.devices) {
        let curDevice = [];
        curDevice.label = globalData.devices[device][1].use_name;
        curDevice.value = globalData.devices[device][1].uid;
        btmdeviceSelectData.push(curDevice);
    }

    const navigation = useNavigation();
    const [ismqttConnected, setmqttConnected] = useState(true);
    const [mqttStatus, setMqttStatus] = useState(true); // true -> MQTT data receiving, false -> MQTT subscribed but data not receiving





    // ------------------ MQTT data retrieval ----------------------

    // States for values of the favourites
    const [favouriteValue1, setFavouriteValue1] = useState(0);
    const [favouriteValue2, setFavouriteValue2] = useState(0);
    const [favouriteValue3, setFavouriteValue3] = useState(0);
    const [favouriteValue4, setFavouriteValue4] = useState(0);
    const [favouriteValue5, setFavouriteValue5] = useState(0);
    const [favouriteValue6, setFavouriteValue6] = useState(0);
    const [favouriteValue7, setFavouriteValue7] = useState(0);
    const [favouriteValue8, setFavouriteValue8] = useState(0);

    const debouncedSetFavorite1 = debounce(setFavouriteValue1, DEBOUNCE_TIME);
    const debouncedSetFavorite2 = debounce(setFavouriteValue2, DEBOUNCE_TIME);
    const debouncedSetFavorite3 = debounce(setFavouriteValue3, DEBOUNCE_TIME);
    const debouncedSetFavorite4 = debounce(setFavouriteValue4, DEBOUNCE_TIME);
    const debouncedSetFavorite5 = debounce(setFavouriteValue5, DEBOUNCE_TIME);
    const debouncedSetFavorite6 = debounce(setFavouriteValue6, DEBOUNCE_TIME);
    const debouncedSetFavorite7 = debounce(setFavouriteValue7, DEBOUNCE_TIME);
    const debouncedSetFavorite8 = debounce(setFavouriteValue8, DEBOUNCE_TIME);






    useFocusEffect(
        useCallback(() => {
            setParameterValues([...globalData.processedFavourites]);
            pathArray = [];
            let curPath;
            subscribedCount = 0;
            if (!isEditScreenEnabled) {
                if (globalData.favourites.length > 0) {
                    setMqttStatus(false);
                }
                for (parameter of globalData.processedFavourites) {
                    if (parameter.parameter_mqtt == '' || parameter.parameter_mqtt == null) {
                        curPath = 'devices/' + parameter.device_mqtt + '/' + parameter.module_mqtt;
                    } else {
                        curPath = 'devices/' + parameter.device_mqtt + '/' + parameter.module_mqtt + '/' + parameter.parameter_mqtt;
                    }

                    pathArray.push(curPath);
                    client.subscribe(curPath);
                    subscribedCount++;
                }
            }
            client.onMessageArrived = (message) => {

                if (!ismqttConnected) {
                    setmqttConnected(true);
                }

                if (!isEditScreenEnabled) {
                    if (subscribedCount == globalData.favourites.length) {
                        setMqttStatus(true);
                    }
                    //console.log(message.destinationName, message.payloadString);
                    if (message.destinationName == pathArray[0]) {
                        debouncedSetFavorite1(message.payloadString)
                    } if (message.destinationName == pathArray[1]) {
                        debouncedSetFavorite2(message.payloadString)
                    } if (message.destinationName == pathArray[2]) {
                        debouncedSetFavorite3(message.payloadString)
                    } if (message.destinationName == pathArray[3]) {
                        debouncedSetFavorite4(message.payloadString)
                    } if (message.destinationName == pathArray[4]) {
                        debouncedSetFavorite5(message.payloadString)
                    } if (message.destinationName == pathArray[5]) {
                        debouncedSetFavorite6(message.payloadString)
                    } if (message.destinationName == pathArray[6]) {
                        debouncedSetFavorite7(message.payloadString)
                    } if (message.destinationName == pathArray[7]) {
                        debouncedSetFavorite8(message.payloadString)
                    }
                }

            }


            return () => {
                for (path of pathArray) {
                    client.unsubscribe(path);
                    //alert("Unsubscribed at useFocus")
                    setMqttStatus(false);
                    //console.log("unsubscribed")
                }

            }
        }, []),
    )

    



    // ------------------ Action Button Functions ----------------------

    // Edit Screen Button
    // State for edit screen button
    const [isEditScreenEnabled, setEditScreenEnabled] = useState(false);

    // Settings / Add Device Button
    const handleSettingsClick = () => {
        if (isEditScreenEnabled) {
            if (globalData.favourites.length == 8) {
                alert('Maximum number of favorites (8) reached. Please delete a favorite to add a new one.')
            } else {
                toggleBottomNavigationView(0);
            }

        } else {
            navigation.navigate('Settings');
        }
    }

    // Function for edit screen button
    const handleEditScreenClick = async () => {
        if (isEditScreenEnabled) {
            let firebaseUpdateResult = await updateOrderIndex();

            setEditScreenEnabled(false);
            if (globalData.favourites.length > 0) {
                setMqttStatus(false);
            }
            subscribedCount = 0;

            for (path of pathArray) {
                client.subscribe(path);
                subscribedCount++;
                //console.log("subscribing2");
            }
        } else {
            

            // setFavouriteValue1(0);
            // setFavouriteValue2(0);
            // setFavouriteValue3(0);
            // setFavouriteValue4(0);
            // setFavouriteValue5(0);
            // setFavouriteValue6(0);
            // setFavouriteValue7(0);
            // setFavouriteValue8(0);

            for(let key in globalData.favourites){
                if(globalData.favourites[key][1].isWritable == 0){
                    switch(key){
                        case 0:
                            setFavouriteValue1(0)
                            break;
                        case 1:
                            setFavouriteValue2(0)
                            break;
                        case 2:
                            setFavouriteValue3(0)
                            break;
                        case 3:
                            setFavouriteValue4(0)
                            break;
                        case 4:
                            setFavouriteValue5(0)
                            break;
                        case 5:
                            setFavouriteValue6(0)
                            break;
                        case 6:
                            setFavouriteValue7(0)
                            break;
                        case 7:
                            setFavouriteValue8(0)
                            break;
                    }
                }    
            }

            for (path of pathArray) {
                client.unsubscribe(path);
                //console.log("unsubscribed");
            }

            setEditScreenEnabled(true);
        }
    }

    const updateOrderIndex = async () => {
        setIsFirebaseUpdating(true);
        for (let i = 0; i < globalData.favourites.length; i++) {
            globalData.favourites[i][1].orderIndex = i;
        }

        var db;
        try {
            db = getFirestore();
        } catch (e) {
            alert('Error occured while connecting server');
            setIsLoading(false);
            return;
        }

        await globalData.processFavourites();

        for (fav of globalData.favourites) {
            try {
                await updateDoc(doc(db, globalData.user_email + '/settings/favourites/', fav[0]), {
                    orderIndex: fav[1].orderIndex
                });
            } catch (e) {
                alert('Error occured while updating favourites order');
                return 0;
            }

        }

        setIsFirebaseUpdating(false);
        return 1;
    }

    const [parameterValues, setParameterValues] = useState([...globalData.processedFavourites]);

    // Moving Up
    async function moveUp(index) {
        if (index != 0) {
            //console.log('Move up : ' + index);
            let temp = [...globalData.favourites[index]];
            globalData.favourites[index] = globalData.favourites[index - 1];
            globalData.favourites[index - 1] = temp;
            temp = globalData.processedFavourites[index];
            globalData.processedFavourites[index] = globalData.processedFavourites[index - 1];
            globalData.processedFavourites[index - 1] = temp;
            globalData.processedFavourites[index - 1].index--;
            globalData.processedFavourites[index].index++;

            setParameterValues(globalData.processedFavourites);
            let tempPath = pathArray[index];
            pathArray[index] = pathArray[index - 1];
            pathArray[index - 1] = tempPath;
            //console.log(pathArray);
        }
    }

    // Moving Down
    function moveDown(index) {
        if (index != globalData.processedFavourites.length - 1) {
            //console.log('Move down : ' + index);
            let temp = [...globalData.favourites[index]];
            globalData.favourites[index] = globalData.favourites[index + 1];
            globalData.favourites[index + 1] = temp;
            temp = globalData.processedFavourites[index];
            globalData.processedFavourites[index] = globalData.processedFavourites[index + 1];
            globalData.processedFavourites[index + 1] = temp;
            globalData.processedFavourites[index + 1].index++;
            globalData.processedFavourites[index].index--;
            setParameterValues([...globalData.processedFavourites]);
            let tempPath = pathArray[index];
            pathArray[index] = pathArray[index + 1];
            pathArray[index + 1] = tempPath;
            //console.log(pathArray);
        }
    }

    // Move to top
    function moveToTop(index) {
        if (index != 0) {
            //console.log('Move top : ' + index);
            //globalData.favourites.unshift(globalData.favourites.splice(index, 1)[0]);
            let movingData = [...globalData.favourites[index]];
            for (let i = index; i > 0; i--) {
                globalData.favourites[i] = globalData.favourites[i - 1];
            }
            globalData.favourites[0] = movingData;
            globalData.processedFavourites.unshift(globalData.processedFavourites.splice(index, 1)[0]);
            for (let i = 0; i < globalData.processedFavourites.length; i++) {
                globalData.processedFavourites[i].index = i;
            }
            setParameterValues([...globalData.processedFavourites]);
            let movingPath = pathArray[index];
            for (let i = index; i > 0; i--) {
                pathArray[i] = pathArray[i - 1];
            }
            pathArray[0] = movingPath;
            //console.log(pathArray);
        }
        //console.log(globalData.favourites);
    }

    //console.log(globalData.processedFavourites);
    // console.log(parameterValues);

    // UI render for home screen parameter
    const parameterValueView = (parameterValue) => {
        return (
            <View style={[styles.listItem]} key={parameterValue.index}>
                <View style={styles.topic}>
                    <Text style={[styles.txtTopic, isEditScreenEnabled ? { fontSize: 25, fontWeight: 'bold' } : {}]}>{parameterValue.parameter_use}</Text>
                    <Text style={[styles.txtTopicSub, isEditScreenEnabled ? { fontSize: 18, color: defcolors.lightGrey } : {}]}>{parameterValue.device_use} - {parameterValue.module_use}</Text>
                </View>

                {
                    (parameterValue.index == 0) ? (
                        renderWidget(parameterValue, favouriteValue1, setFavouriteValue1, isEditScreenEnabled)
                    ) : (parameterValue.index == 1) ? (
                        renderWidget(parameterValue, favouriteValue2, setFavouriteValue2, isEditScreenEnabled)
                    ) : (parameterValue.index == 2) ? (
                        renderWidget(parameterValue, favouriteValue3, setFavouriteValue3, isEditScreenEnabled)
                    ) : (parameterValue.index == 3) ? (
                        renderWidget(parameterValue, favouriteValue4, setFavouriteValue4, isEditScreenEnabled)
                    ) : (parameterValue.index == 4) ? (
                        renderWidget(parameterValue, favouriteValue5, setFavouriteValue5, isEditScreenEnabled)
                    ) : (parameterValue.index == 5) ? (
                        renderWidget(parameterValue, favouriteValue6, setFavouriteValue6, isEditScreenEnabled)
                    ) : (parameterValue.index == 6) ? (
                        renderWidget(parameterValue, favouriteValue7, setFavouriteValue7, isEditScreenEnabled)
                    ) : (
                        renderWidget(parameterValue, favouriteValue8, setFavouriteValue8, isEditScreenEnabled)
                    )
                }

                <View style={[styles.actionsContainer, style = { display: isEditScreenEnabled ? 'flex' : 'none' }]}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            moveUp(parameterValue.index);
                        }}>
                        <Image
                            source={require('../assets/icons/up_single_white.png')}
                            style={styles.actionButtonImg} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            moveToTop(parameterValue.index);
                        }}>
                        <Image
                            source={require('../assets/icons/top_white.png')}
                            style={[styles.actionButtonImg, styles.topButtonImg]} />
                        <Text style={styles.topButtonText}>TOP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity

                        onPress={() => toggleBottomNavigationView(1, parameterValue.index)}
                        style={styles.actionButton}>
                        <Image
                            source={require('../assets/icons/pencil.png')}
                            style={styles.actionButtonImg} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => toggleBottomNavigationView(2, parameterValue.index)}
                        style={styles.actionButton}>
                        <Image
                            source={require('../assets/icons/delete.png')}
                            style={styles.actionButtonImg} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            moveDown(parameterValue.index);
                        }}>
                        <Image
                            source={require('../assets/icons/down_single_white.png')}
                            style={styles.actionButtonImg} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <View style={[pageLayouts.pageHeader, { marginTop: 30 }]}>
                <View style={[pageLayouts.iconContainer]}>
                    <View>
                        <Image style={pageLayouts.icon} source={require('../assets/icons/logo.png')} />
                    </View>

                </View>
            </View>
            <View style={styles.dashButtonContainer}>
                <TouchableOpacity style={buttonStyles.dashButton}
                    onPress={() => (
                        (isEditScreenEnabled) ? (
                            alert("Please cancel 'Edit Screen' mode to view all devices")
                        ) : (
                            navigation.navigate('AllDevices')
                        )
                    )}>
                    <Text style={buttonStyles.dashButtonText}>See All Devices</Text>
                    <Image
                        style={buttonStyles.dashButtonIcon}
                        source={require('../assets/icons/right.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={[pageLayouts.curvedBody, styles.curvedBodyLocalStyles]}>
                {!mqttStatus ? (
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>{bulletPointUnicode} Data is being loaded</Text>
                        <Text style={styles.statusText}>{bulletPointUnicode} Please restart the app if this message persists</Text>
                    </View>
                ) : (null)}

                {/* <View style={styles.selectListContainer}> 
                    <View style={styles.selectContainer}>
                        <Dropdown
                            style={[dropdownStyles.dropdown, isDeviceSelectFocus && { borderColor: defcolors.darkBlue }]}
                            data={deviceSelectData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder='Select Device'
                            searchPlaceholder="Search..."
                            value={deviceSelectValue}
                            onFocus={() => setIsDeviceSelectFocus(true)}
                            onBlur={() => setIsDeviceSelectFocus(false)}
                            onChange={item => {
                                setDeviceSelectValue(item.value);
                                setIsDeviceSelectFocus(false);
                            }}
                        />
                    </View>
                        </View> */}
                <ScrollView ref={ref => this.scrollViewRef = ref}
                    style={[styles.list, ismqttConnected ? { opacity: 1 } : { opacity: 0 }]}>
                    <View style={styles.listItemContainer}>

                        {parameterValues.map(parameterValueView)}
                    </View>
                </ScrollView>

                <BottomSheet
                    visible={sheetVisible}
                    //setting the visibility state of the bottom shee
                    onBackButtonPress={toggleBottomNavigationView}
                    //Toggling the visibility state on the click of the back botton
                    onBackdropPress={toggleBottomNavigationView}
                //Toggling the visibility state on the clicking out side of the sheet
                >
                    {/*Bottom Sheet inner View*/}
                    <View style={styles.bottomNavigationView}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}>

                            {bottomSheetType == 0 ? (addFavourite(setParameterValues)) :
                                bottomSheetType == 1 ? (editFavourite(setParameterValues, editFavSheetKey)) : deleteFavourite(setParameterValues, editFavSheetKey)}

                        </View>
                    </View>
                </BottomSheet>

                <View style={styles.bottomRow}>
                    {(isFirebaseUpdating) ? (
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <View style={[buttonStyles.buttonSecondary, buttonStyles.buttonSecondaryBlue, { width: 200 }]}>
                                <ActivityIndicator color={defcolors.white} style={[styles.spinner]} size="large" />
                                <Text style={[buttonStyles.buttonTextSecondaryWhite, { marginStart: 7 }]}>
                                    Updating data
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => handleSettingsClick()}
                                style={[buttonStyles.buttonSecondary, buttonStyles.buttonSecondaryBlue]}>
                                <Image
                                    style={buttonStyles.buttonIcon}
                                    source={isEditScreenEnabled ? require('../assets/icons/add.png') : require('../assets/icons/settings.png')}
                                ></Image>
                                <Text style={buttonStyles.buttonTextSecondaryWhite}>
                                    {isEditScreenEnabled ? 'Add Widget' : 'Settings'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleEditScreenClick()}
                                style={[buttonStyles.buttonSecondary, buttonStyles.buttonSecondaryBlue]}>
                                <Image
                                    style={buttonStyles.buttonIcon}
                                    source={isEditScreenEnabled ? require('../assets/icons/cancel_white.png') : require('../assets/icons/pencil_white.png')}></Image>
                                <Text style={buttonStyles.buttonTextSecondaryWhite}>
                                    {isEditScreenEnabled ? 'Cancel' : 'Edit Screen'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}



                </View>
            </View>
            <StatusBar style='auto' />
        </View>
    );
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },

    dashButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 60,
        backgroundColor: defcolors.white,
        paddingHorizontal: 10,
        marginTop: -20,
    },

    curvedBodyLocalStyles: {
        marginTop: 10,
        paddingTop: 10,
    },

    statusContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    statusText: {
        color: defcolors.red,
        fontWeight: 'bold',
    },

    bottomRow: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },

    selectListContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        marginTop: 3,
        paddingHorizontal: 20,
    },

    selectContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 4,
    },

    list: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: '#F3EFEF',
        paddingTop: 10,
    },

    listItemContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 30,
        borderRadius: 20,
    },

    listItem: {
        flex: 1,
        width: '90%',
        borderRadius: 20,
        backgroundColor: '#185ADB',
        marginBottom: 10,
        paddingTop: 10,
        alignItems: 'center',
    },

    widgetContainer: {
        marginTop: 5,
        height: 100,
        alignItems: 'center',
    },

    actionsContainer: {
        width: '100%',
        height: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 20,
        display: 'none',
        flexDirection: 'row',
        justifyContent: 'space-between',
        rotation: 90,
        paddingHorizontal: 20,
    },

    actionButtonImg: {
        width: 20,
        height: 20,
    },

    topButtonImg: {
        width: 20,
        height: 10,
        resizeMode: 'stretch',
    },

    topButtonText: {
        color: defcolors.white,
    },

    actionButton: {
        width: 30,
        height: 30,
    },

    progressBar: {
        marginTop: 15,
        borderRadius: 10,
    },

    progressBarText: {
        fontSize: 25,
        paddingTop: 5,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    txt: {
        fontSize: 48,
        paddingTop: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    topic: {
        alignItems: 'flex-start',
        width: '100%',
        paddingLeft: 17,
    },

    txtTopic: {
        fontSize: 18,
        paddingTop: 5,
        color: '#FFFFFF',
    },

    txtTopicSub: {
        fontSize: 15,
        paddingTop: 2,
        color: '#FFFFFF',
    },

    imgbtn: {
        justifyContent: 'center',
        padding: 10,
        paddingLeft: 25,
        marginTop: 20,
        height: 30,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
    },

    containerSheet: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    textInput: {
        marginTop: 20,
        height: 40,
        width: 250,
        textAlign: 'center',
        borderColor: defcolors.darkBlue,
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 17,
    },

    textSmaller: {
        color: defcolors.grey,
        marginTop: 5,
        marginHorizontal: 20,
    },

    header: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    heading: {
        marginTop: 0,
        fontSize: 35,
        color: defcolors.darkBlue,
    },

    bottomRowUpper: {
        height: 60,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    widgetSelector: {
        width: 55,
        height: 55,
        borderRadius: 15,
        borderColor: defcolors.darkBlue,
        borderWidth: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    widgetIcon: {
        width: 35,
        height: 35,
    },
})



function renderWidget(parameterValue, value, setValue, isEditScreenEnabled) {
    if (isEditScreenEnabled) {
        return (
            <View style={[styles.widgetContainer, { height: 50 }]}>
                <Text style={[styles.txt, { color: defcolors.yellow, marginTop: -10, fontSize: 17 }]}>Data Loading Paused</Text>
            </View>
        );
    }

    let paramUnit = parameterValue.parameter_unit;
    let notInRange = false;
    higherLimit = parameterValue.upper_limit;
    lowerLimit = parameterValue.lower_limit;
    let valuePercentage = 0;
    if (higherLimit - lowerLimit != 0) {
        valuePercentage = (value - lowerLimit) / (higherLimit - lowerLimit);
    }
    if (Number(value) < lowerLimit || Number(value) > higherLimit) {
        notInRange = true;
    }
    //console.log(notInRange)
    if (paramUnit == 'ONOFF') {
        if (value == 0) {
            value = 'OFF';
        } else {
            value = 'ON';
        }
        paramUnit = '';
    }

    /*if (value < lowerLimit || value > higherLimit) {
        console.log("value not in range");
        return (
            <View style={styles.widgetContainer}>
                <Text style={[styles.txt, { marginTop: -15, color: '#ff2900' }]}>{value} {paramUnit}</Text>
                <Text style={[styles.txt, { fontSize: 15, marginTop: -20, color: '#ff2900' }]}>Value not in the range ({lowerLimit} - {higherLimit})</Text>
            </View>
        );
    }*/

    if (parameterValue.widget == 0) {
        return (
            <View style={styles.widgetContainer}>
                <Text style={[styles.txt, notInRange ? { color: defcolors.red, marginTop: -10 } : { color: defcolors.white }]}>{value} {paramUnit}</Text>
                {notInRange ? <Text style={[styles.txt, { fontSize: 15, marginTop: -20, color: '#ff2900' }]}>Value not in the range ({lowerLimit} - {higherLimit})</Text> : null}
            </View>
        );
    } else if (parameterValue.widget == 1) {
        return (
            <View style={[styles.widgetContainer, { marginTop: -0, marginBottom: 5, height: 110 }]}>
                <RNSpeedometer style={{}} value={valuePercentage * 100} labels={[
                    {
                        name: 'Too Slow',
                        labelColor: '#ff2900',
                        activeBarColor: '#00ff6b',
                    },
                    {
                        name: 'Very Slow',
                        labelColor: '#ff5400',
                        activeBarColor: '#14eb6e',
                    },
                    {
                        name: 'Slow',
                        labelColor: '#f4ab44',
                        activeBarColor: '#f2cf1f',
                    },
                    {
                        name: 'Normal',
                        labelColor: '#f2cf1f',
                        activeBarColor: '#f4ab44',
                    },
                    {
                        name: 'Fast',
                        labelColor: '#14eb6e',
                        activeBarColor: '#ff5400',
                    },
                    {
                        name: 'Unbelievably Fast',
                        labelColor: '#00ff6b',
                        activeBarColor: '#ff2900',
                    },
                ]} size={140} labelStyle={{ fontSize: 24, color: '#14315E', display: 'none' }} labelNoteStyle={{ fontSize: 0, display: 'none' }} />
                {notInRange ?
                    (<Text style={[styles.txt, { fontSize: 15, marginTop: -20, color: '#ff2900' }]}>Value not in the range ({lowerLimit} - {higherLimit}) - {value} {paramUnit}</Text>) :
                    (<Text style={[styles.txt, { fontSize: 24, marginTop: -18 }]}>{value} {paramUnit}</Text>)}

            </View>

        );
    } else if (parameterValue.widget == 2) {
        return (<View style={[styles.widgetContainer,]}>
            <Progress.Bar progress={valuePercentage} width={250} height={30} color='#ebc056' style={styles.progressBar} />
            {notInRange ? (<Text style={[styles.txt, { fontSize: 15, marginTop: -10, color: '#ff2900' }]}>Value not in the range ({lowerLimit} - {higherLimit}) - {value} {paramUnit}</Text>) :
                (<Text style={styles.progressBarText}>{value} {paramUnit}  </Text>)}

        </View>);
    } else {
        return (
            <View style={[styles.widgetContainer,]}>
                <Switch
                    style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], marginTop: 20 }}
                    trackColor={{ false: defcolors.id, true: defcolors.green }}
                    ios_backgroundColor='#f77979'
                    disabled={parameterValue.isWritable == 0 ? true : false}
                    thumbColor={defcolors.darkBlue}
                    onValueChange={(value) => {
                        if (parameterValue.isWritable == 1) {
                            let curPath = 'devices/' + parameterValue.device_mqtt + '/' + parameterValue.module_mqtt + '/' + parameterValue.parameter_mqtt;
                            writeMQTT(curPath, value ? '1' : '0');
                            setValue(value ? 1 : 0)
                        }
                        //console.log(value);
                    }}
                    value={value != 0 ? true : false}
                />
            </View>
        );
    }
}

const addFavourite = (setParameterValues) => {
    const [isDeviceSelectFocus, setIsDeviceSelectFocus] = useState(null)
    const [isModuleSelectFocus, setIsModuleSelectFocus] = useState(null)
    const [isParamSelectFocus, setIsParamSelectFocus] = useState(null)
    const [selectedWidget, setSelectedWidget] = useState(0)
    const [deviceSelectValue, setDeviceSelectValue] = useState(null)
    const [moduleSelectValue, setModuleSelectValue] = useState(null)
    const [paramSelectValue, setParamSelectValue] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    var favDetails = [null, null, null, null]; // 0 - device_mqtt, 1 - module_mqtt, 2 - param_mqtt, 3 - widget

    const deviceSelectData = [];

    const moduleSelectData = [];

    const paramSelectData = [];


    for (device in globalData.devices) {
        let curDevice = [];
        curDevice.label = globalData.devices[device][1].use_name;
        curDevice.value = globalData.devices[device][1].uid;
        deviceSelectData.push(curDevice);
    }

    for (module in globalData.master_modules) {
        let curModule = [];
        curModule.label = globalData.master_modules[module][1].use_name;
        curModule.value = globalData.master_modules[module][1].mqtt_name;
        moduleSelectData.push(curModule);
    }

    let selectedModuleDocumentID = '';
    for (module in globalData.master_modules) {
        if (moduleSelectValue == globalData.master_modules[module][1].mqtt_name) {
            selectedModuleDocumentID = globalData.master_modules[module][0];
            for (params_of_module in globalData.master_parameters) {
                if (globalData.master_parameters[params_of_module][0] == selectedModuleDocumentID) {
                    for (param of globalData.master_parameters[params_of_module][1]) {
                        let curParam = [];
                        curParam.label = param[1].use_name;
                        curParam.value = param[1].mqtt_name;
                        curParam.unit = param[1].unit;
                        paramSelectData.push(curParam);
                    }
                }
            }
        }
    }

    const addFavouriteContinue = async () => {
        setIsLoading(true);
        if (deviceSelectValue == null) {
            alert("Please select a device");
            setIsLoading(false);
            return;
        }
        if (moduleSelectValue == null) {
            alert("Please select a module");
            setIsLoading(false);
            return;
        }
        if (paramSelectValue == null) {
            alert("Please select a parameter");
            setIsLoading(false);
            return;
        }
        if (selectedWidget == null) {
            alert("Please select a widget");
            setIsLoading(false);
            return;
        }
        //console.log(deviceSelectValue, moduleSelectValue, paramSelectValue, selectedWidget);
        if (globalData.favourites.length == 8) {
            alert("Maximum number of favorites reached");
            setIsLoading(false);
            return;
        }
        for (favourite of globalData.favourites) {
            if (favourite[1].device == deviceSelectValue && favourite[1].module == moduleSelectValue && favourite[1].parameter == paramSelectValue && favourite[1].widget == selectedWidget) {
                alert("Favorite already exists");
                setIsLoading(false);
                return;
            }
        }
        let docID; // = 'favourite' + (globalData.favourites.length + 1);

        var db;
        try {
            db = getFirestore();
        } catch (e) {
            alert('Error occured while connecting server');
            setIsLoading(false);
            return;
        }

        let orderIndex = 0;
        if (globalData.favourites.length == 0) {
            orderIndex = 0;
        } else {
            for (fav of globalData.favourites) {
                if (fav[1].orderIndex > orderIndex) {
                    orderIndex = fav[1].orderIndex;
                }
            }
            orderIndex++;
        }

        let newFavourite = {
            device: deviceSelectValue,
            module: moduleSelectValue,
            parameter: paramSelectValue,
            widget: selectedWidget,
            orderIndex: orderIndex,
        }

        try {
            //await setDoc(doc(db, globalData.user_email + '/settings/favourites/'), newFavourite);
            const docRef = await addDoc(collection(db, globalData.user_email + '/settings/favourites/'), newFavourite);
            docID = docRef.id;
        } catch (e) {
            alert('Error occured while adding favorite (2)');
            setIsLoading(false);
            return;
        }

        try {
            let newFav = [docID, newFavourite];
            globalData.favourites.push(newFav);
            //console.log(globalData.processedFavourites);
            await globalData.processFavourites();

            setParameterValues([...globalData.processedFavourites]);

            pathArray = [];
            let curPath;
            for (parameter of globalData.processedFavourites) {
                curPath = 'devices/' + parameter.device_mqtt + '/' + parameter.module_mqtt + '/' + parameter.parameter_mqtt;
                pathArray.push(curPath);
            }

            alert('Favorite added successfully');
            setIsLoading(false);

        } catch (e) {
            alert('Favorite added but error occured while refreshing the app. Please restart the app');
            setIsLoading(false);
            return;
        };

        setDeviceSelectValue(null);
        setModuleSelectValue(null);
        setParamSelectValue(null);
        setSelectedWidget(0);

    }

    return (

        <View style={styles.containerSheet}>
            <ScrollView ref={ref => this.scrollViewRef = ref}>
                <View style={styles.header}>

                    <Text style={[styles.heading, { fontSize: 25, marginTop: 0 }]}>Add Favorite</Text>

                    <Text style={styles.textSmaller}>Select parameter and a widget</Text>

                    <Dropdown
                        style={[dropdownStyles.dropdown, isDeviceSelectFocus && { borderColor: defcolors.darkBlue }, { width: 250, borderRadius: 20, marginTop: 20, paddingHorizontal: 20 }]}
                        data={deviceSelectData}
                        search
                        maxHeight={250}
                        labelField="label"
                        valueField="value"
                        placeholder='Select Device'
                        searchPlaceholder="Search..."
                        value={deviceSelectValue}
                        onFocus={() => setIsDeviceSelectFocus(true)}
                        onBlur={() => setIsDeviceSelectFocus(false)}
                        onChange={item => {
                            favDetails[0] = item.value;
                            setDeviceSelectValue(item.value);
                            setIsDeviceSelectFocus(false);
                        }}
                    />
                    <Dropdown
                        style={[dropdownStyles.dropdown, isModuleSelectFocus && { borderColor: defcolors.darkBlue }, { width: 250, borderRadius: 20, marginTop: 20, paddingHorizontal: 20 }]}
                        data={moduleSelectData}
                        search
                        maxHeight={180}
                        labelField="label"
                        valueField="value"
                        placeholder='Select Module'
                        searchPlaceholder="Search..."
                        value={moduleSelectValue}
                        onFocus={() => setIsModuleSelectFocus(true)}
                        onBlur={() => setIsModuleSelectFocus(false)}
                        onChange={item => {
                            favDetails[1] = item.value;
                            setModuleSelectValue(item.value);
                            setIsModuleSelectFocus(false);
                        }}
                    />
                    <Dropdown
                        style={[dropdownStyles.dropdown, isParamSelectFocus && { borderColor: defcolors.darkBlue }, { width: 250, borderRadius: 20, marginTop: 20, paddingHorizontal: 20 }]}
                        data={paramSelectData}
                        search
                        maxHeight={180}
                        labelField="label"
                        valueField="value"
                        placeholder='Select Parameter'
                        searchPlaceholder="Search..."
                        value={paramSelectValue}
                        onFocus={() => setIsParamSelectFocus(true)}
                        onBlur={() => setIsParamSelectFocus(false)}
                        onChange={item => {
                            favDetails[2] = item.value;
                            setParamSelectValue(item.value);
                            setIsParamSelectFocus(false);
                        }}
                    />

                    <View style={styles.bottomRowUpper}>
                        <TouchableOpacity style={[styles.widgetSelector, selectedWidget == 0 ? { borderColor: defcolors.yellow, backgroundColor: '#f7f5e1' } : { borderColor: defcolors.darkBlue, backgroundColor: defcolors.white }]}
                            onPress={() => {
                                favDetails[3] = 0
                                setSelectedWidget(0)
                            }} >
                            <Image style={styles.widgetIcon}
                                source={require('../assets/icons/digit.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.widgetSelector, selectedWidget == 1 ? { borderColor: defcolors.yellow, backgroundColor: '#f7f5e1' } : { borderColor: defcolors.darkBlue, backgroundColor: defcolors.white }]}
                            onPress={() => {
                                favDetails[3] = 1
                                setSelectedWidget(1)
                            }} >
                            <Image style={styles.widgetIcon}
                                source={require('../assets/icons/gauge.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.widgetSelector, selectedWidget == 2 ? { borderColor: defcolors.yellow, backgroundColor: '#f7f5e1' } : { borderColor: defcolors.darkBlue, backgroundColor: defcolors.white }]}
                            onPress={() => {
                                favDetails[3] = 2
                                setSelectedWidget(2)
                            }} >
                            <Image style={styles.widgetIcon}
                                source={require('../assets/icons/progress.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.widgetSelector, selectedWidget == 3 ? { borderColor: defcolors.yellow, backgroundColor: '#f7f5e1' } : { borderColor: defcolors.darkBlue, backgroundColor: defcolors.white }]}
                            onPress={() => {
                                favDetails[3] = 3
                                setSelectedWidget(3)
                            }} >
                            <Image style={styles.widgetIcon}
                                source={require('../assets/icons/switch.png')} />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View
                            style={[buttonStyles.buttonPrimary, { backgroundColor: defcolors.white }]}>
                            <ActivityIndicator color={defcolors.darkBlue} style={[styles.spinner]} size="large" />
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={buttonStyles.buttonPrimary}
                            onPress={() => addFavouriteContinue()}>
                            <Text style={buttonStyles.buttonText}>Add Favorite</Text>
                        </TouchableOpacity>
                    )}


                </View>
            </ScrollView>
        </View >

    )
}



// Edit Favourite Bottom Sheet
const editFavourite = (setParameterValues, editFavSheetKey) => {
    const [isDeviceSelectFocusEdit, setIsDeviceSelectFocusEdit] = useState(null)
    const [isModuleSelectFocusEdit, setIsModuleSelectFocusEdit] = useState(null)
    const [isParamSelectFocusEdit, setIsParamSelectFocusEdit] = useState(null)
    const [selectedWidgetEdit, setSelectedWidgetEdit] = useState(0)
    const [deviceSelectValueEdit, setDeviceSelectValueEdit] = useState(null)
    const [moduleSelectValueEdit, setModuleSelectValueEdit] = useState(null)
    const [paramSelectValueEdit, setParamSelectValueEdit] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    var favDetails = [null, null, null, null]; // 0 - device_mqtt, 1 - module_mqtt, 2 - param_mqtt, 3 - widget

    const deviceSelectData = [];

    const moduleSelectData = [];

    const paramSelectData = [];

    for (device in globalData.devices) {
        let curDevice = [];
        curDevice.label = globalData.devices[device][1].use_name;
        curDevice.value = globalData.devices[device][1].uid;
        deviceSelectData.push(curDevice);
    }

    for (module in globalData.master_modules) {
        let curModule = [];
        curModule.label = globalData.master_modules[module][1].use_name;
        curModule.value = globalData.master_modules[module][1].mqtt_name;
        moduleSelectData.push(curModule);
    }

    let selectedModuleDocumentID = '';
    for (module in globalData.master_modules) {
        if (moduleSelectValueEdit == globalData.master_modules[module][1].mqtt_name) {
            selectedModuleDocumentID = globalData.master_modules[module][0];
            for (params_of_module in globalData.master_parameters) {
                if (globalData.master_parameters[params_of_module][0] == selectedModuleDocumentID) {
                    for (param of globalData.master_parameters[params_of_module][1]) {
                        let curParam = [];
                        curParam.label = param[1].use_name;
                        curParam.value = param[1].mqtt_name;
                        curParam.unit = param[1].unit;
                        paramSelectData.push(curParam);
                    }
                }
            }
        }
    }

    const editFavouriteContinue = async () => {
        setIsLoading(true);
        if (deviceSelectValueEdit == null) {
            alert("Please select a device");
            setIsLoading(false);
            return;
        }
        if (moduleSelectValueEdit == null) {
            alert("Please select a module");
            setIsLoading(false);
            return;
        }
        if (paramSelectValueEdit == null) {
            alert("Please select a parameter");
            setIsLoading(false);
            return;
        }
        if (selectedWidgetEdit == null) {
            alert("Please select a widget");
            setIsLoading(false);
            return;
        }

        //console.log(deviceSelectValueEdit, moduleSelectValueEdit, paramSelectValueEdit, selectedWidgetEdit);
        for (favourite of globalData.favourites) {
            if (favourite[1].device == deviceSelectValueEdit && favourite[1].module == moduleSelectValueEdit && favourite[1].parameter == paramSelectValueEdit && favourite[1].widget == selectedWidgetEdit) {
                alert("Favorite already exists");
                setIsLoading(false);
                return;
            }
        }

        let docID = (globalData.favourites[editFavSheetKey][0]);

        var db;
        try {
            db = getFirestore();
        } catch (e) {
            alert('Error occured while connecting server');
            setIsLoading(false);
            return;
        }

        //console.log('index : ' + editFavSheetKey, 'orderIndex : ' + globalData.favourites[editFavSheetKey][1].orderIndex, 'docID : ' + docID);
        let newFavourite = {
            device: deviceSelectValueEdit,
            module: moduleSelectValueEdit,
            parameter: paramSelectValueEdit,
            widget: selectedWidgetEdit,
            orderIndex: globalData.favourites[editFavSheetKey][1].orderIndex
        }

        try {
            await setDoc(doc(db, globalData.user_email + '/settings/favourites/', docID), newFavourite);

        } catch (e) {
            alert('Error occured while adding favorite (2)');
            setIsLoading(false);
            return;
        }

        //console.log(globalData.favourites[editFavSheetKey]);

        try {
            globalData.favourites[editFavSheetKey][1] = newFavourite;

            await globalData.processFavourites();

            setParameterValues([...globalData.processedFavourites]);

            pathArray = [];
            let curPath;
            for (parameter of globalData.processedFavourites) {
                curPath = 'devices/' + parameter.device_mqtt + '/' + parameter.module_mqtt + '/' + parameter.parameter_mqtt;
                pathArray.push(curPath);
            }

            alert('Favorite updated successfully');
            setIsLoading(false);
        } catch (e) {
            alert('Favorite updated but did not refreshed app successfully. Please restart the app');
            setIsLoading(false);
            return;
        };

        setDeviceSelectValueEdit(null);
        setModuleSelectValueEdit(null);
        setParamSelectValueEdit(null);
        setSelectedWidgetEdit(0);
    }

    return (
        <View style={styles.containerSheet}>
            <ScrollView ref={ref => this.scrollViewRef = ref}>
                <View style={styles.header}>

                    <Text style={[styles.heading, { fontSize: 25, marginTop: 0 }]}>Edit Favorite</Text>

                    <Text style={styles.textSmaller}>Change parameter and the widget</Text>

                    <Dropdown
                        style={[dropdownStyles.dropdown, isDeviceSelectFocusEdit && { borderColor: defcolors.darkBlue }, { width: 250, borderRadius: 20, marginTop: 20, paddingHorizontal: 20 }]}
                        data={deviceSelectData}
                        search
                        maxHeight={180}
                        labelField="label"
                        valueField="value"
                        placeholder='Select Device'
                        searchPlaceholder="Search..."
                        value={deviceSelectValueEdit}
                        onFocus={() => setIsDeviceSelectFocusEdit(true)}
                        onBlur={() => setIsDeviceSelectFocusEdit(false)}
                        onChange={item => {
                            favDetails[0] = item.value;
                            setDeviceSelectValueEdit(item.value);
                            setIsDeviceSelectFocusEdit(false);
                        }}
                    />
                    <Dropdown
                        style={[dropdownStyles.dropdown, isModuleSelectFocusEdit && { borderColor: defcolors.darkBlue }, { width: 250, borderRadius: 20, marginTop: 20, paddingHorizontal: 20 }]}
                        data={moduleSelectData}
                        search
                        maxHeight={180}
                        labelField="label"
                        valueField="value"
                        placeholder='Select Module'
                        searchPlaceholder="Search..."
                        value={moduleSelectValueEdit}
                        onFocus={() => setIsModuleSelectFocusEdit(true)}
                        onBlur={() => setIsModuleSelectFocusEdit(false)}
                        onChange={item => {
                            favDetails[1] = item.value;
                            setModuleSelectValueEdit(item.value);
                            setIsModuleSelectFocusEdit(false);
                        }}
                    />
                    <Dropdown
                        style={[dropdownStyles.dropdown, isParamSelectFocusEdit && { borderColor: defcolors.darkBlue }, { width: 250, borderRadius: 20, marginTop: 20, paddingHorizontal: 20 }]}
                        data={paramSelectData}
                        search
                        maxHeight={180}
                        labelField="label"
                        valueField="value"
                        placeholder='Select Parameter'
                        searchPlaceholder="Search..."
                        value={paramSelectValueEdit}
                        onFocus={() => setIsParamSelectFocusEdit(true)}
                        onBlur={() => setIsParamSelectFocusEdit(false)}
                        onChange={item => {
                            favDetails[2] = item.value;
                            setParamSelectValueEdit(item.value);
                            setIsParamSelectFocusEdit(false);
                        }}
                    />

                    <View style={styles.bottomRowUpper}>
                        <TouchableOpacity style={[styles.widgetSelector, selectedWidgetEdit == 0 ? { borderColor: defcolors.yellow, backgroundColor: '#f7f5e1' } : { borderColor: defcolors.darkBlue, backgroundColor: defcolors.white }]}
                            onPress={() => {
                                favDetails[3] = 0
                                setSelectedWidgetEdit(0)
                            }} >
                            <Image style={styles.widgetIcon}
                                source={require('../assets/icons/digit.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.widgetSelector, selectedWidgetEdit == 1 ? { borderColor: defcolors.yellow, backgroundColor: '#f7f5e1' } : { borderColor: defcolors.darkBlue, backgroundColor: defcolors.white }]}
                            onPress={() => {
                                favDetails[3] = 1
                                setSelectedWidgetEdit(1)
                            }} >
                            <Image style={styles.widgetIcon}
                                source={require('../assets/icons/gauge.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.widgetSelector, selectedWidgetEdit == 2 ? { borderColor: defcolors.yellow, backgroundColor: '#f7f5e1' } : { borderColor: defcolors.darkBlue, backgroundColor: defcolors.white }]}
                            onPress={() => {
                                favDetails[3] = 2
                                setSelectedWidgetEdit(2)
                            }} >
                            <Image style={styles.widgetIcon}
                                source={require('../assets/icons/progress.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.widgetSelector, selectedWidgetEdit == 3 ? { borderColor: defcolors.yellow, backgroundColor: '#f7f5e1' } : { borderColor: defcolors.darkBlue, backgroundColor: defcolors.white }]}
                            onPress={() => {
                                favDetails[3] = 3
                                setSelectedWidgetEdit(3)
                            }} >
                            <Image style={styles.widgetIcon}
                                source={require('../assets/icons/switch.png')} />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View
                            style={[buttonStyles.buttonPrimary, { backgroundColor: defcolors.white }]}>
                            <ActivityIndicator color={defcolors.darkBlue} style={[styles.spinner]} size="large" />
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={buttonStyles.buttonPrimary}
                            onPress={() => editFavouriteContinue()}>
                            <Text style={buttonStyles.buttonText}>Update Favorite</Text>
                        </TouchableOpacity>
                    )}


                </View>
            </ScrollView>
        </View>
    )
}

// Delete Favourite Bottom Sheet
const deleteFavourite = (setParameterValues, editFavSheetKey) => {
    const [isDeviceSelectFocus, setIsDeviceSelectFocus] = useState(null)
    const [isModuleSelectFocus, setIsModuleSelectFocus] = useState(null)
    const [isParamSelectFocus, setIsParamSelectFocus] = useState(null)
    const [selectedWidget, setSelectedWidget] = useState(0)
    const [deviceSelectValue, setDeviceSelectValue] = useState(null)
    const [moduleSelectValue, setModuleSelectData] = useState(null)
    const [paramSelectValue, setParamSelectValue] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const editFavouriteContinue = async () => {
        setIsLoading(true);

        if (globalData.favourites.length == 0) {
            alert('No favorites to delete');
            setIsLoading(false);
            return;
        }

        let docID = globalData.favourites[editFavSheetKey][0];

        var db;
        try {
            db = getFirestore();
        } catch (e) {
            alert('Error occured while connecting server');
            setIsLoading(false);
            return;
        }

        try {
            await deleteDoc(doc(db, globalData.user_email + '/settings/favourites/', docID));
        } catch (e) {
            alert('Error occured while deleting favorite');
            setIsLoading(false);
            return;
        }

        try {
            globalData.favourites.splice(editFavSheetKey, 1);

            await globalData.processFavourites();

            setParameterValues([...globalData.processedFavourites]);

            pathArray = [];
            let curPath;
            for (parameter of globalData.processedFavourites) {
                curPath = 'devices/' + parameter.device_mqtt + '/' + parameter.module_mqtt + '/' + parameter.parameter_mqtt;
                pathArray.push(curPath);
            }

            alert('Favorite deleted successfully');
            setIsLoading(false);
        } catch (e) {
            alert('Error occured while refreshing data. Please restart the app');
            setIsLoading(false);
            return;
        }

    }

    return (
        <View style={styles.containerSheet}>
            <ScrollView ref={ref => this.scrollViewRef = ref}>
                <View style={[styles.header]}>

                    <Image
                        style={{ width: 60, height: 60 }}
                        source={require('../assets/icons/delete.png')}></Image>
                    <Text style={[styles.heading, { fontSize: 25, marginTop: 40 }]}>Are you sure?</Text>

                    <Text style={[styles.textSmaller, { marginTop: 20 }]}>This will remove this widget from Home Screen</Text>
                    <Text style={styles.textSmaller}>Don't worry you can always add it via add widget</Text>

                    {isLoading ? (
                        <View
                            style={[buttonStyles.buttonPrimary, { backgroundColor: defcolors.white }]}>
                            <ActivityIndicator color={defcolors.red} style={[styles.spinner]} size="large" />
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => { editFavouriteContinue() }}
                            style={[buttonStyles.buttonPrimary, { marginTop: 30, backgroundColor: defcolors.red }]}>
                            <Text style={buttonStyles.buttonText}>Delete Favorite</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}


// Publish to MQTT server

const writeMQTT = (topic, message) => {
    client.publish(topic, message);
}