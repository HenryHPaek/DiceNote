import { React, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import MenuTopBar from '../../components/tabScreen/menuTab/menuTopBar';
import NoteItem from '../../components/tabScreen/noteItem';
import CheckmodeTopBar from '../../components/tabScreen/checkmode/checkmodeTopBar';
import CheckmodeTabBar from '../../components/tabScreen/checkmode/checkmodeTabBar';
import { useNoteStore, useCheckmodeStore, useSortStore } from '../../global/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import getSortedData from '../../global/sorting';

export default function recycleBin() {
   const [isLoading, setIsLoading] = useState(true)
   const [sortedNotes, setSortedNotes] = useState([])

   const recycledData = useNoteStore(state => state.recycledData)
   const setRecycleBin = useNoteStore(state => state.setRecycleBin)
   const checkmode = useCheckmodeStore(state => state.checkmode)
   const toggleCheckmode = useCheckmodeStore(state => state.toggleCheckmode)
   const selectItem = useCheckmodeStore(state => state.selectItem)
   const sortOption = useSortStore(state => state.sortOption)

   const db = useSQLiteContext()
   const ITEM_HEIGHT = 80.28571319580078

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
            setIsLoading(true)
            await db.getAllAsync('SELECT id, title, imgURL, date_created, last_modified, category FROM notes WHERE status = 0')
               .then((result) => setRecycleBin(result))
               .then(() => setIsLoading(false))
         }
         catch (err) { console.log(err) }
      }

      fetchData()
   }, [])

   useEffect(() => {
      if (recycledData.length) {
         const sortedData = getSortedData(sortOption, recycledData)
         setSortedNotes(sortedData)
      } else {
         setSortedNotes([])
      }
   }, [recycledData])

   const handleOnPress = (item) => {
      if (checkmode) {
         selectItem(item.id)
      }
   }

   const handleLongPress = item => {
      if (!checkmode) {
         toggleCheckmode()
         selectItem(item.id)
      }
   }

   if (isLoading || !recycledData.length) return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
         <MenuTopBar />
         {!recycledData.length &&
            <View style={styles.emptyTextContainer}>
               <MaterialCommunityIcons
                  name='delete-empty'
                  color={'#495468'}
                  size={150} />
               <Text style={styles.text}>Recycle bin is empty</Text>
            </View>
         }
      </SafeAreaView>
   )

   return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
         {checkmode ? <CheckmodeTopBar data={recycledData} /> : <MenuTopBar isLoading={isLoading} />}
         <View style={{ flex: 1, marginBottom: checkmode ? 63 : null }}>
            <FlashList
               data={sortedNotes}
               renderItem={renderItem}
               keyExtractor={keyExtractor}
               extraData={item => item}
               estimatedItemSize={ITEM_HEIGHT}
            />
         </View>
         {checkmode && <CheckmodeTabBar data={recycledData} />}
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#000710',
   },
   emptyTextContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20
   },
   searchBarContainer: {
      flex: 1
   },
   searchBarInput: {
      fontSize: 20,
      fontWeight: '700',
      color: '#ebecf0',
   },
   text: {
      color: '#495468',
      fontSize: 32,
      fontWeight: '500',
      marginTop: 5
   },
})
