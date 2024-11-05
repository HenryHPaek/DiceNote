import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useCheckmodeStore } from '../../global/store';

const TabIcon = ({ props, focused, activeIcon, inactiveIcon, label }) => {
   return (
      <RectButton {...props} rippleColor={'#7F8E9A'}>
         <View accessible accessibilityRole="button" style={tabStyles(focused).tabContainer}>
            <MaterialCommunityIcons
               name={focused ? activeIcon : inactiveIcon}
               color={focused ? '#92C7EE' : '#cccccc'}
               size={33}
            />
            <Text style={tabStyles(focused).tabTitle}>{label}</Text>
         </View>
      </RectButton>
   )
}

export default function TabLayout() {
   const { checkmode } = useCheckmodeStore()

   return (
      <>
         <Tabs
            screenOptions={{
               tabBarStyle: {
                  backgroundColor: '#111B2E',
                  borderTopWidth: 0,
                  height: 62.3,
                  display: !checkmode ? 'flex' : 'none'
               }
            }}>
            <Tabs.Screen
               name="notes"
               options={{
                  title: 'Notes',
                  headerShown: false,
                  tabBarButton: (props) =>
                     <TabIcon
                        props={props}
                        focused={props.accessibilityState.selected}
                        activeIcon={"note"}
                        inactiveIcon={"note-outline"}
                        label={'Notes'} />
               }}
            />
            <Tabs.Screen
               name="choose"
               options={{
                  title: 'Choose',
                  headerShown: false,
                  tabBarButton: (props) =>
                     <TabIcon
                        props={props}
                        focused={props.accessibilityState.selected}
                        activeIcon={"dice-3"}
                        inactiveIcon={"dice-3-outline"}
                        label={'Choose'} />
               }}
            />
            <Tabs.Screen
               name="menu"
               options={{
                  title: 'Menu',
                  headerShown: false,
                  tabBarButton: (props) =>
                     <TabIcon
                        props={props}
                        focused={props.accessibilityState.selected}
                        activeIcon={"view-grid"}
                        inactiveIcon={"view-grid-outline"}
                        label={'Menu'} />
               }}
            />
         </Tabs>
      </>
   );
}

const tabStyles = (focused) => StyleSheet.create({
   tabContainer: {
      justifyContent: 'space-evenly',
      alignItems: 'center',
   },
   tabTitle: {
      paddingBottom: 6,
      fontSize: 13,
      fontWeight: focused ? 'bold' : 'normal',
      color: focused ? '#92C7EE' : '#cccccc',
   },
});
