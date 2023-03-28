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
    time:"", desc:"",
    starttime:"",
    endtime:"",
    priority:"Low"
  })
  console.log(data);
  const [flag, setflag] = useState(false)
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState(false)
 const [radioBtn24,set24]=useState(false);
 const [radioBtn12,set12]=useState(false);

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
  const todoTasks = (tasks.filter(task => task.status === "no status"))
  
 const [start,setstart]=useState("")
 const [startflag,setstartfalg]=useState(false);
 const [end,setend]=useState("")
 const [endflag,setendfalg]=useState(false);
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

    if (timeFormat === "hrs_24" ) {
      if(!radioBtn24)
      {
        console.log("24true");
        set24(true);
        set12(false);
      setdata((prev) => {
        return { ...prev, time: "" }
      })
      document.getElementById('time').setAttribute("placeholder", "HH:MM")
      document.getElementById('starttime').setAttribute("placeholder", "HH:MM")
      document.getElementById('endtime').setAttribute("placeholder", "HH:MM")


      ref24hrs.current.style.display="block";
      ref12hrs.current.style.display="none";

     
    }
  else{
    set24(false);
    console.log("24false");
    event.target.checked=false;
    ref24hrs.current.style.display="none";
  }}
    else {
      if(!radioBtn12)
      {
        set12(true);
        set24(false);
      setdata((prev) => {
        return { ...prev, time: "" }
      })
      document.getElementById('time').setAttribute("placeholder", "HH:MM AM/PM")
      document.getElementById('starttime').setAttribute("placeholder", "HH:MM AM/PM")
      document.getElementById('endtime').setAttribute("placeholder", "HH:MM AM/PM")
      ref12hrs.current.style.display="block";
      ref24hrs.current.style.display="none";


    }
    else{
      event.target.checked=false;
      set12(false);

      ref12hrs.current.style.display="none";
    }
  }
  }

  function handleTask(e) {
    let name = e.target.name;
    if(name==="starttime")
    document.getElementById('endtime').required=true;
    if(name==="endtime")
    document.getElementById('starttime').required=true;
    let value = e.target.value;
    setdata({ ...data, [name]: value });
  }
 

  const handleSubmit = (e) => {
e.preventDefault();

  const timePattern =/^(([01]\d|2[0-3]):[0-5]\d|((0?[1-9]|1[0-2]):[0-5]\d\s[AP]M))$/;
  
  const timePattern12 = /^(0?[1-9]|1[0-2]):[0-5]\d\s[AP]M$/;
  const timePattern24 = /^([01]\d|2[0-3]):[0-5]\d$/;
  if((data.starttime===" "||data.starttime===''||data.starttime===undefined)&&(data.time=== " "||data.time===''||data.time===undefined))
  {
    setError("this field must be filled");
    setShowAlert(true);
    return;
  }
if(data.time!==" " &&data.time!=='' && data.time!=undefined)
{
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
}
if(data.starttime!==" " &&data.starttime!==''&&data.starttime!==undefined)
{
  const match = data.starttime.match(timePattern);

  const match12 = data.starttime.match(timePattern12);
  const match24 = data.starttime.match(timePattern24);



if(ref24hrs.current.style.display==="block")
{
  if (!match24) {
    setstart("HH:MM");
    setstartfalg(true);
    return;
  }

}
else if(ref12hrs.current.style.display==="block")
{
  if (!match12) {
    setstart("HH:MM AM/PM");
    setstartfalg(true);
    return;
  }

}
else{
  
  if (!match) {
    setstart("enter time format in HH:MM or HH:MM AM/PM")
    setstartfalg(true);
    return; // invalid hour range for either format
  }

 
}
}
if((data.endtime!==" " &&data.endtime!=='' &&data.endtime!==undefined))
{
  const match = data.endtime.match(timePattern);

  const match12 = data.endtime.match(timePattern12);
  const match24 = data.endtime.match(timePattern24);



if(ref24hrs.current.style.display==="block")
{
  if (!match24) {
    setend("HH:MM");
    setendfalg(true);
    return;
  }

}
else if(ref12hrs.current.style.display==="block")
{
  if (!match12) {
    setend("HH:MM AM/PM");
    setendfalg(true);
    return;
  }

}
else{
  
  if (!match) {
    setend("enter time format in HH:MM or HH:MM AM/PM")
    setendfalg(true);
    return; // invalid hour range for either format
  }

 
}
}

      setOpen(false)
    
      let arr = {}

      arr["task"] = data.task;
      arr["status"] = "no status";
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
arr["starttime"]=data.starttime;
arr["endtime"]=data.endtime;
if(data.priority===undefined)
data.priority="Low";
arr["priority"]=data.priority;



      axios.post(endpoint+"postdata", arr, {
        headers: { "Content-Type": "application/json" }
      }).then(gettasks)       //to fetch data again on addition of a new task
        .then(() => {                      //reset fields in the form after submission
         setdata({})


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

        onClose={() => {setOpen(false)
          setdata({})}
      }
        onOpen={() => {setOpen(true)
        }
        }
      >
        <Header style={{ background: "#c5d9e8" }} icon='pencil alternate' content='Add Task' />
        <Modal.Content>

          <>


            <form class="ui form" onSubmit={handleSubmit} style={{ width: "70%", marginLeft: "5%" }}>
              <div class="field">
                <label htmlFor='task' style={{ fontSize: "larger" }}>Task</label>

                <input type="text" name="task" id='task' value={data.task} onChange={handleTask}  required/>
              </div>
              <label htmlFor='priority' style={{ fontSize: "larger" }}>Priority</label>

              <select id="priority" name="priority" onChange={handleTask}>
  <option value="Low" selected="selected">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select><br/>
              <div class="field">
                <label htmlFor='taskdesc' style={{ fontSize: "larger" }}>Add Description</label>
                <input type="text" name="desc" id='desc' value={data.desc} onChange={handleTask} />
              </div>

              <label style={{ fontSize: "larger" }}>24hrs </label><input style={{ transform: "scale(1.2)", width: "3%" }} type="radio"   onClick={display} name="24hrs" id="hrs_24" />
              <label style={{ fontSize: "larger" }}>12hrs </label> <input style={{ transform: "scale(1.2)", width: "3%" }} type="radio" onClick={display} name="24hrs" id="hrs_12" />


              <div  ref={ref24hrs} id="clock_24" style={{ display: "none" }} >
                <input style={{ width: "7rem" }} type="time" name="time" id='time24' onChange={handleTask}  pattern="([1]?[0-9]|2[0-3]):[0-5][0-9]"/>
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
              <label style={{ fontSize: "larger" }} >Start time</label>
              {startflag && <div class="ui red message">{start}</div>}
              <input type="text" name="starttime" id="starttime" value={data.starttime}  onClick={()=>setstartfalg(false)} onChange={handleTask}></input>
              <label style={{ fontSize: "larger" }} >End time</label>
              {endflag && <div class="ui red message">{end}</div>}
              <input type="text" name="endtime" id="endtime" value={data.endtime} onClick={()=>setendfalg(false)} onChange={handleTask}></input>
                <label style={{ fontSize: "larger" }} htmlFor='time'>Enter Time</label>
                {showAlert && <div class="ui red message">{error}</div>}
                <input type="text" name="time" id="time" value={data.time} onClick={()=>setShowAlert(false)} onChange={handleTask}  />
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

