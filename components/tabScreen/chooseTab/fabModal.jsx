import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { BaseButton } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FabModal({ fabModalVisible, setFabModalVisible, chosenItem, chosenHistory, setChosenHistory, setIsChanged, setChosenItem }) {
   const discardItem = async () => {
      try {
         const newChosenHistory = [...chosenHistory, chosenItem.id]
         await AsyncStorage.setItem('chosenHistory', JSON.stringify(newChosenHistory))
            .then(() => {
               setChosenHistory(newChosenHistory)
               setIsChanged(true)
               setFabModalVisible(false)
            })
      }
      catch (err) { console.log(err) }
   }

   const handleReplace = () => {
      setFabModalVisible(false)
      setChosenItem(null)
   }

   // const copyItemName = () => {
   //    console.log('Copy-Item-Name button pressed!')
   // }

   return (
      <Portal>
         <Modal
            visible={fabModalVisible}
            onDismiss={() => handleReplace()}
            contentContainerStyle={styles.modalView}
         >
            <View style={styles.headerContainer}>
               <Text style={styles.header}>Chosen item is:</Text>
            </View>
            <View style={styles.itemContainer}>
               {chosenItem &&
                  <>
                     <Image
                        source={chosenItem.imgURL}
                        placeholder={require('../../../assets/image_icon.png')}
                        style={[
                           styles.itemImage,
                           {
                              borderWidth: chosenItem.imgURL ? 1 : 0,
                              borderRadius: chosenItem.imgURL ? 10 : 0,
                              tintColor: chosenItem.imgURL ? null : '#C9CEDA'
                           }
                        ]}
                        contentFit='contain'
                     />
                     <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode='tail'>
                        {chosenItem.title}
                     </Text>
                  </>
               }
            </View>
            <View style={styles.buttonsContainer}>
               <BaseButton
                  onPress={() => handleReplace()}
                  rippleColor={'#7F8E9A'}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Replace</Text>
               </BaseButton>
               <BaseButton
                  onPress={() => discardItem()}
                  rippleColor={'#7F8E9A'}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Discard</Text>
               </BaseButton>
            </View>
         </Modal>
      </Portal>
   )
}

const styles = StyleSheet.create({
   modalView: {
      flex: 1,
      alignSelf: 'center',
      flexDirection: 'column',
      backgroundColor: '#1B2129',
      borderRadius: 20,
      width: '100%',
      maxWidth: 380,
      maxHeight: 260,
      alignItems: 'flex-start',
      justifyContent: 'space-around',
   },
   headerContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
   },
   header: {
      flex: 1,
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
      marginLeft: 20
   },
   itemContainer: {
      flex: 1.2,
      flexDirection: 'row',
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 20
   },
   itemImage: {
      height: 64,
      width: 64,
      marginRight: 15,
      borderRadius: 12,
      borderColor: 'grey',
   },
   itemTitle: {
      color: '#ebecf0',
      fontSize: 21,
      paddingBottom: 4,
      width: '70%'
   },
   buttonsContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 25,
      marginLeft: 15,
      marginRight: 25,
      borderRadius: 20

   },
   buttonText: {
      color: '#C6D7F5',
      fontSize: 18
   },
})