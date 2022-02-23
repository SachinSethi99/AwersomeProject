import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-web';
import {NavigationContainer} from '@react-navigation/native'
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import LogOutPage from './LogOutPage';
// import MainPage from './MainPage';
// import { Camera } from 'expo-camera';
import ProfilePage from './ProfilePage';
// import friendsPage from './viewFriendsPage';
const Stack = createNativeStackNavigator();

function navigator () {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "LoginPage">
            <Stack.Screen name = "LoginPage" component={LoginPage} />
            <Stack.Screen name = "SignUpPage" component={SignUpPage} />
            <Stack.Screen name = "ProfilePage" component={ProfilePage} />
              <Stack.Screen name = "LogOutPage" component={LogOutPage} />
             {/* <Stack.Screen name = "friendsPage" component={friendsPage} />  */}
           
  
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default navigator; 