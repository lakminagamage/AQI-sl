import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { colors } from '../assets/colors/colors';
import { pageLayouts } from '../assets/styles/pageLayouts.js';
import { getAuth } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import RNSpeedometer from 'react-native-speedometer';
import * as Progress from 'react-native-progress';
import { client } from '../mqttClient';


const HomeScreen = () => {

    const[parameter1, setParameter1] = useState(90);
    const[parameter2, setParameter2] = useState(70);
    const[parameter3, setParameter3] = useState(22.5);
    const[parameter4, setParameter4] = useState(1.2);


    useEffect(() => {
    client.subscribe("ST1/rain");
    client.subscribe("ST1/wind");
    client.subscribe("ST1/temp");
    client.subscribe("ST1/rh");

      client.onMessageArrived = (message) => {
        console.log(message.payloadString)
        console.log(message.destinationName)
        if(message.destinationName === "ST1/rh"){
          setParameter1(message.payloadString);
        }
        else if(message.destinationName === "ST1/wind"){
          setParameter2(message.payloadString);
        }
        else if(message.destinationName === "ST1/temp"){
            setParameter3(message.payloadString);
            }
        else if(message.destinationName === "ST1/rain"){
            setParameter4(message.payloadString);
            }
        console.log(message.payloadString)
      }
    return () => {
      client.unsubscribe("ST1/rh")
      client.unsubscribe("ST1/temp")
      client.unsubscribe("ST1/rain")
      client.unsubscribe("ST1/wind")
      console.log("unsubscribed")
    }
    }, [])



    



    const parameterValueView = (parameterValue) => {
        return (
            <View style={styles.listItem} key={parameterValue.index}>
                <View style={styles.topic}>
                    <Text style={styles.txtTopic}>{parameterValue.parameter}</Text>
                    <Text style={styles.txtTopicSub}>{parameterValue.device} - {parameterValue.module}</Text>
                </View>
                {renderWidget(parameterValue)}
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
                        style={styles.actionButton}>
                        <Image
                            source={require('../assets/icons/pencil.png')}
                            style={styles.actionButtonImg} />
                    </TouchableOpacity>
                    <TouchableOpacity
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
            <View style={pageLayouts.pageHeader}>
                <View style={pageLayouts.iconContainer}>
                    <TouchableOpacity>
                    <Image style={pageLayouts.icon} source={require('../assets/icons/logo.png')} />
                    </TouchableOpacity>

                    <Text 
                    style={styles.main}
                    >Air Quality Index - Sri Lanka</Text>


                    
                </View>
            </View>
            
            <View style={[pageLayouts.curvedBody, styles.curvedBodyLocalStyles]}>
                <View style={styles.selectListContainer}>
                    <View style={styles.selectContainer}>
                        
                    </View>
                </View>
                <ScrollView ref={ref => this.scrollViewRef = ref} style={styles.list}>
                        
                        <View style={styles.listItem}>
                        <View style={styles.topic}>
                            <Text style={styles.txtTopic}>Station 01</Text>
                            <Text style={styles.txtTopicSub}>Relative Humidity</Text>
                        </View>
                        <View style={[styles.widgetContainer,{marginTop:-10,height:110}]}>
                        <Progress.Bar progress={parameter1/ 100} width={250} height={30} color="#FFC300" style={styles.progressBar} />
                        <Text style={styles.progressBarText}>{parameter1} %</Text>
                        
                        </View>
                        </View>


                        <View style={styles.listItem}>
                        <View style={styles.topic}>
                            <Text style={styles.txtTopic}>Station 01</Text>
                            <Text style={styles.txtTopicSub}>Wind</Text>
                        </View>
                        <View style={[styles.widgetContainer,{marginTop:-10,height:110}]}>
                        
                        <RNSpeedometer style={{}} value={Number(parameter2)} size={140} labelStyle={{ fontSize: 24, color: '#FFFFFF' }} labelNoteStyle={{ fontSize: 0, display: 'none' }} labels={[
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
                ]} />
                        
                        </View>
                        </View>


                        <View style={styles.listItem}>
                        <View style={styles.topic}>
                            <Text style={styles.txtTopic}>Station 01</Text>
                            <Text style={styles.txtTopicSub}>Temperature</Text>
                        </View>
                        <View style={[styles.widgetContainer,{marginTop:-10,height:110}]}>
                        <Text style={styles.txt}>{parameter3} ℃ </Text>
                        </View>
                        </View>


                        <View style={styles.listItem}>
                        <View style={styles.topic}>
                            <Text style={styles.txtTopic}>Station 01</Text>
                            <Text style={styles.txtTopicSub}>Rainfall</Text>
                        </View>
                        <View style={[styles.widgetContainer,{marginTop:-10,height:110}]}>
                        <Text style={styles.txt}>{parameter4} mm </Text>
                        </View>
                        </View>
                </ScrollView>
                
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
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        marginTop: -20,
    },

    curvedBodyLocalStyles: {
        marginTop: 5,
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
        backgroundColor: colors.darkBlue,
        marginBottom: 10,
        paddingTop: 10,
        alignItems: 'center',
        marginLeft: 20
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
        color: colors.white,
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
    main: {
        fontSize: 25,
        fontWeight: 'bold',
    }
})

function renderWidget(parameterValue) {
    if (parameterValue.widget == 0) {
        return (
            <View style={[styles.widgetContainer,{marginTop:-10,height:110}]}>
                <RNSpeedometer style={{}} value={parameterValue.value} size={140} labelStyle={{ fontSize: 24, color: '#FFFFFF' }} labelNoteStyle={{ fontSize: 0, display: 'none' }} />
            </View>
        );
    } else if (parameterValue.widget == 1) {
        return (
            <View style={styles.widgetContainer}>
                <Progress.Bar progress={parameterValue.value / 100} width={250} height={30} color="#FFC300" style={styles.progressBar} />
                <Text style={styles.progressBarText}>{parameterValue.value} %</Text>
            </View>
        );
    } else {
        return (<View style={styles.widgetContainer}>
            <Text style={styles.txt}>{parameterValue.value} {parameterValue.unit}</Text>
        </View>);
    }
}