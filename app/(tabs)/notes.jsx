import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import TopBar from '../../components/tabScreen/topBar';
import Fab from '../../components/tabScreen/fab';
import NoteItem from '../../components/tabScreen/noteItem';
import CheckmodeTabBar from '../../components/tabScreen/checkmode/checkmodeTabBar';
import CheckmodeTopBar from '../../components/tabScreen/checkmode/checkmodeTopBar';
import { useNoteStore, useSortStore, useCheckmodeStore } from '../../global/store';
import getSortedData from '../../global/sorting';

export default function Notes() {
   const [showFAB, setShowFAB] = useState(true)
   const [sortedNotes, setSortedNotes] = useState([])

   const notesData = useNoteStore(state => state.notesData)
   const setNotes = useNoteStore(state => state.setNotes)
   const checkmode = useCheckmodeStore(state => state.checkmode)
   const toggleCheckmode = useCheckmodeStore(state => state.toggleCheckmode)
   const selectItem = useCheckmodeStore(state => state.selectItem)
   const sortOption = useSortStore(state => state.sortOption)

   const db = useSQLiteContext()
   const ITEM_HEIGHT = 78.28571319580078

   const keyExtractor = item => item.id
   const renderItem = ({ item }) =>
      <NoteItem
         item={item}
         isDisabled={false}
         onPress={() => handleOnPress(item)}
         onLongPress={() => handleLongPress(item)} />

   useEffect(() => {
      const fetchData = async () => {
         try {
            await db.getAllAsync('SELECT id, title, imgURL, date_created, last_modified, category FROM notes WHERE status = 1')
               .then((result) => {
                  if (result) {
                     setNotes(result)
                  }
               })
         }
         catch (err) { console.log(err) }
      }

      fetchData()
   }, [])

   useEffect(() => {
      if (notesData.length) {
         const sortedData = getSortedData(sortOption, notesData)
         setSortedNotes(sortedData)
      } else {
         setSortedNotes([])
      }
   }, [notesData])

   const handleOnPress = (item) => {
      if (checkmode) {
         selectItem(item.id)
      }
      else {
         router.navigate({
            pathname: '../[id]',
            params: {
               id: item.id,
               imgURL: item.imgURL,
               prevScreen: 'Notes'
            }
         })
      }
   }

   const handleLongPress = item => {
      if (!checkmode) {
         toggleCheckmode()
         selectItem(item.id)
      }
   }

   return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
         {checkmode ? <CheckmodeTopBar data={notesData} /> : <TopBar />}
         <View style={{ flex: 1, marginBottom: checkmode ? 63 : null }}>
            <FlashList
               data={sortedNotes}
               renderItem={renderItem}
               keyExtractor={keyExtractor}
               extraData={item => item}
               estimatedItemSize={ITEM_HEIGHT}
               onMomentumScrollBegin={() => setShowFAB(false)}
               onMomentumScrollEnd={() => setShowFAB(true)}
            />
         </View>
         {checkmode ?
            <CheckmodeTabBar data={notesData} />
            : (showFAB ? <Fab /> : null)
         }
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
})
