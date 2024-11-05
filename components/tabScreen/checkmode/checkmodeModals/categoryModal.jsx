import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

export default function CategoryModal({ categVisible, setCategVisible }) {
   return (
      <Portal>
         <Modal
            visible={categVisible}
            onDismiss={() => setCategVisible(false)}
            contentContainerStyle={styles.categModalView}
         >
            <View style={styles.categModalContent}>
               <FlashList
               // data={notesData}
               // renderItem={renderItem}
               // keyExtractor={keyExtractor}
               // estimatedItemSize={ITEM_HEIGHT}
               />
            </View>
         </Modal>
      </Portal>
   )
}

const styles = StyleSheet.create({
   categModalView: {
      margin: 20,
      backgroundColor: '#1B2129',
      borderRadius: 20,
      position: 'absolute',
      top: 150,
      bottom: 150,
      left: 30,
      right: 30,
      alignItems: 'center',
      justifyContent: 'center'
   },
   categModalContent: {
      // justifyContent: 'center',
      // alignItems: 'center',
      backgroundColor: '#C5D2E9',
      padding: 10,
   },
})