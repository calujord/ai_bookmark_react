import { useState } from "react";
import { BookmarkItemProps } from "./types/bookmark_item.types";

/**
 * Render bookmark item list
 * @param item {BookmarkItemProps}
 * @returns {JSX.Element}
 */
export function BookmarkItemList(item: BookmarkItemProps): JSX.Element{
  const [showMoreDetails, setShowMoreDetails] = useState<boolean>(false);

  return <div 
    draggable={true}
    key={item.bookmark.id}
    className={showMoreDetails ? 'activate item-row' : 'item-row'}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    >
    <h4 className="item-row-title truncate" onClick={onShowMoreDetails}>{item.bookmark.title}</h4>
    <div className="info">
      <label className="category-label">{item.bookmark.category}</label>
      <label className="category-label">{getOnlyUrl()}</label>
    </div>
    <div className={getClassName()}>
      
      <p>{item.bookmark.description}</p>
      <a target="_blank" href={item.bookmark.url} rel="noreferrer" className="category-label">
        Open link
      </a>
      <br />
      <button className="btn btn-error mt-2" onClick={onDelete}>Delete</button>
    </div>
  </div>

  /**
   * Get only url website without protocol
   */
  function getOnlyUrl(): string{
    const url = item.bookmark.url;
    const urlObject = new URL(url);
    return urlObject.hostname;
  }

  /**
   * Handle drag start event
   * @param event {React.DragEvent<HTMLDivElement>}
   * @returns void
   */
  function handleDragStart(event: React.DragEvent<HTMLDivElement>): void{
    item.onMoveOrigin(item.bookmark);
  }
  /**
   * Handle drag end event
   * @param event {React.DragEvent<HTMLDivElement>}
   * @returns void
   */
  function handleDragEnd(event: React.DragEvent<HTMLDivElement>): void{
    item.onMoveOrigin(undefined);
  }
  /**
   * Get class name for more details
   * @returns {string}
   */
  function getClassName(): string{
    if(!showMoreDetails){
      return 'more-details-hidden';
    }
    return 'more-details-show';
  }
  /**
   * Show more details
   * @returns void
   */
  function onShowMoreDetails(): void{
    setShowMoreDetails(!showMoreDetails);
  }

  /**
   * Delete bookmark from de list of bookmarks
   * @returns void
   */
  function onDelete(): void{
    if(item.onDelete){
      item.onDelete(item.bookmark);
    }
  }

}