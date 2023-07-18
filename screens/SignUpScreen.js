import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { colors } from '../assets/colors/colors';
import React from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigation } from '@react-navigation/core'

const SignUpScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')


    const navigation = useNavigation()

    const validateFormData = () => {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            alert("Invalid Email entered!")
        }
        else if (password !== confPassword) {
            alert("Your Passwords do not match!")
        }
        else if (password.length < 6) {
            alert("Your Password is too short. It must be at least 8 characters long!")
        }
        else {
            handleSignUp()
        }
    }

    const handleSignUp = () => {
        const auth = getAuth();
        //setup user signup using firebase email and verify email address of user by sending a link
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                sendEmailVerification(user)
                navigation.navigate('Login');


            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === "auth/email-already-in-use") {
                    alert("Email already in use!")
                } else {
                    alert(errorMessage);
                }
            });
    }


    return (
        <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        style={styles.icon}
                        source={require('../assets/icons/user.png')}></Image>

                    <Text style={styles.heading}>HI THERE!</Text>
                    <Text style={styles.subheading}>LET'S CREATE AN ACCOUNT FOR YOU</Text>
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        placeholder="Enter Email">

                    </TextInput>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={true}>

                    </TextInput>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Confirm Password"
                        value={confPassword}
                        onChangeText={text => setConfPassword(text)}
                        secureTextEntry={true}></TextInput>
                    
                        <TouchableOpacity
                            onPress={validateFormData}
                            style={styles.buttonPrimary}>
                            <Text style={styles.buttonText}>SIGN UP</Text>
                        </TouchableOpacity>
                    

                    <TouchableOpacity>
                        <Text
                            onPress={() => navigation.navigate('Login')}
                            style={styles.textSmaller}>Already have an account? Tap here to log in</Text>
                    </TouchableOpacity>
                </View>
            <Image style={styles.bottomIcon}
                source={require('../assets/icons/logo.png')}></Image>
        </View >
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    header: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0
    },

    icon: {
        width: 100,
        height: 100.
    },

    heading: {
        marginTop: 20,
        fontSize: 35,
        color: colors.black,
    },

    subheading: {
        color: colors.grey,
        fontSize: 17,
    },

    bottomIcon: {
        width: 90,
        height: 90,
        marginBottom: 10,
    },

    textInput: {
        marginTop: 20,
        height: 40,
        width: 250,
        textAlign: 'center',
        borderColor: colors.darkBlue,
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 17,
      },
    
      textSmaller: {
        color: colors.grey,
        marginTop: 10,
      },
    
      labelText: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: 17,
      },

      buttonPrimary: {
        flexDirection: 'row',
        marginTop: 25,
        backgroundColor: colors.primary,
        width: 250,
        height: 40,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    buttonSecondary: {
        flexDirection: 'row',
        marginTop: 25,
        backgroundColor: colors.white,
        width: 150,
        height: 40,
        borderWidth: 1,
        borderColor: colors.darkBlue,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    buttonSecondaryBlue: {
        backgroundColor: colors.darkBlue,
    },

    buttonIcon: {
        width: 20,
        height: 20,
        marginRight: 50,
    },

    buttonText: {
        color: colors.white,
        fontSize: 17,
    },

    buttonTextSecondary: {
        color: colors.darkBlue,
        fontSize: 17,
    },

    buttonTextSecondaryWhite: {
        color: colors.white,
        fontSize: 17,
    },

    dashButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '90%',
        height: 40,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#0A1931',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dashButtonText: {
        color: "#0A1931",
        fontSize: 20,
        marginLeft: 10,
    },

    dashButtonIcon: {
        width: 20,
        height: 20,
        marginLeft: 'auto',
        marginRight: 10,
    },

    buttonLightBlue: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: colors.lightBlue,
        width: '100%',
        height: 50,
        borderRadius: 10,
        display: 'flex',
        paddingHorizontal: 20,
        alignItems: 'center',
    }
})
