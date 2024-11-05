import { StyleSheet, View } from 'react-native'
import { useState } from 'react';
import { Icon } from 'react-native-paper';
import { BaseButton } from 'react-native-gesture-handler';
import { usePathname, router } from 'expo-router';

export default function Fab({ setChosenItem, dataFiltered, setFabModalVisible }) {
   const path = usePathname()
   const currFabIcon = path == "/choose" ? 'dice-3' : 'note-plus-outline'
   const [fabIcon, setFabIcon] = useState(currFabIcon)

   const handleChooseFab = () => {
      if (dataFiltered.length) {
         const currDice = fabIcon.at(-1)
         var rand = Math.floor(Math.random() * 6) + 1
         while (currDice == rand)
            rand = Math.floor(Math.random() * 6) + 1
         setFabIcon(`dice-${rand}`)

         rand = Math.floor(Math.random() * dataFiltered.length)
         setChosenItem(dataFiltered[rand])
         setFabModalVisible(true)
      }
   }

   return (
      <BaseButton
         style={styles.fab}
         rippleColor={'#8398B6'}
         onPress={path == "/notes" ?
            () => router.navigate({
               pathname: '../[id]',
               params: { id: -2, imgURL: null }
            })
            : () => handleChooseFab()
         }>
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => { e.stopPropagation() }}>
            <Icon
               source={path == "/notes" ? 'note-plus-outline' : fabIcon}
               color={'skyblue'}
               size={27}
            />
         </View>
      </BaseButton>
   )
}

const styles = StyleSheet.create({
   fab: {
      backgroundColor: '#303940',
      borderWidth: 0,
      borderColor: '#5F819B',
      width: 60,
      height: 60,
      position: 'absolute',
      bottom: 24,
      right: 24,
      borderRadius: 100,
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 10,
      elevation: 3,
   },
})