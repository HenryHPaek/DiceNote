import { Stack } from 'expo-router/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
   async function initDB() {
      try {
         const db = await SQLite.openDatabaseAsync('diceNote.db')

         {/*
            checks if data from previous version exists.
            if exists, delete it.
         */}
         const isDataCleared = await AsyncStorage.getItem('dataCleared')
         if (!isDataCleared) {
            await db.runAsync(`DROP TABLE IF EXISTS notes;`)
            await AsyncStorage.setItem('dataCleared', '1')
         }
         await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS notes (
               id INTEGER PRIMARY KEY NOT NULL,
               imgURL TEXT,
               title TEXT NOT NULL,
               content TEXT,
               date_created INTEGER,
               last_modified INTEGER,
               category TEXT,
               status INTEGER DEFAULT 1
            );
            `
            // 0: trash, 1: active, 2: archived
         )
      }
      catch (err) {
         console.log(err)
      }
   }

   return (
      <GestureHandlerRootView>
         <SQLiteProvider databaseName='diceNote.db' onInit={initDB}>
            <PaperProvider>
               <SafeAreaProvider>
                  <Stack screenOptions={{ animation: 'fade_from_bottom' }}>
                     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                     <Stack.Screen name="index" options={{ headerShown: false }} />
                     <Stack.Screen name="[id]" options={{ headerShown: false }} />
                     <Stack.Screen name="search" options={{ headerShown: false }} />
                     <Stack.Screen name="menuScreens/archive" options={{ headerShown: false }} />
                     <Stack.Screen name="menuScreens/recycleBin" options={{ headerShown: false }} />
                  </Stack>
               </SafeAreaProvider>
            </PaperProvider>
         </SQLiteProvider>
      </GestureHandlerRootView>
   )
}
