import React, { useState } from "react";
import axios from 'axios'
import './style.css'

const DeleteModal = ({
  setdelVisibility,
  visibility,
  id,
  status,
  getalltasks,
  flag,
  setFlag
  
 
}) => {
  const [description, setTask] = useState(" ")
  const handleHide = (e) => {
    setTask(" ");
    setFlag(!flag);
    setdelVisibility(!visibility);
   
  };

  function handlechange(event) {
    setTask(prev => prev = event.target.value)

  }
  function handlesubmit() {


    let data = {
      FromStatus: status,
      status: "deleted",
      id: id,
      deldesc: description,
      deltime: new Date().getHours() + ":" + new Date().getMinutes()
    }
    axios.post("http://localhost:3020/updatetodel", data, {
      headers: { "Content-Type": "application/json" }
    }).then(getalltasks)
    .then(()=>
    {
     setFlag(!flag)
      setdelVisibility(!visibility)})

  }
 
  return (
    <div className="more-details">
      <span className="close-button">
        <i className="fa-regular fa-circle-xmark" onClick={handleHide}></i>
      </span>
      <label>Reason For Deleting The Task</label>
      <input  type="text" name="desc" value={description}  onChange={handlechange} />
      <button style={{ color: 'blue' }} onClick={handlesubmit}>Save</button>
    </div>
  );
};
export default DeleteModal