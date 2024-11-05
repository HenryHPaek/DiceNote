import { React } from 'react';
import { Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import { usePathname, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useNoteStore } from '../../../global/store';

const getTitle = () => {
   const pathname = usePathname()
   if (pathname == "/menuScreens/archive") return "Archive"
   else if (pathname == "/menuScreens/recycleBin") return "Recycle Bin"
}

export default function MenuTopBar({ isLoading }) {
   const headerTitle = getTitle()
   const recycledData = useNoteStore(state => state.recycledData)
   const emptyRecycleBin = useNoteStore(state => state.emptyRecycleBin)
   const db = useSQLiteContext()

   const handleEmpty = async () => {
      if (recycledData.length) {
         Alert.alert(
            'Deleting item(s)',
            'Are you sure you want to delete all items here permanently?',
            [
               {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
               },
               {
                  text: 'OK', onPress: async () => {
                     try {
                        const trashIDs = recycledData.map(item => item.id)
                        await db.runAsync(`DELETE FROM notes WHERE id IN (${trashIDs.join()})`)
                           .then(() => emptyRecycleBin())
                     }
                     catch (err) { console.log(err) }
                  }
               },
            ]
         )
      }
   }

   if (isLoading) return (
      <Appbar.Header
         style={{ backgroundColor: '#111B2E' }}
         dark={true}
      ></Appbar.Header>
   )

   return (
      <>
         <Appbar.Header
            style={{ backgroundColor: '#111B2E' }}
            dark={true}
         >
            <Appbar.BackAction
               color='#fff'
               rippleColor={'#7F8D98'}
               onPress={() => router.back()}
            />
            <Appbar.Content
               title={headerTitle}
               titleStyle={{ fontSize: 24, color: '#ebecf0', fontWeight: 'bold' }}
            />
            {headerTitle == "Recycle Bin" &&
               <Appbar.Action
                  icon="delete-forever"
                  size={30}
                  color='#ebecf0'
                  rippleColor={'#7F8D98'}
                  onPress={handleEmpty} />
            }
         </Appbar.Header>
      </>
   )
}
