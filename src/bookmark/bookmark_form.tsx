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
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" value={properties.chatgptResponse?.text} />
      </div>
      <div>
        <label htmlFor="category">category</label>
        <select name="category" id="category">
          <option value="react">React</option>
          <option value="angular">Angular</option>
          <option value="vue">Vue</option>
        </select>
      </div>
      <button type="submit">Create</button>
    </form>;
  </div>;
  
  

function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
  event.preventDefault();
  if(properties.onClose){
    properties.onClose({
      title: (event.target as any).title.value,
      description: (event.target as any).description.value,
      category: (event.target as any).category.value,
      id: generateId(),
      url: properties.chatgptResponse?.url || "empty",
    });
  }
}
function generateId(): string {
  return Math.random().toString(36).substring(2);
}
}