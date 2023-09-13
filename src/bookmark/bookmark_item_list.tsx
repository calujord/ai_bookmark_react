import { useState } from "react";
import { BookmarkItemProps } from "./types/bookmark_item.types";


export function BookmarkItemList(item: BookmarkItemProps){
  const [showMoreDetails, setShowMoreDetails] = useState<boolean>(false);

  return <div className={showMoreDetails ? 'activate item-row' : 'item-row'}>
    <h4 className="item-row-title" onClick={onShowMoreDetails}>{item.bookmark.title}</h4>
    <div className={getClassName()}>
      <p className="category-label">{item.bookmark.category}</p>
      <p>{item.bookmark.description}</p>
      <a target="_blank" href={item.bookmark.url} rel="noreferrer" className="category-label">
        Open link
      </a>
      <br />
      <button className="btn btn-error mt-2" onClick={onDelete}>Delete</button>
    </div>
    
    
  </div>
  function getClassName(){
    if(!showMoreDetails){
      return 'more-details-hidden';
    }
    return 'more-details-show';
  }

  function onShowMoreDetails(){
    setShowMoreDetails(!showMoreDetails);
  }
  function onDelete(){
    if(item.onDelete){
      item.onDelete(item.bookmark);
    }
  }

}