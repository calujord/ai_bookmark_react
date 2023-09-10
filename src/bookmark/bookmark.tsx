import { useState } from "react";
import { BookmarkItemList } from "./bookmark_item_list";
import { BookmarkController } from "./controllers/bookmark.controller";
import { Bookmark } from "./models/bookmark.models";

/**
 * This is the Bookmarks component, it will display a list of bookmarks
 * @param properties {BookmarkListProps} this is the properties for the Bookmarks component
 * @returns 
 */
export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  /// TODO: Implement this component
  /**
   * 1. Get bookmarks from local storage
   * 2. Display bookmarks
   * 3. Add a button to delete bookmarks
   * 4. Add a button to edit bookmarks
   * 5. Add a button to add bookmarks
   */
  BookmarkController.getAll().then((bookmarks) => {
    setBookmarks(bookmarks);
  });
  if(bookmarks.length === 0){
    return <div>
      <h1>Bookmarks list</h1>
      <p>There are no bookmarks</p>
    </div>
  }
  return <div>
    <h1>Bookmarks list</h1>
    <p>There are {bookmarks.length} bookmarks</p>
    {bookmarks.map((bookmark) => {
      return <BookmarkItemList bookmark={bookmark} key={bookmark.id} />
    })}
  </div>
}
export default Bookmarks;