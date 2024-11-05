import { useState } from 'react';
import { StyleSheet, Text, Pressable, View, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TopBar from '../../components/tabScreen/topBar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../../global/store';

export default function Menu() {
   const isAuthEnabled = useAuthStore(state => state.isAuthEnabled)
   const toggleAuth = useAuthStore(state => state.toggleAuth)

   const MenuTabButton = ({ title, icon, onPress }) => {
      return (
         <View style={styles.buttonWrapper}>
            <Pressable
               style={styles.button}
               unstable_pressDelay={50}
               android_ripple={{ color: '#7F8D98' }}
               onPress={onPress}
            >
               <MaterialCommunityIcons
                  name={icon}
                  color={'#C9CEDA'}
                  size={33}
               />
               <Text style={styles.text}>{title}</Text>
            </Pressable>
         </View>
      )
   }

   return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
         <TopBar />
         <View style={styles.buttonsContainer}>
            <MenuTabButton title={'Archive'} icon={'archive'} onPress={() => router.navigate('../../menuScreens/archive')} />
            <MenuTabButton title={'Recycle bin'} icon={'trash-can'} onPress={() => router.navigate('../../menuScreens/recycleBin')} />

            <View style={styles.buttonWrapper}>
               <Pressable
                  style={styles.button}
                  unstable_pressDelay={50}
                  android_ripple={{ color: '#7F8D98' }}
                  onPress={() => toggleAuth()}
               >
                  <MaterialCommunityIcons
                     name='lock'
                     color={'#C9CEDA'}
                     size={33}
                  />
                  <Text style={styles.text}>Use Biometrics</Text>
                  <Switch
                     style={{ marginLeft: 'auto', marginRight: 20 }}
                     trackColor={{ false: '#767577', true: '#69A4D1' }}
                     thumbColor={'#f4f3f4'}
                     ios_backgroundColor="#3e3e3e"
                     onChange={() => toggleAuth()}
                     value={isAuthEnabled}
                  />
               </Pressable>
            </View>

         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#08101B',
   },
   buttonsContainer: {
      flex: 1,
      flexDirection: 'column',
   },
   buttonWrapper: {
      height: 70,
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20
   },
   button: {
      flex: 1,
      backgroundColor: '#1B2636',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 20,
   },
   text: {
      color: '#E3E9F6',
      fontSize: 20,
      fontWeight: '500',
      paddingLeft: 15
   },
})