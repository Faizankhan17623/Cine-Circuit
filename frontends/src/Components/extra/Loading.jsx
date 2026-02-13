import React from 'react'

const Loading = ({data}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`loader ${data}`}></div>
    </div>
  )
}

export default Loading
