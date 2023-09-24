
import React, { useEffect, useState } from "react";
import axios from 'axios'
import './style.css'
import { Button, Dropdown } from "semantic-ui-react";
const Modal = ({
  setVisibility,
  visibility,
  id,
  task,
  getalltasks,
  // flag,
  // setFlag,
  desc,
  time,
  priority,
  starttime,
  endtime
}) => {
  const endpoint = "http://localhost:3020/";
   const options= [
    {key:"Low" ,value:'Low', text:'Low'},
    {key:"Medium",value:'Medium', text:'Medium'},
    {key:"High",value:'High', text:'High'},
  ]
  const [Assignees, setAssignees] = useState([]);

  const [data, setData] = useState({})
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleSelect = (event, { value }) => {

    setSelectedOptions(value);
  };
  useEffect(() => {
    fetch("https://backflipt-accounts.onrender.com/users")
      .then(response => response.json())
      .then(data => {

        let users = [];
        let temp = {
          key: "",
          text: "",
          value: ""
        }

        data.forEach(element => {
          temp.key = element.username;
          temp.text = element.username;
          temp.value = element.username;

          users.push({ ...temp });

        });
        setAssignees(users);
      })
  }, [])
  useEffect(() => {
    setData({ task, time, desc, starttime, endtime, priority })
  }, [id])

  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('.more-details') === null) {
        setVisibility(false);
        setSelectedOptions([])
        setData({})
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visibility]);

  const handleHide = (e) => {
    setVisibility(!visibility);
    setSelectedOptions([])
    setData({})
  };

  function handledropdownChange(event,{value})
  {
   
    setData({ ...data, ["priority"]: value });
  }

  function handleChange(e) {
    
    let name = e.target.name;


    let value = e.target.value;



    setData({ ...data, [name]: value });


  }
  function handlesubmit() {
    data["id"] = id;
    axios.post(endpoint + "edit", data, {
      headers: { "Content-Type": "application/json" }
    }).then(getalltasks)
      .then(() => {
        // setFlag(!flag);
        setVisibility(!visibility);

      })
      
    if (selectedOptions.length > 0) {
      let tasks = []

      selectedOptions.map((key, index) => {


        data["status"] = "no status";
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;   // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = yyyy + '-' + mm + '-' + dd;
        data["date"] = formattedToday;

        data["username"] = key
        data["assigned"] = "false";
        tasks.push({ ...data });

      })


      axios.post(endpoint + "postdata", tasks, {
        headers: { "Content-Type": "application/json" }
      })
        .then(()=>
        {
          setData({})
          setSelectedOptions([])})
    }


  }

  return (
    <div className="more-details" >
      <span className="close-button">
        <i className="fa-regular fa-circle-xmark" onClick={handleHide}></i>
      </span>

      <h3 style={{ marginLeft: "35%", marginTop: "-3%" }}>Edit Your Task</h3>

      <hr style={{ border: "1px solid black", width: "-webkit-fill-available" }} />
      <br />
      <label>Task</label>
      <div class="ui focus input" style={{ width: "50%" }}><input type="text" name="task" value={data.task} onChange={handleChange} /></div>
      <br />
      <label>Priority</label>
   

  <Dropdown style={{    width: "inherit"}}
      
      fluid
      selection
      options={options}
      value={data.priority}
    onChange={handledropdownChange}
    
  />
      {time !== " " && time !== '' && time !== undefined ? <> <label>Time</label>
        <div class="ui focus input" style={{ width: "50%" }}><input type="text" name="time" value={data.time} onChange={handleChange} /></div>
        <br /></> : <></>}

      {starttime !== " " && starttime !== '' && starttime !== undefined ? <><label>StartTime</label>

        <div class="ui focus input" style={{ width: "50%" }}><input type="text" name="starttime" value={data.starttime} onChange={handleChange} /></div>
        <br />
        <label>End Time</label>
        <div class="ui focus input" style={{ width: "50%" }}><input type="text" name="endtime" value={data.endtime} onChange={handleChange} /></div>
        <br /></> : <></>}
      <div class="field" style={{ width: "inherit"}}>
        <label htmlFor='dropdown1' required>Assignee</label>
        <Dropdown style={{ width: "105%", display: " " }}
          id="dropdown1"
          placeholder={<div class="ui left icon input">
            <i class="users icon"></i>
          </div>}
          fluid
          multiple
          search
          selection
          options={Assignees}
          value={selectedOptions}
          onChange={handleSelect}
          required
        />
      </div><br />

      <Button color='blue' onClick={handlesubmit}>Save</Button>
    </div>
  );
};
export default Modal