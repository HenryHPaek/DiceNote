import React, { useState, useEffect } from 'react'
import { StyleSheet, SafeAreaView, BackHandler, AppState } from 'react-native'
import { Redirect } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuthStore } from '../global/store';

export default function index() {
   const [isAuthenticated, setIsAuthenticated] = useState(false)
   const isAuthEnabled = useAuthStore(state => state.isAuthEnabled)

   useEffect(() => {
      const authenticate = async () => {
         if (isAuthEnabled) {
            const result = await LocalAuthentication.authenticateAsync({
               promptMessage: 'Authenticate to access notes',
               cancelLabel: 'Cancel',
               disableDeviceFallback: true
            })

            if (!result.success) {
               BackHandler.exitApp()
            } else {
               setIsAuthenticated(result.success)
            }
         } else {
            setIsAuthenticated(true)
         }
      }

      authenticate()
   }, [])

   if (!isAuthenticated) {
      return (
         <SafeAreaView
            edges={['left', 'right']}
            style={{ flex: 1, backgroundColor: '#08101B' }}
         ></SafeAreaView>
      )
   }

   return (
      <Redirect href="/notes" />
   )
}

const styles = StyleSheet.create({})