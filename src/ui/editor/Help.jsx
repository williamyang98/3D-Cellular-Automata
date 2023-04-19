let Help = ({ text }) => {
  return (
    <div style={{cursor:'help'}}>
      <span 
        className="help-icon"
        data-toggle="tooltip" data-html={true} 
        title={text}
      >
        <i className="fas fa-question-circle"></i>
      </span>
    </div>
  )
}

export { Help };