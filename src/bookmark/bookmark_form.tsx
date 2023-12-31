import { useState } from "react";
import { BookmarkController } from "./controllers/bookmark.controller";
import { categories } from "./controllers/constants";
import { BookmarkFormProps } from "./types/bookmark_form.types";
/**
 * BookmarkForm component
 * @param properties {BookmarkFormProps}
 * @returns {JSX.Element}
 */
export function BookmarkForm(properties: BookmarkFormProps): JSX.Element{
  
  const [cat, setCategory] = useState<string|undefined>(undefined);
  const [title, setTitle] = useState<string|undefined>(properties.chatgptResponse?.title || "");
  const [description, setDescription] = useState<string|undefined>(properties.chatgptResponse?.text || "");


  return <div>
    <h1>Create new bookmark</h1>
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" value={title} onChange={ handleInputChange } />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select name="category" id="category" onChange={handleSelectChange} value={cat}>
          {
            categories.map((category) => {
              return <option value={category}>{category}</option>
            })
          }
        </select>
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" value={description} onChange={handleTextAreaChange} />
      </div>
      <button type="submit" className="btn">Create</button>
    </form>
  </div>;

/**
 * Handle select change event
 * @param event {React.ChangeEvent<HTMLSelectElement>}
 * @returns void
 */
function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>): void {
  setCategory(event.target.value);
}
/**
 * handle text area change event
 * @param event {React.ChangeEvent<HTMLTextAreaElement>}
 */
function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
  setDescription(event.target.value);
}

/**
 * Handle input change event
 * @param event {React.ChangeEvent<HTMLInputElement>}
 * @returns void
 */
function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
  setTitle(event.target.value);
}

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
      category: cat ?? categories[0],
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