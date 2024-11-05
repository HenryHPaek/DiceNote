import { React, useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Appbar } from 'react-native-paper';
import { router } from 'expo-router';
import NoteMenuModal from './noteMenuModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NoteTopBar({ setIsMenuOn, titleReady, currTitle, updateData }) {
   const [isMenuVisible, setIsMenuVisible] = useState(false)

   const storeData = async (value) => {
      try {
         await AsyncStorage.setItem('title', value)
      }
      catch (err) { console.log(err) }
   }

   const backAction = async () => {
      await updateData()
      await AsyncStorage.setItem('title', '')
         .then(() => router.back())
   }

   return (
      <>
         <Appbar.Header
            style={{ backgroundColor: '#0A1328' }}
            dark={true}
         >
            <Appbar.BackAction
               color='#fff'
               rippleColor={'#7F8D98'}
               onPress={() => { backAction() }}
            />
            <View style={styles.mainContainer}>
               {titleReady ?
                  <TextInput
                     style={styles.titleInputContainer}
                     placeholder="Add Title..."
                     placeholderTextColor={'#7D869B'}
                     selectionColor={'cadetblue'}
                     defaultValue={currTitle}
                     onChangeText={text => storeData(text)}
                     maxLength={50}
                  />
                  : <View style={{ flex: 1, backgroundColor: 'transparent' }} ></View>
               }
               {/* To be finished...................................................... */}
               {/* <View style={styles.iconsContainer}>
                  <Appbar.Action
                     icon="magnify"
                     color='#fff'
                     rippleColor={'#7F8D98'}
                     onPress={() => { }} />
                  <Appbar.Action
                     icon="dots-vertical"
                     color='#fff'
                     rippleColor={'#7F8D98'}
                     onPress={() => setIsMenuOn(true)} />
               </View> */}
               <View style={{ flex: 0.3 }}></View>
            </View>
         </Appbar.Header>
         <View style={styles.itemBorder}></View>
      </>
   )
}

const styles = StyleSheet.create({
   mainContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
   },
   iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginRight: 50
   },
   titleContainer: {
      flex: 1,
      color: '#eee',
      fontSize: 21,
      fontWeight: 'bold',
      marginRight: 5,
      paddingBottom: 2
   },
   titleText: {
      color: '#eee',
      fontSize: 21,
      fontWeight: 'bold'
   },
   titleNoText: {
      color: '#7D869B',
      fontSize: 21,
      fontWeight: 'bold'
   },
   titleInputContainer: {
      flex: 1,
      color: '#eee',
      fontSize: 21,
      fontWeight: 'bold',
      marginRight: 5,
      paddingBottom: 2
   },
   itemBorder: {
      borderWidth: 0.2,
      borderColor: "#575757"
   },
})