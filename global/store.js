import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const
   useNoteStore = create((set) => ({
      notesData: [],
      setNotes: (data) => set({ notesData: [...data] }),
      addNote: (newNote) => set((state) => ({ notesData: [...state.notesData, newNote] })),
      updateNote: (id, newProps) => set((state) => ({
         notesData: state.notesData.map((item) => (item.id == id ? { ...item, ...newProps } : item))
      })),
      deleteNotes: (ids) => set((state) => ({
         notesData: state.notesData.filter(item => !ids.includes(item.id))
      })),

      archivedData: [],
      setArchive: (data) => set({ archivedData: [...data] }),
      updateArchivedNote: (id, newProps) => set((state) => ({
         archivedData: state.archivedData.map((item) => (item.id == id ? { ...item, ...newProps } : item))
      })),
      deleteArchivedNotes: (ids) => set((state) => ({
         archivedData: state.archivedData.filter(item => !ids.includes(item.id))
      })),

      recycledData: [],
      setRecycleBin: (data) => set({ recycledData: [...data] }),
      updateRecycledNote: (id, newProps) => set((state) => ({
         recycledData: state.recycledData.map((item) => (item.id == id ? { ...item, ...newProps } : item))
      })),
      deleteRecycledNotes: (ids) => set((state) => ({
         recycledData: state.recycledData.filter(item => !ids.includes(item.id))
      })),
      emptyRecycleBin: () => set({ recycledData: [] }),
   })),

   useCheckmodeStore = create((set, get) => ({
      checkmode: false,
      toggleCheckmode: () => set((state) => ({ checkmode: !state.checkmode })),

      selectedItems: [],
      selectItem: (itemID) => set((state) => ({
         selectedItems: state.selectedItems.includes(itemID) ?
            state.selectedItems.filter(id => id !== itemID)
            : [...state.selectedItems, itemID]
      })),
      isSelected: (item) => get().selectedItems.includes(item.id),
      selectAll: (data) => set({ selectedItems: data.map(item => item.id) }),
      deselectAll: () => set({ selectedItems: [] })
   })),

   useAuthStore = create(persist(
      (set) => ({
         isAuthEnabled: false,
         toggleAuth: () => set((state) => ({ isAuthEnabled: !state.isAuthEnabled }))
      }),
      {
         name: 'auth',
         storage: createJSONStorage(() => AsyncStorage),
      }
   )),

   useSortStore = create(persist(
      (set) => ({
         sortOption: 'Date Modified',
         setSortOption: (option) => set({ sortOption: option })
      }),
      {
         name: 'sort',
         storage: createJSONStorage(() => AsyncStorage),
      }
   ))

// To be finished......................................................
// useCategoryStore = create(persist(
//    (set) => ({
//       categoryData: [],
//       setCategories: (data) => set({ categoryData: [...data] }),
//       addCategory: (newCategory) => set((state) => ({ categoryData: [...state.categoryData, newCategory] })),
//       updateCategory: (index, newCategory) => set((state) => ({
//          categoryData: state.categoryData.map((item, i) => (i == index ? newCategory : item))
//       })),
//       deleteCategory: (category) => set((state) => ({
//          categoryData: state.categoryData.filter(item => item != category)
//       }))
//    }),
//    {
//       name: 'category',
//       storage: createJSONStorage(() => AsyncStorage),
//    }
// ))