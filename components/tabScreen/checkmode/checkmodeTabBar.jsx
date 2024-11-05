import { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import Modal from "react-native-modal";
import { useSQLiteContext } from 'expo-sqlite';
import { usePathname } from 'expo-router';
import CheckmodeButton from './checkmodeButton';
import { useNoteStore, useCheckmodeStore } from '../../../global/store';

export default function CheckmodeTabBar({ data }) {
   const { notesData, setNotes, deleteNotes, deleteArchivedNotes, deleteRecycledNotes } = useNoteStore()
   const { checkmode, selectedItems, toggleCheckmode, deselectAll } = useCheckmodeStore()
   const pathname = usePathname()
   const db = useSQLiteContext()

   const handleClosing = () => {
      deselectAll()
      toggleCheckmode()
   }

   const handleRelocate = (items) => {
      if (pathname == "/notes") {
         deleteNotes(items)
      }
      else if (pathname == "/menuScreens/archive") {
         deleteArchivedNotes(items)
         const newData = data.filter((item) => items.includes(item.id))
         setNotes([...notesData, ...newData])
      }
      else if (pathname == "/menuScreens/recycleBin") {
         deleteRecycledNotes(items)
         const newData = data.filter((item) => items.includes(item.id))
         setNotes([...notesData, ...newData])
      }
   }

   const handleDelete = (items) => {
      if (pathname == "/notes") {
         deleteNotes(items)
      }
      else if (pathname == "/menuScreens/archive") {
         deleteArchivedNotes(items)
      }
      else if (pathname == "/menuScreens/recycleBin") {
         deleteRecycledNotes(items)
      }
   }

   {/* To be finished...................................................... */ }
   // const setCategory = async (items) => {
   //    try {
   //       await db.runAsync(`UPDATE notes SET category = ??? WHERE id IN (${items.join()})`)
   //          .then((result) => {
   //             console.log(`${result.changes} items moved...`)
   //             handleClosing()
   //          })
   //    }
   //    catch (err) { console.log(err) }
   // }

   const toggleArchive = async (items) => {
      const isArchived = () => { return (pathname == "/menuScreens/archive") }
      const archived = isArchived()

      const getNewStatus = () => {
         if (archived) return 1
         return 2
      }
      const newStatus = getNewStatus()

      const archivingText = ['Archiving item(s)', 'Do you want to send selected item(s) to archive?']
      const unarchivingText = ['Unarchiving item(s)', 'Do you want to unarchive selected item(s)?']

      Alert.alert(
         archived ? unarchivingText[0] : archivingText[0],
         archived ? unarchivingText[1] : archivingText[1],
         [
            {
               text: 'Cancel',
               onPress: () => null,
               style: 'cancel',
            },
            {
               text: 'OK', onPress: async () => {
                  try {
                     handleRelocate(items)
                     await db.runAsync(`UPDATE notes SET status = ${newStatus} WHERE id IN (${items.join()})`)
                        .then(() => handleClosing())
                  }
                  catch (err) { console.log(err) }
               }
            },
         ]
      )
   }

   const deleteItem = async (items) => {
      Alert.alert(
         'Deleting item(s)',
         'Do you want to send selected item(s) to Recycle bin?',
         [
            {
               text: 'Cancel',
               onPress: () => null,
               style: 'cancel',
            },
            {
               text: 'OK', onPress: async () => {
                  try {
                     handleDelete(items)
                     await db.runAsync(`UPDATE notes SET status = 0 WHERE id IN (${items.join()})`)
                        .then(() => handleClosing())
                  }
                  catch (err) { console.log(err) }
               }
            },
         ]
      )
   }

   const deleteForever = async (items) => {
      Alert.alert(
         'Deleting item(s)',
         'Are you sure you want to delete selected item(s) permanently?',
         [
            {
               text: 'Cancel',
               onPress: () => null,
               style: 'cancel',
            },
            {
               text: 'OK', onPress: async () => {
                  try {
                     handleDelete(items)
                     await db.runAsync(`DELETE FROM notes WHERE id IN (${items.join()})`)
                        .then(() => handleClosing())
                  }
                  catch (err) { console.log(err) }
               }
            },
         ]
      )
   }

   const restore = async (items) => {
      try {
         handleRelocate(items)
         await db.runAsync(`UPDATE notes SET status = 1 WHERE id IN (${items.join()})`)
            .then(() => handleClosing())
      }
      catch (err) { console.log(err) }
   }

   return (
      <>
         <Modal
            isVisible={checkmode}
            animationIn={'slideInUp'}
            animationInTiming={250}
            coverScreen={false}
            hasBackdrop={false}
            onBackButtonPress={handleClosing}
            style={{ margin: 0 }}
         >
            <View style={styles.container}>
               {(pathname == "/notes" || pathname == "/menuScreens/archive") &&
                  <>
                     {/* To be finished...................................................... */}
                     {/* <CheckmodeButton
                        icon={'shape'}
                        name={'Category'}
                        onPress={() => { setCategory(selectedItems) }}
                        selectedItems={selectedItems} /> */}
                     <CheckmodeButton
                        icon={pathname == "/notes" ? 'archive' : 'archive-minus'}
                        name={pathname == "/notes" ? 'Archive' : 'Unarchive'}
                        onPress={() => { toggleArchive(selectedItems) }} />
                     <CheckmodeButton
                        icon={'delete'}
                        name={'Delete'}
                        onPress={() => { deleteItem(selectedItems) }} />
                  </>
               }
               {pathname == "/menuScreens/recycleBin" &&
                  <>
                     <CheckmodeButton
                        icon={'restore'}
                        name={'Restore'}
                        onPress={() => { restore(selectedItems) }} />
                     <CheckmodeButton
                        icon={'delete-forever'}
                        name={'Delete'}
                        onPress={() => { deleteForever(selectedItems) }} />
                  </>
               }
            </View>
         </Modal>
      </>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#161F2E',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 63,
      alignItems: 'baseline',
      justifyContent: 'space-around',
   },
   buttonContainer: {
      flex: 1,
      paddingTop: 6
   },
   button: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
   },
   buttonName: {
      paddingBottom: 6,
      fontSize: 13,
      color: '#cccccc',
   },
});