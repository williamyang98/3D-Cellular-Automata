import { Help } from './Help';

// This is relative to bootstraps grid which has 12 columns
const DEFAULT_WIDTH = 6;
const MAX_WIDTH = 12;

// NOTE: We use a shared layout so changes only need to be here
let Editor_Layout = ({ label, help_text, children, width }) => {
  width = (width !== undefined) ? width : DEFAULT_WIDTH;
  width = Math.floor(width);
  width = Math.max(width, 1);
  width = Math.min(width, MAX_WIDTH);

  return (
    <div className="row">
      <div className={`col-${width.toFixed(0)}`}>
        <div>
          <label>{label}</label>
          {
            help_text && 
            <Help text={help_text}></Help>
          }
        </div>
      </div>
      <div className={`col`}>
        <div className="d-flex justify-content-end">
          {children}
        </div>
      </div>
    </div>
  )
}

export { Editor_Layout };