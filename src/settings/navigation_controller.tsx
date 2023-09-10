import { GrAddCircle } from "react-icons/gr";
import Bookmarks from "../bookmark/bookmark";
import CreateBookmark from "../bookmark/bookmark_create";
import { useState } from "react";
/**
 * NavigationController
 * This component is responsible for displaying the application navigation, which can be: BOOKMARKS or CREATE-BOOKMARK
 * This element will manage the information regarding the bookmark list and the creation of new bookmarks
 * @returns TSX Element
 */
export function NavigationController(){
  // This element makes state changes corresponding to navigation
  const [navigation, setNavigation] = useState<string>('bookmarks'); 
  if (navigation === "bookmarks") {
    return <div className="bookmarks-list">
      <Bookmarks />
      <button id="add-button" onClick={() => onNavigationChange('create-bookmark')}>
        <GrAddCircle size={50} color='#b0b0b0' title='Add Bookmark' />
      </button>
    </div>
  }
  else{
    return <CreateBookmark />
  }

  /**
   * This event allows you to change the navigation according to the state in which it is in the application
   * 
   * @param navigation 
   */
  function onNavigationChange(navigation: string): void {
    setNavigation(navigation);
  }


}
export default NavigationController;