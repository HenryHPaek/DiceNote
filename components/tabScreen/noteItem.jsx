import { React, memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';
import { usePathname } from 'expo-router';
import { Image } from 'expo-image';
import { useNoteStore, useSortStore, useCheckmodeStore } from '../../global/store';

const NoteItem = ({ item, onPress, onLongPress, isDisabled }) => {
   const { id, title, imgURL, date_created, last_modified } = item
   const db = useSQLiteContext()
   const pathname = usePathname()

   const { isSelected } = useCheckmodeStore()
   const updateNote = useNoteStore(state => state.updateNote)
   const updateArchivedNote = useNoteStore(state => state.updateArchivedNote)
   const checkmode = useCheckmodeStore(state => state.checkmode)
   const sortOption = useSortStore(state => state.sortOption)

   const imageStyle = {
      borderWidth: imgURL ? 1 : 0,
      borderRadius: imgURL ? 10 : 0,
      tintColor: imgURL ? null : '#C9CEDA'
   }

   const userTime = () => {
      const todayDate = new Date().getDate()

      if (sortOption == 'Date Created') {
         const createdDate = new Date(date_created)
         if (todayDate == createdDate.getDate()) {
            return 'Created: ' + createdDate.toLocaleString([], { timeStyle: 'short' })
         } else {
            return 'Created: ' + createdDate.toLocaleString([], { dateStyle: 'medium' })
         }
      } else {
         const lastModifiedDate = new Date(last_modified)
         if (todayDate == lastModifiedDate.getDate()) {
            return lastModifiedDate.toLocaleString([], { timeStyle: 'short' })
         } else {
            return lastModifiedDate.toLocaleString([], { dateStyle: 'medium' })
         }
      }

   }

   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.1,
      })

      if (!result.canceled) {
         const timestamp = Date.now()
         if (pathname == "/menuScreens/archive") {
            updateArchivedNote(id, { imgURL: result.assets[0].uri, last_modified: timestamp })
         } else {
            updateNote(id, { imgURL: result.assets[0].uri, last_modified: timestamp })
         }
         addImgToNote(result.assets[0].uri)
      }
   }

   const addImgToNote = async (uri) => {
      try {
         const timestamp = Date.now()
         await db.runAsync(`UPDATE notes SET
            imgURL = ?,
            last_modified = ?
            WHERE id = ${id}`,
            uri, timestamp
         )
      }
      catch (err) { console.log(err) }
   }

   return (
      <Pressable
         style={[
            styles.container,
            { backgroundColor: (checkmode && isSelected(item)) ? '#323C44' : 'transparent' }
         ]}
         unstable_pressDelay={75}
         android_ripple={{ color: '#7F8D98' }}
         onPress={onPress}
         onLongPress={onLongPress}
         disabled={isDisabled}
      >
         <View style={styles.itemContainer}>
            <TouchableOpacity
               onPress={(checkmode || pathname == "/menuScreens/recycleBin") ? null : () => pickImage()}
               activeOpacity={checkmode ? 1 : 0.3}
               disabled={isDisabled}
            >
               <Image
                  source={imgURL}
                  placeholder={imgURL ? null : require('../../assets/image_icon.png')}
                  style={[styles.itemImage, imageStyle]}
                  contentFit='contain'
                  recyclingKey={id}
               />
            </TouchableOpacity>
            <View style={styles.itemTextContainer}>
               <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode='tail'>
                  {title}
               </Text>
               <Text style={styles.itemDateModified}>{userTime()}</Text>
            </View>
         </View>
      </Pressable>
   )
}

export default memo(NoteItem)

const styles = StyleSheet.create({
   container: {
      backgroundColor: 'transparent',
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 9,
      borderBottomWidth: 0.2,
      borderColor: "darkgrey"
   },
   itemContainer: {
      flex: 1,
      flexDirection: 'row',
      height: 66,
      justifyContent: 'flex-start',
      alignItems: 'center',
   },
   itemImage: {
      height: 64,
      width: 64,
      marginRight: 15,
      borderRadius: 12,
      borderColor: 'grey',
   },
   itemTextContainer: {
      flex: 1,
      flexDirection: 'column',
   },
   itemTitle: {
      color: '#ebecf0',
      fontSize: 21,
      paddingBottom: 4,
      paddingRight: 15
   },
   itemDateModified: {
      color: 'grey',
      fontSize: 14,
      marginBottom: 4
   },
})