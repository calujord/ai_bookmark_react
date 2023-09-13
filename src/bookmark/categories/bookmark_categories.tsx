import { useState } from "react";
import { categories } from "../controllers/constants";
import { CategoryProperties } from "./category.type";
import { BookmarkCategoryItem } from "./bookmark_category_item";

/**
 * @module BookmarkCategories
 * @description This is the BookmarkCategories component, it will display a list of bookmark categories
 * @returns {JSX.Element}
 */
export function BookmarkCategories(properties: CategoryProperties): JSX.Element {
  /**
   * @constant categorySelected {string|undefined}
   * @description This is the category selected
   * @default undefined
   */
  const [categorySelected, setCategorySelected] = useState<string|undefined>(undefined)

  return <div className="categories">
    <ul>
      <li 
      className={(categorySelected === null || categorySelected === undefined)?'selected':''}
      onClick={() => onCategorySelected(undefined)}
      >All</li>
      {
        categories.map((category) => {
          return <BookmarkCategoryItem
            category={category}
            isSelected={categorySelected === category}
            onCategorySelected={onCategorySelected}
            onMoveDestination={properties.onMoveDestination}
            key={category}
          />
        })
      }
      
    </ul>
  </div>
  
  /**
   * Event on select category
   * @param category {string|undefined}
   * @returns void
   */
  function onCategorySelected(category: string|undefined){
    setCategorySelected(category);
    if(properties.onCategorySelected){
      properties.onCategorySelected(category);
    }
  }

}