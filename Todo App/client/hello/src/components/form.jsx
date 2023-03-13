import React, { useState, useEffect } from 'react'
import './style.css'
import Table from "./Table.jsx";
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import { Dropdown } from 'semantic-ui-react';
import background from '../images/adminpagebg.jpg'

//component for admin to assign tasks 

export default function Form() {

  const [options, setOptions] = useState([]);
  const [adminTasks, setAdminTasks] = useState([]);
  const [toggleTable, setToggle] = useState(true);
  const [task, setTask] = useState("")
  const [desc, setDesc] = useState("")
  const [show, setdisplay] = useState(true);
  //stores selected Assignees
  const [selectedOptions, setSelectedOptions] = useState([]);

  //handle selected Assignees change
  const handleChange = (event, { value }) => {
    setSelectedOptions(value);
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
        console.log(data);
        data.forEach(element => {
          temp.key = element.username;
          temp.text = element.username;
          temp.value = element.username;

          users.push({ ...temp });

        });

        setOptions(users);
      })
  }, [])

  //fetch assigned tasks to show them in table

  function getData() {
    fetch("http://localhost:3020/alltasks")
      .then(response => response.json())
      .then(data => {
        setAdminTasks(data);
      })

  }

  //to show newly added data to table
  useEffect(() => {
    getData();
  }, [toggleTable])

//post form data

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (task === '' || selectedOptions.length < 1) {
      return
    }

    let tasks = []
    let data = {}
    selectedOptions.map((key, index) => {

      data["task"] = task;
      data["status"] = "no_status";
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1;   // Months start at 0!
      let dd = today.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      const formattedToday = yyyy + '-' + mm + '-' + dd;
      data["date"] = formattedToday;
      data["time"] = new Date().getHours() + ":" + new Date().getMinutes();
      data["username"] = key
      data["desc"] = desc;
      data["assigned"] = "true";
      tasks.push({ ...data });

    })


    await axios.post("http://localhost:3020/postdata", tasks, {
      headers: { "Content-Type": "application/json" }
    }).then(setToggle(prev => !prev))       //to show newly added data to table  
      .then(setTask(" "))
      .then(setDesc(""))
      .then(setSelectedOptions([]))

  };

  return (
    <div style={{ background: `linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)), url(${background})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
      <center >

        <div style={{ width: "40%", opacity: "1",color:"white" }} >

          <h1 style={{ padding: "7%", fontSize: "xx-large" }}>Task Assignment</h1>
          <form class="ui form">
            <div class="field">
              <label className='adminlabel' >Task</label>

              <input type="text" id="task" placeholder='Assign a task' name="task" value={task} onChange={handleInputChange} required />
            </div>
            <div class="field">
              <label className='adminlabel'>Description</label>
              <input type="text" placeholder='description' name='desc' value={desc} onChange={handleDescChange} />
            </div>
            <div class="field">
              <label className='adminlabel'>Assignee</label>
              <Dropdown
                placeholder={<div class="ui left icon input">
                  Search Assignee.....    <i class="users icon"></i>
                </div>}
                fluid
                multiple
                search
                selection
                options={options}
                value={selectedOptions}
                onChange={handleChange}
              />
            </div>
            <button class="ui button" style={{
              backgroundColor: "seashell",
              color: "black",
              padding: "2%",
              fontSize: "initial",
              marginTop: "3%",
              marginLeft:"60%"
            }} type="submit" id="addtask" onClick={handleSubmit}>Add Task</button>
          </form>
        </div>
        {'\n'}
        <center>
          <div><button class="ui positive button" onClick={toggle}> {show ? "Hide" : "Show"}</button></div>


          {'\n'}

        </center>


        {show && <Table data={adminTasks} />}

      </center>
    </div>
  )
}
