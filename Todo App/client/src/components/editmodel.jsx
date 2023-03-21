
import React, { useEffect, useState } from "react";
import axios from 'axios'
import './style.css'
import { Button } from "semantic-ui-react";
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
    useEffect(() => {
      function handleClickOutside(event) {
          if (event.target.closest('.more-details') === null) {
              setVisibility(false);
          }
      }

      window.addEventListener('mousedown', handleClickOutside);
      return () => {
          window.removeEventListener('mousedown', handleClickOutside);
      };
  }, [setVisibility]);
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

    return (
      <div className="more-details">
        <span className="close-button">
          <i className="fa-regular fa-circle-xmark" onClick={handleHide}></i>
        </span>
       <label><b>Edit Task</b></label>
       <div class="ui focus input" style={{width:"50%"}}><input type="text" name="task" value={usertask} onChange={handlechange}/></div>
      <br/>
    
    <Button color= 'blue' onClick={handlesubmit}>Save</Button>
      </div>
    );
  };
export default Modal