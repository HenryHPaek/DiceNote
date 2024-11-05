import { React, useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { useCheckmodeStore } from '../../../global/store';

export default function CheckmodeTopBar({ data }) {
   const [selectedAll, setSelectedAll] = useState(false)
   const { selectedItems, selectAll, deselectAll } = useCheckmodeStore()

   useEffect(() => {
      if (data.length == selectedItems.length) {
         setSelectedAll(true)
      }
      else {
         setSelectedAll(false)
      }
   }, [selectedItems])

   const handleSelectAll = () => {
      if (selectedAll) deselectAll()
      else selectAll(data)
   }

   return (
      <Appbar.Header
         style={{ backgroundColor: '#161F2E' }}
         dark={true}
      >
         <View style={styles.mainContainer}>
            <CheckBox
               containerStyle={{ backgroundColor: 'transparent', padding: 4 }}
               checked={selectedAll}
               title={'Select All'}
               textStyle={{ color: '#ebecf0', fontSize: 16 }}
               onPress={handleSelectAll}
               iconType="material-community"
               checkedIcon="radiobox-marked"
               uncheckedIcon="radiobox-blank"
            />
            <Text style={styles.text}>
               {`${selectedItems.length}/${data.length} selected`}
            </Text>
         </View>
      </Appbar.Header>
   )
}

const styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   textOneWrapper: {
      justifyContent: 'flex-start',
      backgroundColor: 'blue',
      color: 'transparent',
      paddingBottom: 2,
      width: 75
   },
   text: {
      justifyContent: 'flex-end',
      color: '#ABC6F5',
      fontSize: 17,
      fontWeight: '500',
      marginRight: 20,
      paddingBottom: 2
   },
})