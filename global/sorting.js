export default function getSortedData(option, data) {
   switch (option) {
      case 'Title':
         return [...data].sort((a, b) => a.title > b.title ? 1 : -1)
      case 'Date Modified':
         return [...data].sort((a, b) => b.last_modified - a.last_modified)
      case 'Date Created':
         return [...data].sort((a, b) => a.date_created - b.date_created)
      default:
         return null
   }
}
