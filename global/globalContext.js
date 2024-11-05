import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {
   const [checkmode, setCheckMode] = useState(false)

   const toggleCheckMode = () => {
      setCheckMode(!checkmode)
   }

   return (
      <GlobalContext.Provider value={{ checkmode, toggleCheckMode }}>
         {children}
      </GlobalContext.Provider>
   )
}

export const useGlobalContext = () => useContext(GlobalContext)

export default GlobalProvider