import { useState } from "react";
import { categories } from "../controllers/constants";
import { CategoryProperties } from "./category.type";

/**
 * @module BookmarkCategories
 * @description This is the BookmarkCategories component, it will display a list of bookmark categories
 * @returns {JSX.Element}
 */
export function BookmarkCategories(properties: CategoryProperties): JSX.Element {
  const [categorySelected, setCategorySelected] = useState<string|undefined>(undefined)
  return <div className="categories">
    <ul>
      <li 
      className={(categorySelected === null || categorySelected === undefined)?'selected':''}
      onClick={() => onCategorySelected(undefined)}
      >All</li>
      {
        categories.map((category) => {
          return <li
            key={category} 
            className={categorySelected === category ? 'selected' : ''}
            onClick={() => onCategorySelected(category)}
           >{category}</li>
        })
      }
      
    </ul>
  </div>

  function onCategorySelected(category: string|undefined){
    setCategorySelected(category);
    if(properties.onCategorySelected){
      properties.onCategorySelected(category);
    }
  }

}