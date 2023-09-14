import { FooterProperties } from "./types/footer.types"
import './css/footer.css'

export function FooterNavigator(props: FooterProperties): JSX.Element{
  return <div className="footer">
    <div className="row">
      <button className="btn" onClick={()=> props.onNavigationChange('bookmarks')}>
        Bookmarks
      </button>
      <button className="btn" onClick={()=> props.onNavigationChange('ask-website')}>
        Ask website
      </button>
      <button className="btn" onClick={()=> props.onNavigationChange('create-bookmark')}>
        Add bookmark
      </button>
    </div>
  </div>
}
export default FooterNavigator;