import { useEffect, useState } from "react";
import { BookmarkController } from "./controllers/bookmark.controller";
import { Bookmark } from "./models/bookmark.models";
import { BookmarkList } from "./bookmarks.list";
import { BookmarkCategories } from "./categories/bookmark_categories";

/**
 * This is the Bookmarks component, it will display a list of bookmarks
 * @param properties {BookmarkListProps} this is the properties for the Bookmarks component
 * @returns 
 */
export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string|undefined>(undefined);
  /// TODO: Implement this component
  useEffect(() => {
    BookmarkController.getAll().then((bookmarks) => {
      setBookmarks(bookmarks);
    });
  }, []);
  return <div className="bookmarks-container">
    <h1>Bookmarks</h1>
    <input type="text" placeholder="Search" value={search} onChange={onSearch} />
    <div>
      <BookmarkCategories onCategorySelected={onCategorySelected} />
      <BookmarkList bookmarks={getBookmarks()} onDeleted={onDeleted} />
    </div>
  </div>
  
  function onCategorySelected(category: string|undefined) {
    console.log(category);
    setCategory(category);
    setSearch(search);
  }

  /**
   * On deleted event
   * @param item {Bookmark}
   */
  function onDeleted(item: Bookmark){
    BookmarkController.delete(item).then((bookmarksResponse) => {
      setBookmarks(bookmarksResponse);
    });
  }
  function onSearch(event: React.ChangeEvent<HTMLInputElement>){
    setSearch(event.target.value);
  }
  function getBookmarks(): Bookmark[]{
    
    return bookmarks.filter((bookmark) => {
      /** search by title, description and category */
      const searchByTitle = bookmark.title.toLowerCase().includes(search.toLowerCase());
      const searchByDescription = bookmark.description.toLowerCase().includes(search.toLowerCase());
      const searchByCategory = bookmark.category.toLowerCase().includes(search.toLowerCase());
      /** search by category */
      if(category){
        return bookmark.category === category;
      }
      /** search by title, description and category */
      return searchByTitle || searchByDescription || searchByCategory;
      

    });
  }

}
export default Bookmarks;