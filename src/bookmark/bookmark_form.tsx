import { BookmarkController } from "./controllers/bookmark.controller";
import { categories } from "./controllers/constants";
import { BookmarkFormProps } from "./types/bookmark_form.types";

export function BookmarkForm(properties: BookmarkFormProps){

  return <div>
    <h1>Create new bookmark</h1>
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" value={properties.chatgptResponse?.title} />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select name="category" id="category">
          {
            categories.map((category) => {
              return <option value="{category}" key={category}>{category}</option>
            })
          }
        </select>
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" value={properties.chatgptResponse?.text} />
      </div>
      <button type="submit" className="btn">Create</button>
    </form>
  </div>;
  
  
/**
 * On submit event
 * @param event {React.FormEvent<HTMLFormElement>}
 */
function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
  event.preventDefault();
    // create bookmark
    BookmarkController.createBookmark({
      title: (event.target as any).title.value,
      description: (event.target as any).description.value,
      category: (event.target as any).category.value,
      id: generateId(),
      url: properties.chatgptResponse?.url || "empty",
    }).then((bookmark) => {
      if(properties.onClose){
        properties.onClose(bookmark);
      }
  });
}
/**
 * Generate a random id
 * @returns string
 */
function generateId(): string {
  return Math.random().toString(36).substring(2);
}
}