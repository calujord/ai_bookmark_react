import { Bookmark } from "../models/bookmark.models";

export const BookmarkController = {
  async createBookmark(bookmark: Bookmark) {
    return BookmarkService.createBookmark(bookmark);
  },
  /**
   * Get all bookmarks registered in the database
   * @returns {Promise<Bookmark[]>}
   */
  async getAll(): Promise<Bookmark[]> {
    return BookmarkService.getAll();
  },
};

/**
 * This service is responsible for the business logic of the bookmark
 * @returns {Promise<Bookmark[]>}
 */
export const BookmarkService = {
  /**
   * Create in the database a new bookmark
   * @param bookmark {Bookmark} - bookmark to be created
   * @returns {Promise<Bookmark>}
   */
  async createBookmark(bookmark: Bookmark): Promise<Bookmark> {
    return this.getAll().then((bookmarks) => {
      chrome.storage.sync.set({ xBookMarks: [...bookmarks, bookmark] });
      return bookmark;
    });
  },
  /**
   * Get all bookmarks registered in the database
   * @returns {Promise<Bookmark[]>}
   */
  async getAll(): Promise<Bookmark[]> {
    return new Promise((resolve, _) => {
      chrome.storage.sync.get({ xBookMarks: [] }, (result) => {
        return resolve(result.xBookMarks);
      });
    });
  },
  /**
   * Delete a bookmark from the database
   * @param bookmark {Bookmark} - bookmark to be deleted
   * @returns {Promise<Bookmark[]>}
   * @memberof BookmarkService
   */
  async delete(bookmark: Bookmark): Promise<Bookmark[]> {
    return this.getAll().then((bookmarks) => {
      const newBookmarks = bookmarks.filter((item) => item.id !== bookmark.id);
      chrome.storage.sync.set({ xBookMarks: newBookmarks });
      return newBookmarks;
    });
  },
};
