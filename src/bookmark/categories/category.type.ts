import { Bookmark } from "../models/bookmark.models";

/**
 * Category properties
 * @interface
 * @property {function} onCategorySelected - Event handler for when a category is selected
 * @property {function} onMoveDestination - Event handler for when a category is dropped
 */
export interface CategoryProperties {
  /**
   * Event handler for when a category is selected
   * @param category {string}
   * @returns {void}
   */
  onCategorySelected: (category?: string) => void;

  /**
   * Event handler for when a category is dropped
   * @param category {string}
   * @returns {void}
   */
  onMoveDestination: (category: string) => void;
}

export interface CategoryBoookmarkState {
  category?: string;
  bookmark?: Bookmark;
}

export interface CategoryItemProps {
  category: string;
  onMoveDestination: (category: string) => void;
  isSelected: boolean;
  onCategorySelected: (category: string) => void;
}
