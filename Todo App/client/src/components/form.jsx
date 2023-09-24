import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import TableComponent from "./Table.jsx";
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import { Button, Dropdown, Modal } from 'semantic-ui-react';
import background from '../images/adminpagebg.jpg'
import Cookies from "universal-cookie"

//component for admin to assign tasks 

export default function Form() {
  const endpoint = "http://localhost:3020/";
  const cookie = new Cookies();

  const user = cookie.get('username');

  //options for dropdown
  const [options, setOptions] = useState([]);

  //tasks assigned by admin
  const [adminTasks, setAdminTasks] = useState([]);
  const [toggleTable, setToggle] = useState(true);
  const [task, setTask] = useState("")
  const [desc, setDesc] = useState("")
  const [priority, setPriority] = useState("low")
  const [filteredData, setFiltered] = useState([])
  const searching=useRef(null);
  //toggle show and hide button for table
  const [show, setdisplay] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  //stores selected Assignees
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [open, setOpen] = useState(false)
  
  //handle selected Assignees change
  const handleChange = (event, { value }) => {
    setSelectedOptions(value);
    setShowAlert(false);
  };

  //handle task description change
  const handleDescChange = (event) => {
    setDesc(event.target.value)
  };

  //handle task changes
  const handleInputChange = (event) => {

    setTask(event.target.value)
  };

  //toggle table display between show and hide
  const toggle = () => {
    setdisplay(prev => !prev)

  }

  //fetch Assignees to show them in the search bar to assign tasks

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

          users.push({...temp});

        });
        setOptions(users);
      })
  }, [])

  //fetch assigned tasks to show them in table

  function getData() {
    fetch(endpoint + "alltasks")
      .then(response => response.json())
      .then(data => {
        setAdminTasks(data);
        setFiltered(data);
      })

  }

  //to show newly added data to table
  useEffect(() => {
    getData();
  }, [toggleTable])

  //post form data

  const handleSubmit = async (event) => {
    event.preventDefault();


    if (selectedOptions.length === 0) {
      setShowAlert(true);
    }
    else {
      setOpen(true)
      let tasks = []
      let data = {}
    searching.current.value="";
      selectedOptions.map((key, index) => {

        data["task"] = task;
        data["status"] = "no status";
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;   // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = yyyy + '-' + mm + '-' + dd;
        data["date"] = formattedToday;
        let hr = new Date().getHours();
        if (hr.length === 1)
          hr = "0" + hr;
        let min = new Date().getMinutes();
        if (min.length === 1) {
          min = "0" + min
        }
        data["time"] = hr + ":" + min;
        data["username"] = key;
        data["desc"] = desc;
        data["assigned"] = "true";
        data["priority"] = priority;
        tasks.push({ ...data });

      })


      await axios.post(endpoint + "postdata", tasks, {
        headers: { "Content-Type": "application/json" }
      }).then(setToggle(prev => !prev))       //to show newly added data to table  
        .then(setTask(" "))
        .then(setDesc(""))
        .then(setSelectedOptions([]))
        
    }
  };

  //to handle priority change
  function handlePriorityChange(event) {

    setPriority(event.target.value);
  }

  //handle checkbox changes to add user as assignee
  function change() {
    var decider = document.getElementById('assigntome');
    if (decider.checked) {
      setSelectedOptions([...selectedOptions, user])
    } else {
      setSelectedOptions(selectedOptions.filter(option => {
        if (option !== user)
          return option;
      }))

    }
  }
  
//handle search bar and display serach results in table
  const handleSearch = (e) => {
   
    let finaldata = adminTasks.filter((row) => {

      return Object.values(row).some((value) => {

        if (isNaN(value)) {

          return String(value)

            .toLowerCase()

            .includes(e.target.value.toLowerCase());

        }

        return false;

      });

    });

    setFiltered(finaldata);
  };

  return (
    <div style={{ background: `linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)), url(${background})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", height: "100vh", marginTop: "2%" }}>
      <center >

        <div style={{ width: "40%", opacity: "1", color: "white" }} >

          <h1 style={{ padding: "7%", fontSize: "xx-large" }}>Task Assignment</h1>
          <form className="ui form" onSubmit={handleSubmit}>
            <div className="field">
              <label className='adminlabel' >Task</label>

              <input type="text" id="task" placeholder="Assign a task" name="task" value={task} onChange={handleInputChange} required />
            </div>
            <div className="field">
              <label className='adminlabel' >Priority</label>
            <select id="priority" onChange={handlePriorityChange}>
              <option value="Low" defaultValue="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            </div>
            <div className="field">
              <label className='adminlabel'>Description</label>
              <input type="text" placeholder="description" name='desc' value={desc} onChange={handleDescChange} />
            </div>
            <div className="field">
              <label htmlFor='dropdown1' className='adminlabel' required>Assignee</label>
              <Dropdown
                id="dropdown1"
               placeholder='Search Assignee.....'
              
                fluid
                clearable
                multiple
                search
                selection
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                required
              />
              {showAlert && <div className="ui red message">Please select at least one option</div>}
            </div>
           <div><h3 style={{    textAlign: "start",display: "flex"}}><input type="checkbox" id="assigntome" name="assigntome" value={user} onClick={change} /> &nbsp; Assign to me </h3></div> 
            <button className="ui button" style={{
              backgroundColor: "seashell",
              color: "black",
              padding: "0.9rem 0.5rem",
              fontSize: "initial",
              marginTop: "3%",
              marginLeft: "60%"
            }} type="submit" id="addtask" >Add Task</button>
          </form>
        </div>
        {'\n'}
        <center><br />
          <div><button className="ui positive button" onClick={toggle}> {show ? "Hide Tasks" : "Show Tasks"}</button></div>


          {'\n'}

        </center>



        {show && <>

          <div className="ui icon input" style={{ margin: "2%", float: "left" }} >
            <input  type="text" placeholder="Search..."  ref={searching} onChange={handleSearch} />
            <i className="search icon"></i>
          </div>

          <TableComponent data={filteredData} toggleTable={toggleTable} setToggle={setToggle} />
        </>}

      </center>
      <Modal
        // centered={false}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='tiny'
      >
        <Modal.Content>
          <Modal.Description>
            <h3>Tasks has been assigned</h3>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={() => setOpen(false)}>OK</Button>
        </Modal.Actions>
      </Modal>
    </div>

  )
}
