import React, { useEffect, useState } from 'react'
import { Popup } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import './style.css'

export default function Priority() {
  const endpoint = process.env.REACT_APP_ENDPOINT;

  
  const cookie = new Cookies();

  const user=cookie.get('username');
    const [tasks,setTasks]=useState([])
  useEffect (() => {
    gettasks()
  }, [])

  const styleForDiv = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: ' 2rem',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: "5px",
  }
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
      })
  }
  function capitalizeFirstLetter(str) {

    const capitalized = str.replace(/^./, str[0].toUpperCase());   //matches first char in str and coverts it to uppercase and returns a new string

    return capitalized;
  }
  const hightasks = (tasks.filter(task => task.priority === "High"))
  const mediumtasks = (tasks.filter(task => task.priority === "Medium"))
  const superhightasks = (tasks.filter(task => task.priority === "SuperHigh"))
  const lowtasks= (tasks.filter(task => task.priority === "Low"))
  
  return (
<>
    <div  className="wrap" style={{ display: 'flex', gap: "0.5rem",marginTop:"5%" }}>
    <div   className="status"  >
          <h1  >Low</h1>
          <div className='tasks' style={{ marginTop: "50px", overflowY: "auto", height: "400px" }}>
          
            {lowtasks.map(task => (
              <fieldset key={task._id} className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : (task.priority==="SuperHigh"? "superhigh todo":"low todo"))} id={task._id}  style={styleForDiv}>
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter(task.task)}</h4>} /> : <h4> {capitalizeFirstLetter(task.task)} </h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}
                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
              
              </fieldset>
            ))
            }
            </div>
          </div>
     <div  className="status"  >
          <h1  >Medium</h1>
          <div className='tasks' style={{ marginTop: "50px", overflowY: "auto", height: "400px" }}>
            {mediumtasks.map(task => (
              <fieldset key={task._id} className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : (task.priority==="SuperHigh"? "superhigh todo":"low todo"))} id={task._id}  style={styleForDiv}>
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter(task.task)}</h4>} /> : <h4> {capitalizeFirstLetter(task.task)} </h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}
                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
              
              </fieldset>
            ))
            }
        </div>
          </div>
         
          <div   className="status"  >
          <h1  >High</h1>
          <div className='tasks' style={{ marginTop: "50px", overflowY: "auto", height: "400px" }}>
          
            {hightasks.map(task => (
              <fieldset key={task._id} className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : (task.priority==="SuperHigh"? "superhigh todo":"low todo"))} id={task._id}  style={styleForDiv}>
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter(task.task)}</h4>} /> : <h4> {capitalizeFirstLetter(task.task)} </h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}
                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
              
              </fieldset>
            ))
            }
            </div>
          </div>
          <div   className="status"  >
          <h1  >Superhigh</h1>
          <div className='tasks' style={{ marginTop: "50px", overflowY: "auto", height: "400px" }}>
          
            {superhightasks.map(task => (
              <fieldset key={task._id} className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : (task.priority==="SuperHigh"? "superhigh todo":"low todo"))} id={task._id}  style={styleForDiv}>
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter(task.task)}</h4>} /> : <h4> {capitalizeFirstLetter(task.task)} </h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}
                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
              
              </fieldset>
            ))
            }
            </div>
          </div>
         
         
        
    </div>
    </>
  )
}
