let Help = ({ text }) => {
  return (
    <span 
      className="help-icon" style={{cursor:'help'}}
      data-toggle="tooltip" data-placement="left" data-html={true} 
      title={text}
    >
      <i className="fas fa-question-circle"></i>
    </span>
  )
}

export { Help };