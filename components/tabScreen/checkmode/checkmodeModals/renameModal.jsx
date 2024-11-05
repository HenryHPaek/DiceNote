import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { BaseButton } from 'react-native-gesture-handler';
import { useNoteStore, useCheckmodeStore } from '../../../../global/store';
import { useSQLiteContext } from 'expo-sqlite';
import { usePathname } from 'expo-router';

export default function RenameModal({ renameModalVisible, setRenameModalVisible, handleClosing }) {
   const notesData = useNoteStore(state => state.notesData)
   const updateNote = useNoteStore(state => state.updateNote)
   const archivedData = useNoteStore(state => state.archivedData)
   const updateArchivedNote = useNoteStore(state => state.updateArchivedNote)
   const selectedItems = useCheckmodeStore(state => state.selectedItems)
   const pathname = usePathname()

   const currNote = pathname == "/notes" ?
      notesData.find((item) => selectedItems.includes(item.id))
      : archivedData.find((item) => selectedItems.includes(item.id))

   const { id, title } = currNote
   const [text, setText] = useState(title)
   const db = useSQLiteContext()

   const handleUpdate = (newTitle, timestamp) => {
      if (pathname == "/notes") updateNote(id, { title: newTitle, last_modified: timestamp })
      else updateArchivedNote(id, { title: newTitle, last_modified: timestamp })
   }

   const handleEdit = async (txt) => {
      try {
         const timestamp = Date.now()
         var newTitle = txt
         if (!txt.length) {
            const appTime = new Date(timestamp)
            newTitle = appTime.toLocaleString([], { dateStyle: 'medium' })
         }

         handleUpdate(newTitle, timestamp)
         await db.runAsync(`UPDATE notes SET
            title = ?,
            last_modified = ?
            WHERE id = ${id}`,
            newTitle, timestamp
         )
      }
      catch (err) { console.log(err) }

      setRenameModalVisible(false)
      handleClosing()
   }

   return (
      <Portal>
         <Modal
            visible={renameModalVisible}
            onDismiss={() => setRenameModalVisible(false)}
            contentContainerStyle={styles.renameModalView}
         >
            <View style={styles.headerContainer}>
               <Text style={styles.header}>Change title</Text>
            </View>
            <View style={styles.textinputContainer}>
               <TextInput
                  style={styles.textinput}
                  selectionColor={'cadetblue'}
                  underlineColorAndroid={'skyblue'}
                  autoFocus={true}
                  defaultValue={title}
                  value={text}
                  onChangeText={text => setText(text)}
                  maxLength={50}
               />
            </View>
            <View style={styles.buttonsContainer}>
               <BaseButton
                  onPress={() => setRenameModalVisible(false)}
                  rippleColor={'#7F8E9A'}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Cancel</Text>
               </BaseButton>
               <BaseButton
                  onPress={() => handleEdit(text)}
                  rippleColor={'#7F8E9A'}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Edit</Text>
               </BaseButton>
            </View>
         </Modal>
      </Portal>
   )
}

const styles = StyleSheet.create({
   renameModalView: {
      flex: 1,
      alignSelf: 'center',
      flexDirection: 'column',
      backgroundColor: '#1B2129',
      borderRadius: 20,
      width: '100%',
      maxWidth: 380,
      maxHeight: 180,
      alignItems: 'flex-start',
      justifyContent: 'space-around',
   },
   headerContainer: {
      flex: 0.8,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 8,
   },
   header: {
      flex: 1,
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
      marginLeft: 20
   },
   textinputContainer: {
      flex: 0.8,
      width: '100%',
      justifyContent: 'center',
      alignSelf: 'center',
   },
   textinput: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      width: '93%',
      color: 'white',
      fontSize: 17,
      paddingLeft: 5,
      paddingRight: 5,
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
      padding: 10,
      marginLeft: 15,
      marginRight: 25,
      borderRadius: 20

   },
   buttonText: {
      color: '#C6D7F5',
      fontSize: 16
   },
})