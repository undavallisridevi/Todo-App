import React, { useState } from "react";
import axios from 'axios'
import './style.css'
const Modal = ({
    setVisibility,
    visibility,
    id,
    task,
    getalltasks,
    flag,
    setFlag
   
  }) => {
    const [usertask,setTask]=useState(task)
    const handleHide = (e) => {
      setVisibility(!visibility);
    };
    
function handlechange(event)
{
setTask(prev=>prev= event.target.value)

}
function handlesubmit()
{
    let data={
        task:usertask,
        id:id
    }
    axios.post("http://localhost:3020/edit", data, {
        headers: { "Content-Type": "application/json" }
      }).then(getalltasks )
      .then(()=>
      {setFlag(!flag);
        setVisibility(!visibility)})
}
console.log(usertask);
    return (
      <div className="more-details">
        <span className="close-button">
          <i className="fa-regular fa-circle-xmark" onClick={handleHide}></i>
        </span>
       <label>Edit Task</label>
    <input type="text" name="task" value={usertask} onChange={handlechange}/>
 <button style={{color:'blue'}} onClick={handlesubmit}>Save</button>
      </div>
    );
  };
export default Modal