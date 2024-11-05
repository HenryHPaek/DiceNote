import { React, useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import { usePathname, router } from 'expo-router';
import { useSortStore } from '../../global/store';
import SortModal from './notesTab/sortModal';
import ChosenHistoryModal from './chooseTab/chosenHistoryModal';

const getTitle = () => {
   const pathname = usePathname()
   if (pathname == "/notes") return "Notes"
   else if (pathname == "/choose") return "Choose"
   else if (pathname == "/menu") return "Menu"
}

const getIcon = () => {
   const title = getTitle()
   if (title == "Notes") return "note"
   else if (title == "Categories") return "shape"
   else if (title == "Choose") return "dice-3"
   else if (title == "Menu") return "view-grid"
}

export default function TopBar({ setResetModalVisible, chosenHistory }) {
   const sortOption = useSortStore(state => state.sortOption)
   const sortIconNames = {
      'Title': 'sort-alphabetical-ascending',
      'Date Modified': 'sort-clock-ascending-outline',
      'Date Created': 'sort-calendar-ascending'
   }
   const [sortIcon, setSortIcon] = useState(sortIconNames[sortOption])
   const [sortVisible, setSortVisible] = useState(false)
   const [historyVisible, setHistoryVisible] = useState(false)

   const headerTitle = getTitle()
   const headerIcon = getIcon()

   useEffect(() => {
      setSortIcon(sortIconNames[sortOption])
   }, [sortOption])

   const openClear = () => {
      if (chosenHistory.length) setResetModalVisible(true)
   }

   const openHistory = () => {
      if (chosenHistory.length) setHistoryVisible(true)
   }

   return (
      <>
         <Appbar.Header
            style={{ backgroundColor: '#111B2E' }}
            dark={true}
         >
            <Appbar.Action
               icon={headerIcon}
               color='#ebecf0'
               rippleColor={'#7F8D98'}
               onPress={() => { }}
            />
            <Appbar.Content
               title={headerTitle}
               titleStyle={{ fontSize: 24, color: '#ebecf0', fontWeight: 'bold' }}
            />
            {headerTitle == "Notes" &&
               <>
                  <Appbar.Action
                     icon="magnify"
                     color='#ebecf0'
                     rippleColor={'#7F8D98'}
                     onPress={() => router.navigate('../search')} />
                  <Appbar.Action
                     icon={sortIcon}
                     color='#ebecf0'
                     rippleColor={'#7F8D98'}
                     onPress={() => { setSortVisible(true) }} />
               </>
            }
            {headerTitle == "Choose" &&
               <>
                  <Appbar.Action
                     icon="view-list-outline"
                     size={30}
                     color='#ebecf0'
                     rippleColor={'#7F8D98'}
                     onPress={openHistory} />
                  <Appbar.Action
                     icon="refresh"
                     color='#ebecf0'
                     rippleColor={'#7F8D98'}
                     onPress={openClear} />
                  {/* To be finished...................................................... */}
                  {/* <Appbar.Action
                     icon="dots-vertical"
                     color='#ebecf0'
                     rippleColor={'#7F8D98'}
                     onPress={() => console.log('menu pressed!')} /> */}
               </>
            }
         </Appbar.Header>
         <SortModal sortVisible={sortVisible} setSortVisible={setSortVisible} />
         <ChosenHistoryModal
            historyVisible={historyVisible}
            setHistoryVisible={setHistoryVisible}
            chosenHistory={chosenHistory}
            setResetModalVisible={setResetModalVisible}
         />
      </>
   )
}
