import { BookmarkItemProps } from "./types/bookmark_item.types";

export function BookmarkItemList(item: BookmarkItemProps){
  return <div>
    <h2>{item.bookmark.title}</h2>
    <p>{item.bookmark.description.substring(0,155)}</p>
    <p>{item.bookmark.category}</p>
    <p>{item.bookmark.url}</p>
    <button className="btn" onClick={onDelete}>Delete</button>
    
  </div>
  function onDelete(){
    if(item.onDelete){
      item.onDelete(item.bookmark);
    }
  }

}