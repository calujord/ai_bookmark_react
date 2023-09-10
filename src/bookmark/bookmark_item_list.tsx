import { BookmarkItemProps } from "./types/bookmark_item.types";

export function BookmarkItemList(item: BookmarkItemProps){
  return <div>
    <h1>{item.bookmark.title}</h1>
    <p>{item.bookmark.description}</p>
    <p>{item.bookmark.category}</p>
    <p>{item.bookmark.url}</p>
  </div>

}