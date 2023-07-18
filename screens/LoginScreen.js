import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React from 'react';
import { useState} from 'react';
import { colors } from '../assets/colors/colors';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()


  // ------------------ Login Management using mail and password ----------------------


  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        navigation.replace('Home');

      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/user-not-found") {
          alert("User not found. Please check your email address.")
          
        }
        else if (errorCode === "auth/wrong-password") {
          alert("Wrong credentials provided")
         
        }
        else if (errorCode === "auth/user-disabled") {
          alert("User disabled. Please contact customer support.")
          
        }
        else if (errorCode === "auth/network-request-failed") {
          alert("Login request failed. Please Check your Internet connection.")
          
        }
        else {
          alert(error.message)
          
        }
      })
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/user.png')}></Image>

        <Text style={styles.heading}>AQI Login</Text>

        <TextInput
          style={styles.textInput}
          value={email}
          placeholder="Enter Your Email"
          onChangeText={text => setEmail(text)}>

        </TextInput>


        <TextInput
          style={styles.textInput}
          value={password}
          placeholder="Enter Your Password"
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}>

        </TextInput>

        <TouchableOpacity
          onPress={() => navigation.navigate('PasswordReset')}>
          <Text style={styles.textSmaller}>Forgot Password?</Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => {
        
            handleLogin()
          }}
          style={styles.buttonPrimary}>
          
            <Text style={styles.buttonText}>LOGIN</Text>


        </TouchableOpacity>



        <TouchableOpacity>
          <Text
            onPress={() => {
              navigation.navigate('SignUp')
            }}
            style={styles.textSmaller}>Do not have an account? Let's quickly create one for you.</Text>

        </TouchableOpacity>



      </View>
      <Image style={styles.bottomIcon}
        source={require('../assets/icons/logo.png')}></Image>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
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

  buttonPrimary: {
    marginTop: 25,
    backgroundColor: colors.darkBlue,
    width: 250,
    height: 40,
    borderRadius: 10,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textSmaller: {
    color: colors.grey,
    marginTop: 10,
  },

  buttonText: {
    color: colors.white,
    fontSize: 17,
  },

  bottomIcon: {
    width: 90,
    height: 90,
    marginBottom: 30,
  }
})
