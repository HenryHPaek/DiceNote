import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import { usePathname } from 'expo-router';
import { useNoteStore, useSortStore } from '../../global/store';
import NoteItem from '../../components/tabScreen/noteItem';
import TopBar from '../../components/tabScreen/topBar';
import Fab from '../../components/tabScreen/fab';
import FabModal from '../../components/tabScreen/chooseTab/fabModal';
import ResetModal from '../../components/tabScreen/chooseTab/resetModal';
import getSortedData from '../../global/sorting';

export default function Choose() {
   const [showFAB, setShowFAB] = useState(true)
   const [dataFiltered, setDataFiltered] = useState([])
   const [chosenHistory, setChosenHistory] = useState([])
   const [chosenItem, setChosenItem] = useState(null)
   const [isChanged, setIsChanged] = useState(false)

   const [fabModalVisible, setFabModalVisible] = useState(false)
   const [resetModalVisible, setResetModalVisible] = useState(false)
   // const [menuVisible, setMenuVisible] = useState(false)

   const notesData = useNoteStore(state => state.notesData)
   const sortOption = useSortStore(state => state.sortOption)
   const pathname = usePathname()
   const flashListRef = useRef(null)
   const ITEM_HEIGHT = 80.28571319580078

   const keyExtractor = item => item.id
   const renderItem = ({ item }) =>
      <NoteItem item={item}
         onPress={null}
         onLongPress={null}
         isDisabled={true} />

   useEffect(() => {
      const fetchData = async () => {
         try {
            const stringifiedArray = await AsyncStorage.getItem('chosenHistory')

            if (stringifiedArray != null) {
               const restoredArray = JSON.parse(stringifiedArray)
               const result = notesData.filter(item => !restoredArray.includes(item.id))
               const sortedData = getSortedData(sortOption, result)
               setDataFiltered(sortedData)
               setChosenHistory(restoredArray)
            } else {
               await AsyncStorage.setItem('chosenHistory', "[]")
                  .then(() => setDataFiltered(notesData))
            }
         }
         catch (err) { console.log(err) }
      }

      fetchData()
   }, [notesData])

   useEffect(() => {
      if (chosenItem) {
         setFabModalVisible(true)
      }
   }, [chosenItem])

   useEffect(() => {
      if (isChanged) {
         if (chosenItem) {
            const newDataFiltered = dataFiltered.filter(item => !chosenHistory.includes(item.id))
            setDataFiltered(newDataFiltered)
            setChosenItem(null)
            setIsChanged(false)
         } else {
            const sortedData = getSortedData(sortOption, notesData)
            setDataFiltered(sortedData)
            setIsChanged(false)
         }
      }
   }, [isChanged])

   useEffect(() => {
      if (flashListRef.current) {
         flashListRef.current.scrollToOffset({ animated: false, offset: 0 })
      }
   }, [pathname])

   return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
         <TopBar setResetModalVisible={setResetModalVisible} chosenHistory={chosenHistory} />
         <FlashList
            ref={flashListRef}
            data={dataFiltered}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={ITEM_HEIGHT}
            onMomentumScrollBegin={() => setShowFAB(false)}
            onMomentumScrollEnd={() => setShowFAB(true)}
         />
         {showFAB && <Fab setChosenItem={setChosenItem} dataFiltered={dataFiltered} setFabModalVisible={setFabModalVisible} />}
         <FabModal
            fabModalVisible={fabModalVisible}
            setFabModalVisible={setFabModalVisible}
            chosenItem={chosenItem}
            chosenHistory={chosenHistory}
            setChosenHistory={setChosenHistory}
            setIsChanged={setIsChanged}
            setChosenItem={setChosenItem}
         />
         <ResetModal
            resetModalVisible={resetModalVisible}
            setResetModalVisible={setResetModalVisible}
            setChosenHistory={setChosenHistory}
            setIsChanged={setIsChanged}
         />
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#000710',
   },
   text: {
      color: 'white',
   },
});