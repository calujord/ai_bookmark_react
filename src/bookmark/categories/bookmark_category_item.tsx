import { CategoryItemProps } from "./category.type";

/**
 * BookmarkCategoryItem
 * @packageDocumentation
 * @module BookmarkCategoryItem
 * @description This is the BookmarkCategoryItem component, it will display a bookmark category item
 * 
 */
export function BookmarkCategoryItem(properties: CategoryItemProps): JSX.Element {
  return <li
    id={properties.category} 
    /// onDragLeaveCapture={onMoveDestination}
    onDropCapture={onMoveDestination}
    onDragOver={(event) => event.preventDefault()}
    className={`${properties.isSelected ? 'selected' : ''}`}
    onClick={() => properties.onCategorySelected(properties.category)}
  >{properties.category}</li>


  /**
   * Handle drag leave event
   * @param event {React.DragEvent<HTMLLIElement>}
   * @returns void
   */
  function onMoveDestination(event: React.DragEvent<HTMLLIElement>){
    event.preventDefault();
    properties.onMoveDestination(event.currentTarget.id);
  }

}