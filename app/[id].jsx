import { React, useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, AppState, BackHandler } from 'react-native';
import { RichText, Toolbar, useEditorBridge, CoreBridge, DEFAULT_TOOLBAR_ITEMS, useBridgeState, TenTapStartKit, PlaceholderBridge, LinkBridge, TaskListBridge } from '@10play/tentap-editor';
import NoteTopBar from '../components/editorScreen/noteTopBar'
import NoteMenuModal from '../components/editorScreen/noteMenuModal';
import { themeProps, newStyle } from '../components/editorScreen/noteStyles';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useNoteStore } from '../global/store'
import AsyncStorage from '@react-native-async-storage/async-storage';

if (DEFAULT_TOOLBAR_ITEMS.length === 15) {
   DEFAULT_TOOLBAR_ITEMS.splice(8, 1)
   DEFAULT_TOOLBAR_ITEMS.splice(7, 1)
   DEFAULT_TOOLBAR_ITEMS.splice(5, 1)
   DEFAULT_TOOLBAR_ITEMS.splice(4, 1)
}

export default function NoteEditor() {
   const [isMenuOn, setIsMenuOn] = useState(false)
   const [titleReady, setTitleReady] = useState(false)
   const [currTitle, setCurrTitle] = useState('')

   const db = useSQLiteContext()
   const updateNote = useNoteStore(state => state.updateNote)
   const updateArchivedNote = useNoteStore(state => state.updateArchivedNote)
   const addNote = useNoteStore(state => state.addNote)
   const { id, imgURL, prevScreen } = useLocalSearchParams()
   var currId = id

   const editor = useEditorBridge({
      editable: false,
      avoidIosKeyboard: true,
      theme: themeProps,
      bridgeExtensions: [
         ...TenTapStartKit,
         PlaceholderBridge.configureExtension({
            placeholder: 'Type something...',
         }),
         LinkBridge.configureExtension({
            openOnClick: true,
            linkOnPaste: true,
         }),
         CoreBridge.configureCSS(newStyle),
         // TaskListBridge.configureCSS(tlStyle)
      ],
   })

   const editorState = useBridgeState(editor)

   const updateData = (id, newData) => {
      if (prevScreen == 'Notes' || prevScreen == 'Search') updateNote(id, newData)
      else if (prevScreen == 'Archive') updateArchivedNote(id, newData)
   }

   const editNote = async () => {
      const isEmpty = (initial, latest) => {
         return (initial == null) && (latest == `<p></p>` || latest == `null<p></p>`)
      }

      try {
         const timestamp = Date.now()
         const newContent = await editor.getHTML()
         var newTitle = await AsyncStorage.getItem('title')

         const initialData = await AsyncStorage.getItem('initialData')
         const latestData = newTitle + newContent

         if (!isEmpty(initialData, latestData) && initialData !== latestData) {
            if (newTitle == null) {
               const appTime = new Date(timestamp)
               newTitle = appTime.toLocaleString([], { dateStyle: 'medium' })
            }

            if (currId == '-2') {
               await db.runAsync(`INSERT INTO notes (title, content, date_created, last_modified) VALUES (?, ?, ?, ?)`,
                  newTitle,
                  newContent,
                  timestamp,
                  timestamp
               )
               const lastID = await db.getFirstAsync('SELECT MAX(id) AS "id" FROM notes')
               addNote({ id: lastID.id, imgURL: imgURL, title: newTitle, date_created: timestamp, last_modified: timestamp })
               currId = lastID.id
            } else {
               updateData(currId, { title: newTitle, last_modified: timestamp })
               await db.runAsync(`UPDATE notes SET
               title = ?,
               content = ?,
               last_modified = ?
               WHERE id = ${currId}`,
                  newTitle, newContent, timestamp
               )
            }
         }
      }
      catch (err) { console.log(err) }
   }

   useEffect(() => {
      const setTitle = async (title) => {
         try {
            await AsyncStorage.setItem('title', title)
               .then(() => {
                  setCurrTitle(title)
               })
         }
         catch (err) { console.log(err) }
      }

      const initializeData = async (title, content) => {
         try {
            const initData = (title && content) ? title + content : ''
            await AsyncStorage.setItem('initialData', initData)
         }
         catch (err) { console.log(err) }
      }

      if (editorState.isReady) {
         if (id !== '-2') {
            const currNote = db.getFirstSync(`SELECT title, content FROM notes WHERE id = ${id}`)
            editor.setContent(currNote.content)
            setTitle(currNote.title)
            initializeData(currNote.title, currNote.content)
         } else {
            initializeData()
         }
         setTitleReady(true)
         editor.setEditable(true)
      }
   }, [editorState.isReady])

   // useEffect(() => {
   //    if (isMenuOn) {
   //       editor.setEditable(false)
   //       setIsMenuOn(true)
   //    }
   //    else { editor.setEditable(true) }
   // }, [isMenuOn])

   useEffect(() => {
      const triggerUpdate = async () => {
         editNote()
      }
      const appStateListener = AppState.addEventListener(
         'change', nextAppState => {
            if (nextAppState == 'background' || nextAppState == 'inactive') {
               triggerUpdate()
            }
         }
      )

      return () => appStateListener.remove()
   }, [])

   useEffect(() => {
      const backAction = async () => {
         await editNote()
         await AsyncStorage.setItem('title', '')
            .then(() => {
               router.back()
               return true
            })
      }
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

      return () => backHandler.remove()
   }, [])

   return (
      <SafeAreaView style={styles.container}>
         <NoteTopBar
            setIsMenuOn={setIsMenuOn}
            titleReady={titleReady}
            currTitle={currTitle}
            updateData={editNote} />
         <RichText editor={editor} textZoom={105} />
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
         >
            <Toolbar editor={editor} hidden={false} />
         </KeyboardAvoidingView>
         <NoteMenuModal isMenuVisible={isMenuOn} setIsMenuVisible={setIsMenuOn} />
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#14191F',
   },
   keyboardAvoidingView: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
   },
})
