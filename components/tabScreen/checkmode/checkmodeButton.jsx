import { StyleSheet, View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCheckmodeStore } from '../../../global/store';

const CheckmodeButton = ({ icon, name, onPress }) => {
   const { selectedItems } = useCheckmodeStore()

   if (name == 'Rename') return (
      <>
         {selectedItems.length == 1 ? (
            <RectButton rippleColor={'#70819F'} onPress={onPress} style={styles.buttonContainer}>
               <View accessible accessibilityRole="button" style={styles.button}>
                  <MaterialCommunityIcons
                     name={icon}
                     color={'#ADB2BC'}
                     size={33}
                  />
                  <Text style={styles.buttonNameActive}>{name}</Text>
               </View>
            </RectButton>
         ) : (
            <View style={styles.buttonContainer}>
               <View style={styles.button}>
                  <MaterialCommunityIcons
                     name={icon}
                     color={'#424A58'}
                     size={33}
                  />
                  <Text style={styles.buttonNameInactive}>{name}</Text>
               </View>
            </View>
         )}
      </>
   )

   return (
      <>
         {1 <= selectedItems.length ? (
            <RectButton rippleColor={'#70819F'} onPress={onPress} style={styles.buttonContainer}>
               <View accessible accessibilityRole="button" style={styles.button}>
                  <MaterialCommunityIcons
                     name={icon}
                     color={'#ADB2BC'}
                     size={33}
                  />
                  <Text style={styles.buttonNameActive}>{name}</Text>
               </View>
            </RectButton>
         ) : (
            <View style={styles.buttonContainer}>
               <View style={styles.button}>
                  <MaterialCommunityIcons
                     name={icon}
                     color={'#424A58'}
                     size={33}
                  />
                  <Text style={styles.buttonNameInactive}>{name}</Text>
               </View>
            </View>
         )}
      </>
   )
}

export default CheckmodeButton

const styles = StyleSheet.create({
   buttonContainer: {
      flex: 1,
      paddingTop: 6
   },
   button: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
   },
   buttonNameActive: {
      paddingBottom: 6,
      fontSize: 13,
      color: '#ADB2BC',
   },
   buttonNameInactive: {
      paddingBottom: 6,
      fontSize: 13,
      color: '#424A58',
   },
});