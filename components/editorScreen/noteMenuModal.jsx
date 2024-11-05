import { StyleSheet, Text, View } from 'react-native';
import Modal from "react-native-modal";
import { RectButton } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

export default function NoteMenuModal({ isMenuVisible, setIsMenuVisible }) {

   const MenuButton = ({ name, icon, myfunc }) => {
      const MenuButtonWithHOC = gestureHandlerRootHOC(() => (
         <RectButton rippleColor={'#70819F'} onPress={myfunc} style={styles.menuButtonContainer}>
            <View accessible accessibilityRole="button" style={styles.menuButton}>
               <MaterialCommunityIcons
                  name={icon}
                  color={'#C9CEDA'}
                  size={25}
               />
               <Text style={styles.buttonName}>{name}</Text>
            </View>
         </RectButton>
      ))
      return (
         <MenuButtonWithHOC />
      )
   }

   const offMenu = () => {
      setIsMenuVisible(false)
   }

   return (
      <Modal
         isVisible={isMenuVisible}
         animationIn={'fadeIn'}
         animationOut={'fadeOut'}
         animationInTiming={20}
         animationOutTiming={20}
         backdropTransitionInTiming={20}
         backdropTransitionOutTiming={20}
         backdropOpacity={0}
         onBackButtonPress={() => setIsMenuVisible(false)}
         onBackdropPress={() => setIsMenuVisible(false)}
      >
         <View style={styles.noteMenuModalView}>
            <MenuButton name={'Set Category'} icon={'shape'} myfunc={offMenu} />
            <MenuButton name={'Edit Link'} icon={'link'} myfunc={offMenu} />
            <MenuButton name={'Archive'} icon={'archive'} myfunc={offMenu} />
            <MenuButton name={'Delete'} icon={'delete'} myfunc={offMenu} />
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   noteMenuModalView: {
      flexDirection: 'column',
      backgroundColor: '#1B2129',
      position: 'absolute',
      top: 33,
      right: -3,
      width: 200,
      height: 240,
   },
   menuButtonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      width: '100%',
      paddingLeft: 5,
   },
   menuButton: {
      flex: 1,
      flexDirection: 'row',
      paddingLeft: 10,
      justifyContent: 'flex-start',
      alignItems: 'center',
   },
   buttonName: {
      paddingLeft: 10,
      fontSize: 18,
      color: '#C9CEDA',
   },
});