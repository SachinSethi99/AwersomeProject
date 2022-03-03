/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native'
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import MyTabs from './tabNavigator';
// import MainPage from './MainPage';
// import { Camera } from 'expo-camera';
// import friendsPage from './viewFriendsPage';
import CameraPage from './Camera';
import FriendProfileWall from './FriendsProfile';


const Stack = createNativeStackNavigator();


function navigator () {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "LoginPage">
            <Stack.Screen name = "LoginPage" component={LoginPage} options={{headerShown:false,}} />
            <Stack.Screen name ="FriendsProfilePage" component={FriendProfileWall} />
            <Stack.Screen name = "SignUpPage" component={SignUpPage} />
            <Stack.Screen name ="CameraPage" component={CameraPage}/>
            <Stack.Screen name="ProfilePage" component={MyTabs}options={{headerShown:false,}} />
            {/* <Stack.Screen name = "LogOutPage" component={LogOutPage} /> */}
            </Stack.Navigator>

        </NavigationContainer>
    );
}

export default navigator; 