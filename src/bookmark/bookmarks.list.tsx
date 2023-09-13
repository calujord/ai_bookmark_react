import { GrList } from "react-icons/gr";
import { BookmarkItemList } from "./bookmark_item_list";
import { BookmarkSearch } from "./types/bookmark_search.types";
/***
 * BookmarkList
 * This component is responsible for displaying the list of bookmarks
 * @param properties {BookmarkSearch}
 * @returns {JSX.Element}
 */
export function BookmarkList(properties: BookmarkSearch): JSX.Element {
  if(properties.bookmarks.length === 0){
    return <div className="no-found-list">
      <GrList size={32} color='#b0b0b0' title='No bookmarks found' />
      <p>There are no bookmarks</p>
    </div>
  }
  return <div className="bookmarks-list">
    { properties.bookmarks.map((bookmark) => {
        return <BookmarkItemList bookmark={bookmark} key={bookmark.id} onDelete={properties.onDeleted} />
      }) 
    }
  </div>
}
export default BookmarkList;