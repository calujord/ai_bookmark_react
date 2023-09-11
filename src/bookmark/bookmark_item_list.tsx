import { BookmarkItemProps } from "./types/bookmark_item.types";


export function BookmarkItemList(item: BookmarkItemProps){
  return <div className="item-row">
    <h2>{item.bookmark.title}</h2>
    <p className="category-label">{item.bookmark.category}</p>
    <p>{item.bookmark.description.substring(0,155)}</p>
    <a target="_blank" href={item.bookmark.url} rel="noreferrer" className="category-label">
      Open link
    </a>
    <br />
    <button className="btn btn-error mt-2" onClick={onDelete}>Delete</button>
    
  </div>
  function onDelete(){
    if(item.onDelete){
      item.onDelete(item.bookmark);
    }
  }

}