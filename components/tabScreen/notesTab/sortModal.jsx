import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useNoteStore, useSortStore } from '../../../global/store';
import { RectButton } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import getSortedData from '../../../global/sorting';

export default function SortModal({ sortVisible, setSortVisible }) {
   const sortOption = useSortStore(state => state.sortOption)
   const setSortOption = useSortStore(state => state.setSortOption)
   const notesData = useNoteStore(state => state.notesData)
   const setNotes = useNoteStore(state => state.setNotes)
   const [checked, setChecked] = useState(sortOption)

   const handleSort = (option) => {
      setChecked(option)
      setSortOption(option)
      if (notesData.length > 1) {
         const sortedData = getSortedData(option, notesData)
         setNotes(sortedData)
      }
      setSortVisible(false)
   }

   const SortOptionButton = ({ option }) => {
      return (
         <RectButton
            onPress={() => handleSort(option)}
            rippleColor={'#7F8E9A'}
            style={styles.buttonContainer}
         >
            <RadioButton
               value={option}
               status={checked == option ? 'checked' : 'unchecked'}
            />
            <Text style={styles.text}>{option}</Text>
         </RectButton>
      )
   }

   return (
      <Portal>
         <Modal
            visible={sortVisible}
            onDismiss={() => setSortVisible(false)}
            contentContainerStyle={styles.sortModalView}
         >
            <SortOptionButton option={'Title'} />
            <SortOptionButton option={'Date Created'} />
            <SortOptionButton option={'Date Modified'} />
         </Modal>
      </Portal>
   )
}

const styles = StyleSheet.create({
   sortModalView: {
      flex: 1,
      alignSelf: 'center',
      flexDirection: 'column',
      backgroundColor: '#1B2129',
      borderRadius: 20,
      width: '100%',
      maxWidth: 320,
      maxHeight: 200,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: 10,
      paddingBottom: 10,
      overflow: 'hidden'
   },
   buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 20
   },
   text: {
      color: '#E3E9F6',
      fontSize: 18,
      fontWeight: '400',
      paddingLeft: 15,
      marginBottom: 1
   },
   separator: {
      alignSelf: 'center',
      borderWidth: 0.3,
      borderColor: '#828BA1',
      width: '93%',
      margin: 10
   },
})