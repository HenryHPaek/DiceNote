import { React, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native'
import { Appbar, Searchbar } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useNoteStore } from '../global/store';
import NoteItem from '../components/tabScreen/noteItem';

export default function search() {
   const [searchQuery, setSearchQuery] = useState('')
   const [searchedData, setSearchedData] = useState([])
   const notesData = useNoteStore(state => state.notesData)
   const ITEM_HEIGHT = 80.28571319580078

   const keyExtractor = item => item.id
   const renderItem = ({ item }) =>
      <NoteItem item={item}
         onPress={() => handleOnPress(item)}
         onLongPress={null}
         isDisabled={false} />

   const handleOnPress = (item) => {
      router.navigate({
         pathname: '../[id]',
         params: {
            id: item.id,
            imgURL: item.imgURL,
            prevScreen: 'Search'
         }
      })
   }

   useEffect(() => {
      if (searchQuery.length) {
         const result = notesData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
         setSearchedData(result)
      } else {
         setSearchedData([])
      }
   }, [searchQuery, notesData])

   return (
      <View style={styles.container}>
         <Appbar.Header
            style={{ backgroundColor: '#0A1328' }}
            dark={true}
         >
            <View style={styles.searchBarContainer}>
               <Searchbar
                  style={{ backgroundColor: 'transparent' }}
                  autoFocus={true}
                  inputStyle={styles.searchBarInput}
                  icon={'arrow-left'}
                  onIconPress={() => router.back()}
                  placeholder="Search"
                  placeholderTextColor={'#96A0B9'}
                  selectionColor={'cadetblue'}
                  onChangeText={setSearchQuery}
                  value={searchQuery}
               />
            </View>
         </Appbar.Header>

         <FlashList
            data={searchedData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            extraData={item => item.selected}
            estimatedItemSize={ITEM_HEIGHT}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#000710',
   },
   searchBarContainer: {
      flex: 1
   },
   searchBarInput: {
      fontSize: 20,
      fontWeight: '700',
      color: '#ebecf0',
   }
})
