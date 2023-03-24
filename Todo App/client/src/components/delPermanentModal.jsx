import React, { useEffect } from "react";
import axios from 'axios'
import './style.css'
import { Button } from "semantic-ui-react";

const DelPermanentModal = ({
  setdelPermanentVisibility,
  visibility,
  id,
  task,
  getalltasks,
  flag,
  setFlag
  
 
}) => {
  const endpoint="http://192.168.1.43:3020/";

  const handleHide = (e) => {
    setFlag(!flag);
    setdelPermanentVisibility(!visibility);
   
  };
  useEffect(() => {
    function handleClickOutside(event) {
        if (event.target.closest('.more-details') === null) {
            setdelPermanentVisibility(false);
        }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
        window.removeEventListener('mousedown', handleClickOutside);
    };
}, [setdelPermanentVisibility]);

  function delPermanent() {
    let data = {
      
        id: id,
      }
    axios.post(endpoint+"delete", data, {
        headers: { "Content-Type": "application/json" }
      }).then(()=>
    {
        setdelPermanentVisibility (!visibility)
     setFlag(!flag)
  }).then(getalltasks)
    
}

return (
    
    <div className="more-details" >
 <span className="close-button">
   <i className="fa-regular fa-circle-xmark"onClick={handleHide} ></i>
 </span>
 <h3>"{task}" &nbsp; will be deleted</h3>
 <hr  style={{    color: "black",width: "-webkit-fill-available",border:"1px solid black"}}/>
 <span style={{    marginLeft: "auto"}}>
 <Button color='green' onClick={delPermanent}>Ok</Button>&nbsp;
 <Button color='red' onClick={handleHide}>Cancel </Button></span>

</div>


)
};

export default DelPermanentModal;




