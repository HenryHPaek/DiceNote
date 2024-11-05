import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { BaseButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResetModal({ resetModalVisible, setResetModalVisible, setChosenHistory, setIsChanged }) {
   const resetChosenHistory = async () => {
      try {
         await AsyncStorage.setItem('chosenHistory', "[]")
            .then(() => {
               setChosenHistory([])
               setIsChanged(true)
               setResetModalVisible(false)
            })
      }
      catch (err) { console.log(err) }
   }

   return (
      <Portal>
         <Modal
            visible={resetModalVisible}
            onDismiss={() => setResetModalVisible(false)}
            contentContainerStyle={styles.modalView}
         >
            <View style={styles.headerContainer}>
               <Text style={styles.header}>Do you want to reset chosen items history?</Text>
            </View>

            <View style={styles.buttonsContainer}>
               <BaseButton
                  onPress={() => setResetModalVisible(false)}
                  rippleColor={'#7F8E9A'}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Cancel</Text>
               </BaseButton>
               <BaseButton
                  onPress={() => resetChosenHistory()}
                  rippleColor={'#7F8E9A'}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Reset</Text>
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
      maxWidth: 360,
      maxHeight: 200,
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   headerContainer: {
      flex: 1,
      maxHeight: 80,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      marginTop: 8
   },
   header: {
      flex: 1,
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 30,
      marginRight: 30
   },
   buttonsContainer: {
      flex: 1,
      maxHeight: 80,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4
   },
   button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      marginLeft: 20,
      marginRight: 20,
      borderRadius: 20

   },
   buttonText: {
      color: '#C6D7F5',
      fontSize: 18
   },
})