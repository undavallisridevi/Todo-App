import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, Header } from 'semantic-ui-react'
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import Todo from './Todo';
import Cookies from "universal-cookie"
import './style.css'



function ModalDisplay() {
  const endpoint="http://192.168.1.43:3020/";
  
  //get username using cookie
  const cookie = new Cookies();

   const user=cookie.get('username');

  
  const [data, setdata] = useState({
    task:"",
    time:"", desc:""
  })
  const [flag, setflag] = useState(false)
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState(false)
 
  const ref24hrs=useRef(null)
  const ref12hrs=useRef(null)
  const [showAlert, setShowAlert] = useState(false);
const [error,setError]=useState('')

  useEffect(() => {
    gettasks()
  }, [])

  useEffect(() => { }, [tasks, flag])

   //function to fetch tasks and filter them w.r.t user
  function gettasks() {
    fetch(endpoint+"getupdateddata")
      .then(response => response.json())
      .then(data => {
        const alltasks = data.filter(ele => {
          if (ele.username === user)
            return ele;
        })
        setTasks(alltasks);
        // setflag(!flag)
      })
  }

  
  
  const pending = (tasks.filter(task => task.status === "pending"))
  const inProgressTasks = (tasks.filter(task => task.status === "inprogress"))
  const CompletedTasks = (tasks.filter(task => task.status === "completed"))
  const deletedTasks = (tasks.filter(task => task.status === "deleted"))
  const todoTasks = (tasks.filter(task => task.status === "no_status"))
  
 

  //min array to map the options in minutes for time
  const min = Array.from({ length: 60 }, (value, index) => {
    if (index < 10) {
      index = "0" + index
    }
    return index;
  })

  //hr array to map the options in hours for time

  const hr = Array.from({ length: 12 }, (value, index) => {
    index = ++index;
    if ((index) < 10) {
      index = "0" + index
    }
    return index
  })

  


  function addToTime() {

    var hr = document.getElementById('dropdownhr').value;


    var min = document.getElementById('dropdownmin').value;
    var am_pm = document.getElementById('am');
    var text = am_pm.options[am_pm.selectedIndex].text;

    var time12hrs = hr + ":" + min  + " " + text;
   
    setdata((prev) => {
      return { ...prev, time: time12hrs }
    })
  };

  //function to display placeholder for time input onclick of radio buttons for 24 and 12 hours format

  function display(event) {
    let timeFormat = event.target.id;

    if (timeFormat === "hrs_24") {
      setdata((prev) => {
        return { ...prev, time: "" }
      })
      document.getElementById('time').setAttribute("placeholder", "HH:MM")
      ref24hrs.current.style.display="block";
      ref12hrs.current.style.display="none";

     
    }
    else {
      
      setdata((prev) => {
        return { ...prev, time: "" }
      })
      document.getElementById('time').setAttribute("placeholder", "HH:MM AM/PM")
      ref12hrs.current.style.display="block";
      ref24hrs.current.style.display="none";


    }
  }


  function handleTask(e) {
    let name = e.target.name;
    let value = e.target.value;
    setdata({ ...data, [name]: value });
  }
 

  const handleSubmit = (e) => {
e.preventDefault();

  const timePattern =/^(([01]\d|2[0-3]):[0-5]\d|((0?[1-9]|1[0-2]):[0-5]\d\s[AP]M))$/;
  
  const timePattern12 = /^(0?[1-9]|1[0-2]):[0-5]\d\s[AP]M$/;
  const timePattern24 = /^([01]\d|2[0-3]):[0-5]\d$/;
  const match = data.time.match(timePattern);
  const match12 = data.time.match(timePattern12);
  const match24 = data.time.match(timePattern24);



if(ref24hrs.current.style.display==="block")
{
  if (!match24) {
    setError("HH:MM");
    setShowAlert(true);
    return;
  }

}
else if(ref12hrs.current.style.display==="block")
{
  if (!match12) {
    setError("HH:MM AM/PM");
    setShowAlert(true);
    return;
  }

}
else{
  
  if (!match) {
    setError("enter time format in HH:MM or HH:MM AM/PM")
    setShowAlert(true);
    return; // invalid hour range for either format
  }

 
}


      setOpen(false)
    
      let arr = {}

      arr["task"] = data.task;
      arr["status"] = "no_status";
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      const formattedToday = yyyy + '-' + mm + '-' + dd;
      arr["date"] = formattedToday
      arr["time"] = data.time;
      arr["username"] = user;
      arr["assigned"] = "false";
      arr["desc"] = data.desc;




      axios.post(endpoint+"postdata", arr, {
        headers: { "Content-Type": "application/json" }
      }).then(gettasks)       //to fetch data again on addition of a new task
        .then(() => {                      //reset fields in the form after submission
          data.task = '';
          data.time = '';
          data.desc = '';


        })
}
  

  return (
    <div className='container' >
      <Modal
        closeIcon
        open={open}
        trigger={<Button style={{
          backgroundColor: "blue",
          color: "white",

          fontSize: "large",
          marginTop: "2rem",
          marginBottom: "2rem",
          marginLeft: "3rem"
        }} className='addtaskbtn'>Add Task</Button>}

        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Header style={{ background: "#c5d9e8" }} icon='pencil alternate' content='Add Task' />
        <Modal.Content>

          <>


            <form class="ui form" onSubmit={handleSubmit} style={{ width: "70%", marginLeft: "5%" }}>
              <div class="field">
                <label htmlFor='task' style={{ fontSize: "larger" }}>Task</label>

                <input type="text" name="task" id='task' value={data.task} onChange={handleTask}  required/>
              </div>
              <div class="field">
                <label htmlFor='taskdesc' style={{ fontSize: "larger" }}>Add Description</label>
                <input type="text" name="desc" id='desc' value={data.desc} onChange={handleTask} />
              </div>

              <label style={{ fontSize: "larger" }}>24hrs </label><input style={{ transform: "scale(1.2)", width: "3%" }} type="radio"   onClick={display} name="24hrs" id="hrs_24" />
              <label style={{ fontSize: "larger" }}>12hrs </label> <input style={{ transform: "scale(1.2)", width: "3%" }} type="radio" onClick={display} name="24hrs" id="hrs_12" />


              <div  ref={ref24hrs} id="clock_24" style={{ display: "none" }} >
                <input style={{ width: "7rem" }} type="time" name="time" id='time24' onChange={handleTask} />
              </div>
              <div ref={ref12hrs} id="clock_12" style={{ display: "none" }}>
                <label style={{ fontSize: "125%" }}>Select a time:</label>
                <div style={{ display: "flex" }}>
                  <select style={{ width: "7rem" }} id="dropdownhr" name="dropdown" onChange={addToTime} >
                    <option value="01" >Hour</option>
                    {hr.map((option) => (
                      <option key={option} value={option}>
                        {option}
                        </option>
                    ))}
                  </select>
                  <select style={{ width: "7rem" }} id="dropdownmin" name="dropdown" onChange={addToTime}>
                    <option value="00">Minute</option>
                    {min.map((option) => (
                      <option key={option} value={option} 
                      >
                        {option}

                      </option>
                    ))}

                  </select>
                  <select style={{ width: "7rem" }} name="am-pm" id="am" onChange={addToTime}>
                    <option value="am" >AM</option>
                    <option value="pm">PM</option>
                  </select>
                </div>
              </div>
              
              <div class="field"><br/>
                <label style={{ fontSize: "larger" }} htmlFor='time'>Enter Time</label>
                {showAlert && <div class="ui red message">{error}</div>}
                <input type="text" name="time" id="time" value={data.time} onClick={()=>setShowAlert(false)} onChange={handleTask}  required/>
              </div><br />
              <Modal.Actions>
          <Button style={{ padding: "2% 5%", marginLeft:"auto",fontSize: "initial" }} color='red' type="submit">
            Add
          </Button>

        </Modal.Actions>
            </form>

          </>
        
        
        </Modal.Content>
      </Modal>


      <Todo pending={pending} inProgressTasks={inProgressTasks} todoTasks={todoTasks} CompletedTasks={CompletedTasks} deletedTasks={deletedTasks} getalltasks={gettasks} flag={flag} setFlag={setflag} />

    </div>
  )

}
export default ModalDisplay

