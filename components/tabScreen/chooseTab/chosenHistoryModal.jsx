import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { BaseButton } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useNoteStore } from '../../../global/store';

export default function ChosenHistoryModal({ historyVisible, setHistoryVisible, chosenHistory, setResetModalVisible }) {
   const [chosenData, setChosenData] = useState([])
   const [modalReady, setModalReady] = useState(false)
   const [parentHeight, setParentHeight] = useState(0)
   const notesData = useNoteStore(state => state.notesData)
   const ITEM_HEIGHT = 60

   const keyExtractor = item => item.id
   const renderItem = ({ item }) =>
      <View style={styles.itemContainer}>
         <Image
            source={item.imgURL}
            placeholder={require('../../../assets/image_icon.png')}
            style={[
               styles.itemImage,
               {
                  borderWidth: item.imgURL ? 1 : 0,
                  borderRadius: item.imgURL ? 12 : 0,
                  tintColor: item.imgURL ? null : '#C9CEDA'
               }
            ]}
            contentFit='contain'
         />
         <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode='tail'>
            {item.title}
         </Text>
      </View>

   useEffect(() => {
      if (chosenHistory) {
         const chosenData = notesData.filter(item => chosenHistory.includes(item.id))
         const sortedData = [...chosenData].sort((a, b) => {
            const indexA = chosenHistory.indexOf(a.id)
            const indexB = chosenHistory.indexOf(b.id)
            return indexA - indexB
         })
         setChosenData(sortedData)
      }
   }, [chosenHistory])

   useEffect(() => {
      if (chosenHistory) {
         const height = 170 + chosenHistory.length * 64
         setParentHeight(height)
         setModalReady(true)
      }
   }, [historyVisible])

   const handleClose = () => {
      setModalReady(false)
      setHistoryVisible(false)
   }

   const openClear = () => {
      setHistoryVisible(false)
      setResetModalVisible(true)
   }

   return (
      <Portal>
         <Modal
            visible={modalReady && historyVisible}
            onDismiss={handleClose}
            contentContainerStyle={[styles.modalView, { height: parentHeight, maxHeight: 580, }]}
         >
            <View style={styles.headerContainer}>
               <Text style={styles.header}>Chosen Items History:</Text>
            </View>
            {parentHeight &&
               <View style={styles.listContainer}>
                  <FlashList
                     data={chosenData}
                     renderItem={renderItem}
                     keyExtractor={keyExtractor}
                     estimatedItemSize={ITEM_HEIGHT}
                  />
               </View>
            }
            <View style={styles.buttonsContainer}>
               <BaseButton
                  onPress={openClear}
                  rippleColor={'#7F8E9A'}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Clear</Text>
               </BaseButton>
               <BaseButton
                  onPress={handleClose}
                  rippleColor={'#7F8E9A'}
                  style={styles.button}>
                  <Text style={styles.buttonText}>OK</Text>
               </BaseButton>
            </View>
         </Modal>
      </Portal>
   )
}

const styles = StyleSheet.create({
   modalView: {
      flexs: 1,
      alignSelf: 'center',
      flexDirection: 'column',
      backgroundColor: '#1B2129',
      borderRadius: 20,
      width: '100%',
      maxWidth: 380,
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   headerContainer: {
      height: 80,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: 2
   },
   header: {
      flex: 1,
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
      marginLeft: 20
   },
   listContainer: {
      flex: 1,
      width: '100%',
      paddingLeft: 20,
      paddingRight: 20,
   },
   itemContainer: {
      flex: 1,
      flexDirection: 'row',
      height: 60,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: 5
   },
   itemImage: {
      height: 60,
      width: 60,
      marginRight: 13,
      borderRadius: 8,
      borderColor: 'grey',
   },
   itemTitle: {
      color: '#ebecf0',
      fontSize: 20,
      paddingBottom: 4,
      paddingRight: 1,
      maxWidth: '75%'
   },
   buttonsContainer: {
      flex: 1,
      maxHeight: 80,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
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