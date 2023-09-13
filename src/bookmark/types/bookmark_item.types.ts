import { Bookmark } from "../models/bookmark.models";

export interface BookmarkItemProps {
  /**
   * bookmark to be displayed
   * @type {Bookmark}
   * @memberof BookmarkItemProps
   */
  bookmark: Bookmark;

  /**
   * this function will be called when the bookmark is deleted
   * @memberof BookmarkItemProps
   */
  onDelete?: (item: Bookmark) => void;

  onMoveOrigin: (item?: Bookmark) => void;
}
