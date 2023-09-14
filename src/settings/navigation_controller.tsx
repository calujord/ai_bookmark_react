import Bookmarks from "../bookmark/bookmark";
import CreateBookmark from "../bookmark/bookmark_create";
import { useState } from "react";
import { Bookmark } from "../bookmark/models/bookmark.models";
import FooterNavigator from "./footer/footer_navigator";
import { AskWebsite } from "../ask_website/ask_website";
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
    return <div className="navigators">
      <Bookmarks />
      <FooterNavigator onNavigationChange={onNavigationChange} />
    </div>
  }
  else if (navigation === "ask-website") {
    return <div className="navigators">
      <AskWebsite />
      <FooterNavigator onNavigationChange={onNavigationChange} />
    </div>
  }
  else{
    return <CreateBookmark onClose={onClose} />
  }

  /**
   * This event allows you to change the navigation according to the state in which it is in the application
   * @param navigation 
   */
  function onNavigationChange(navigation: string): void {
    setNavigation(navigation);
  }
  /**
   * Event that allows you to close the creation of a new bookmark
   * @param bookmark {Bookmark}
   */
  function onClose(bookmark: Bookmark): void {
    setNavigation('bookmarks');
  }

}
export default NavigationController;