import React, { useEffect, useState } from "react";
import axios from 'axios'
import './style.css'
import { Button } from "semantic-ui-react";

const DeleteModal = ({
  setdelVisibility,
  visibility,
  id,
  status,
  getalltasks,

  
 
}) => {
  const [description, setDesc] = useState('')
  const endpoint="http://192.168.1.43:3020/";
  useEffect(() => {
    function handleClickOutside(event) {
        if (event.target.closest('.more-details') === null) {
            setdelVisibility(false);
        }
    }

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
        window.removeEventListener('mousedown', handleClickOutside);
    };
}, [visibility]);
  const handleHide = (e) => {
    setDesc(" ");
  
    setdelVisibility(!visibility);
   
  };

  function handlechange(event) {
    setDesc(prev => prev = event.target.value)

  }
  function handlesubmit() {


    let data = {
      FromStatus: status,
      status: "deleted",
      id: id,
      deldesc: description,
      deltime: new Date().getHours() + ":" + new Date().getMinutes()
    }
    axios.post(endpoint+"updatetodel", data, {
      headers: { "Content-Type": "application/json" }
    }).then(()=>
    {
   
      setdelVisibility(!visibility)
    setDesc('');
  }).then(getalltasks)
    
}
  return (
    <div className="more-details">
      <span className="close-button">
        <i className="fa-regular fa-circle-xmark" onClick={handleHide}></i>
      </span>
      <label><b>Reason For Deleting The Task</b></label><br/>
      <div class="ui focus input" style={{width:"50%"}}><input  type="text" name="desc" value={description}  onChange={handlechange} /></div>
      <br/>
      <Button color= 'blue' onClick={handlesubmit}>Save</Button>
    </div>
  );
};
export default DeleteModal