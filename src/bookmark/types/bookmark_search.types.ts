import { Bookmark } from "../models/bookmark.models";
/**
 * BookmarkSearch
 * @interface
 * @property {Bookmark[]} bookmarks - List of bookmarks
 * @property {string} search - Search string
 * @property {function} onDeleted - Callback function when a bookmark is deleted
 *
 */
export interface BookmarkSearch {
  bookmarks: Bookmark[];
  search?: string;
  onDeleted: (item: Bookmark) => void;
}
