import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ImagePickerIOS } from 'react-native';
import ProfilePage from './ProfilePage';
import friendsPage from './viewFriendsPage';
import LogOutPage from './LogOutPage';
import requestfriends from './FriendsRequest'
const Tab = createBottomTabNavigator();

  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Profile Page" component={ProfilePage} />
        <Tab.Screen name="Search For Friend" component={friendsPage} />
        <Tab.Screen name="Friend Request" component={requestfriends} />
        <Tab.Screen name = "Log Out" component={LogOutPage} />
      </Tab.Navigator>
    );
  }

  export default MyTabs;