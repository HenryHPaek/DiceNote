export const
   themeProps = {
      toolbar: {
         toolbarBody: {
            borderTopColor: '#575757',
            borderBottomColor: '#575757',
            backgroundColor: '#0A1328',
            paddingLeft: 5
         },
         toolbarButton: {
            backgroundColor: '#0A1328',
         },
         icon: {
            backgroundColor: '#0A1328',
            tintColor: '#ebecf0',
         },
         iconActive: {
            backgroundColor: '#5E6B79',
            tintColor: '#ebecf0',
            borderRadius: 5,
         },
         iconDisabled: {
            tintColor: '#8A9DB2'
         },
         iconWrapper: {
            backgroundColor: 'trasparent',
         },
         iconWrapperActive: {
            backgroundColor: 'transparent'
         },
         iconWrapperDisabled: {
            backgroundColor: 'transparent'
         },
      },
      webview: {
         backgroundColor: '#14191F',
      },
      webviewContainer: {
         paddingLeft: 18,
         paddingRight: 18,
         marginTop: 2,
         paddingBottom: 2,
         backgroundColor: '#14191F',
      },
   },

   newStyle = `
      body {
         background-color: #14191F;
         color: white;
         caret-color: skyblue;
      }
      ::selection {
         background-color: skyblue;
         color: black;
      }
      ul[data-type="taskList"] {
         padding-left: 0;
         label {
            accent-color: #6B9FE4;
            float: left;
            margin-right: 0.5rem;
         }
      }
      a { color: cadetblue; }
      `