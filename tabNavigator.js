import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ImagePickerIOS } from 'react-native';
import ProfilePage from './ProfilePage';
import followerPage from './viewFriendsPage';
import LogOutPage from './LogOutPage';
import requestfriends from './FriendsRequest';
import editProfileDetails from './UpdateProfileDetails';
import Draft from './DraftPage';
const Tab = createBottomTabNavigator();

  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Profile Page" component={ProfilePage} />
        <Tab.Screen name="Draft Page" component={Draft} />
        <Tab.Screen name="Friend Requests" component={followerPage} />
        <Tab.Screen name="Send Friend Request" component={requestfriends} />
        <Tab.Screen name="Prfile Edit" component={editProfileDetails} />
        <Tab.Screen name = "Log Out" component={LogOutPage} />
      </Tab.Navigator>
    );
  }

  export default MyTabs;