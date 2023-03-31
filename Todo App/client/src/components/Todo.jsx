import React, { useEffect,  useState } from 'react'
import { Popup, Icon, Dropdown, Button,  Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import './style.css'
import Modal from './editmodel';
import DeleteModal from './deletemodal';
import DelPermanentModal from './delPermanentModal';
export default function Todo({ pending, inProgressTasks, todoTasks, CompletedTasks, deletedTasks, getalltasks }) {
  const endpoint = "http://192.168.1.43:3020/";

  //to display modal only if taskid is not  null
  const [itemID, setID] = useState(null)
  //setstate for passing task to edit,delete  model component to edit the task
  const [editTask, setTask] = useState(null)
  const [editDesc, setDesc] = useState(null)
  const [editTime, setTime] = useState(null)
  const [editStarttime, setStarttime] = useState(null)
  const [editEndtime, setEndtime] = useState(null)
  const [editPriority, setPriority] = useState(null)
  const [delTask, setDelTask] = useState(null)
  //to track the status of the task
  const [status, setStatus] = useState(null)

  //toggle between display and hide of particular tasks
  const [pendingbtn, setPendingToggle] = useState(true)
  const [progressbtn, setProgressToggle] = useState(true)
  const [completedbtn, setCompletedToggle] = useState(true)
  const [deletedbtn, setDeletedToggle] = useState(true)

  //toggle visibility of a model that appears on edit,delete of task
  const [modalVisibility, setVisibility] = useState(false);
  const [modaldelVisibility, setdelVisibility] = useState(false);

  //keep track of visible tasks using dropdown options
  const [selectedOptions, setSelectedOptions] = useState([]);
  //show modal to delete tasks permanently
  const [open, setOpen] = useState(false)

  //show modal to alert when task is dopped into todo status
  const [openAlert, setOpenAlert] = useState(false)

  //store status and id of tasks
  let data = {
    status: "",
    id: ""
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('.more-details') === null) {
        setOpenAlert(false);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openAlert]);



  //styles for task
  const styleForDiv = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: ' 2rem',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: "5px",
  }
  //toggle between show and hide of deleted tasks

  function display() {
    var delete_ele = document.getElementById("deleted");
    var delbutton = document.getElementById("show");

    if (delete_ele.classList.contains('del')) {
      delbutton.textContent = "Hide";
      delete_ele.classList.remove('del');
    }
    else {
      delete_ele.classList.add('del');
      delbutton.textContent = "Show";
    }
  }


  let draggableTodo = null;
  let delFromStatus;


  function dragStart(event) {
    data.id = event.target.id; 
    delFromStatus = event.target.parentNode.parentNode.id;  //get status of task
    draggableTodo = event.target;                     //whole div having task is selected
  }

  function dragEnd() {
    draggableTodo = null;
  }

//to prevent browser default action as it doesn't allow item to drop when it is dragged over the drop target
  function dragOver(event) {

    event.preventDefault();
  }

  function dragEnter(event) {
    event.preventDefault(); // prevent default behavior of browser when item is dragged over a droppable area
    const target = event.target;
    if (target.className === 'tasks') { // make sure the target is the droppable area
      target.style.border = '2px solid #000'; // add a dashed border to highlight the area
    }
  }

  function dragLeave(event) {
    event.preventDefault(); // prevent default behavior of browser when item is dragged over a droppable area
    const target = event.target;
    if (target.className === 'tasks') { // make sure the target is the droppable area
      target.style.border = 'none'; // add a dashed border to highlight the area

    }
  }

  function dragDrop(event) {
   if(!event.target.classList.contains('tasks'))
   {
    return false;
   }
    event.target.style.border = "none";
    let status = event.target.id;      //get new status of task after it is dropped in another div

    data["status"] = event.target.id;
    if (status === "deleted")                       //open delete model if task is placed in deleted tasks
    {
      setStatus( delFromStatus);   //set status for passing it to delete modal
      setID( data.id);

      setdelVisibility(true);
    }

    axios.post(endpoint + "updatestatus", data, {
      headers: { "Content-Type": "application/json" }
    }).then(getalltasks)
  }

//toggle between displaying particular tasks using multiselect dropdown
  const handleOptionClick = (option) => {

    if (option === 'Pending Tasks')
      setPendingToggle(!pendingbtn);
    if (option === 'Progress Tasks')
      setProgressToggle(!progressbtn)
    if (option === 'Completed Tasks')
      setCompletedToggle(!completedbtn)
    if (option === 'Deleted Tasks')
      setDeletedToggle(!deletedbtn)

    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((prevOption) => prevOption !== option); // unselect option if it was already selected
      }
      return [...prevOptions, option]; //select the option if it isn't selected previously
    });
  };

  // converting first letter to uppercase
  function capitalizeFirstLetter(str) {

    const capitalized = str.replace(/^./, str[0].toUpperCase());   //matches first char in str and coverts it to uppercase and returns a new string

    return capitalized;
  }

  //set style for options in dropdown for "select tasks" on selection and deselection
  const getOptionStyle = (option) => {
    if (selectedOptions.includes(option)) {
      return { backgroundColor: '#e4e4f2', color: 'black' }; // set selected option style
    }
    return { backgroundColor: '#6785b2', color: 'white' }; // use default style for non-selected options
  };

//set data in edit modal

  const handleAction = (id, task, desc, time, priority, starttime, endtime) => {
    setID(itemID => itemID = id);
    setTask(editTask => editTask = task)
    setDesc(editDesc => editDesc = desc)
    setPriority(editPriority => editPriority = priority)
    setTime(editTime => editTime = time)
    setStarttime(starttime);
    setEndtime(endtime);
    setVisibility(true);
  };

  //set data for delete modal
  const handleDeleteAction = (statusOfTask, id, task) => {
    if (statusOfTask === "deleted") {
      setID(itemID => itemID = id);
      setDelTask(delTask => delTask = task)
      setOpen(true)
    }
    else {
      setStatus(status => status = statusOfTask);
      setID(itemID => itemID = id);

      setdelVisibility(true);
    }
  };

 
  return (

    <>

      <div className="dropdownSel" >
        <Segment basic>
          <Dropdown items simple  style={{ border: "2px solid black", marginBottom: "10%", padding: "0.5rem 1rem" }} text='Select Tasks' >
              <Dropdown.Menu>

                <Dropdown.Item className='drop' style={getOptionStyle('Pending Tasks')}>
                  <input type="checkbox" checked={pendingbtn} id="pending"
                    onClick={() => {
                      setPendingToggle(!pendingbtn)
                      handleOptionClick('Pending Tasks')
                    }} // update the value of pendingbtn directly

                  /><label htmlFor='pending'>Pending Tasks</label>
                </Dropdown.Item>

                <Dropdown.Item className='drop' style={getOptionStyle('Progress Tasks')} >
                  <span>
                    <input type="checkbox" id="progress" checked={progressbtn}
                    onClick={() => {
                      setProgressToggle(!progressbtn)
                      handleOptionClick('Progress Tasks')
                    }} /></span>
                  <label htmlFor='progress'>Progress Tasks</label>
                </Dropdown.Item>
                <Dropdown.Item className='drop' style={getOptionStyle('Completed Tasks')} >
                  <input type="checkbox" checked={completedbtn} id="completed"
                    onClick={() => {
                      setCompletedToggle(!completedbtn)
                      handleOptionClick('Completed Tasks')
                    }} />
                  <label htmlFor='completed'>Completed Tasks</label>
                </Dropdown.Item>

                <Dropdown.Item className='drop' style={getOptionStyle('Deleted Tasks')}>
                  <input type="checkbox" checked={deletedbtn} id="Deleted"
                    onClick={() => {
                      setDeletedToggle(!deletedbtn)
                      handleOptionClick('Deleted Tasks')
                    }} />
                  <label htmlFor='Deleted'>Deleted Tasks</label>
                </Dropdown.Item>

              </Dropdown.Menu> 

            
          </Dropdown>
        </Segment>
      </div>


      <div className="wrap" style={{ display: 'flex', gap: "0.5rem" }}>
        <div className="status" onDragOver={dragOver} onDrop={() => { setOpenAlert(true); return false }} id="no_status"  >
          <h1 style={{ position: "absolute" }} id="Todo" onDrop={() => { return false }}>Todo</h1>

          <div className='tasks' style={{ marginTop: "50px", overflowY: "auto", height: "400px" }} onDragOver={dragOver} onDrop={() => { setOpenAlert(true); return false; }} id="no_status" >

            {todoTasks.map(task => (
              <fieldset className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : " low todo")} key={task._id} id={task._id} draggable="true" onDragStart={event => dragStart(event)} onDragEnd={dragEnd} onDrop={()=>{return false}} onDragOver={()=>{return false}} style={styleForDiv} >
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter(task.task)}</h4>} /> : <h4> {capitalizeFirstLetter(task.task)}</h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}
                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 1rem' }} id={task._id}>
                  <p id={task._id} onClick={() => handleAction(task._id, task.task, task.desc, task.time, task.priority, task.starttime, task.endtime)}><Icon name="edit outline"></Icon> </p>
                  <p onClick={() => handleDeleteAction("no_status", task._id, task.task)} ><Icon name="trash"></Icon></p>
                </div>
              </fieldset>
            ))
            }</div>
        </div>
        {pendingbtn && <div className="status" onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={dragDrop} id="pending" >
          <h1 style={{ position: "absolute" }} id="pendingtasks" onDrop={dragDrop}>Pending</h1>
          <div className='tasks' style={{ marginTop: "50px", overflowY: "auto", height: "400px" }} onDragEnter={dragEnter} onDragLeave={dragLeave} onDragOver={dragOver} onDrop={dragDrop} id="pending"  >
            {pending.map(task => (
              <fieldset key={task._id} className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : " low todo")} id={task._id} draggable="true" onDrop={dragDrop} onDragOver="return false" onDragStart={event => dragStart(event)} onDragEnd={dragEnd} style={styleForDiv}>
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter(task.task)}</h4>} /> : <h4> {capitalizeFirstLetter(task.task)} </h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}
                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 1rem' }} id={task._id}>
                  <p id={task._id} onClick={() => handleAction(task._id, task.task, task.desc, task.time, task.priority, task.starttime, task.endtime)}><Icon name="edit outline"></Icon> </p>
                  <p onClick={() => handleDeleteAction("pending", task._id, task.task)} ><Icon name="trash"></Icon></p>
                </div>
              </fieldset>
            ))
            }
          </div>
        </div>}
        {progressbtn && <div className="status" id="inprogress" onDragEnter={dragEnter} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={dragDrop}  >
          <h1 style={{ position: "absolute" }} id="progresstasks" onDrop={dragDrop}>Progress</h1>
          <div className='tasks' style={{ marginTop: "50px", overflowY: "auto", height: "400px" }} id="inprogress" onDragLeave={dragLeave} onDragEnter={dragEnter} onDragOver={dragOver} onDrop={dragDrop}>
            {inProgressTasks.map(task => (
              <fieldset key={task._id} className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : " low todo")} id={task._id} draggable="true" onDrop={dragDrop} onDragOver="return false" onDragStart={dragStart} onDragEnd={dragEnd} style={styleForDiv}>
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter(task.task)}</h4>} /> : <h4> {capitalizeFirstLetter(task.task)} </h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}
                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 0.5rem' }} id={task._id}>
                  <p id={task._id} onClick={() => handleAction(task._id, task.task, task.desc, task.time, task.priority, task.starttime, task.endtime)}><Icon name="edit outline"></Icon> </p>
                  <p onClick={() => handleDeleteAction("inprogress", task._id, task.task)} ><Icon name="trash"></Icon></p>
                </div>
              </fieldset>
            ))
            }
          </div>
        </div>}
        {completedbtn && <div className="status" id="completed" onDragEnter={dragEnter} onDragLeave={dragLeave} onDragOver={dragOver} onDrop={dragDrop} >
          <h1 style={{ position: "absolute" }} id="completedtasks" onDrop={dragDrop}>Completed</h1>
          <div style={{ marginTop: "50px", overflowY: "auto", height: "400px" }} id="completed" className='tasks' onDragLeave={dragLeave} onDragEnter={dragEnter} onDragOver={dragOver} onDrop={dragDrop} >
            {CompletedTasks.map(task => (
              <fieldset key={task._id} id={task._id} className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : " low todo")} draggable="true" onDrop={dragDrop} onDragOver="return false" onDragStart={dragStart} onDragEnd={dragEnd} style={styleForDiv}>
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4>  {capitalizeFirstLetter(task.task)}</h4>} /> : <h4> {capitalizeFirstLetter(task.task)} </h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}


                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 1rem' }} id={task._id}>
                 <p id={task._id} onClick={() => handleAction(task._id, task.task, task.desc, task.time, task.priority, task.starttime, task.endtime)}><Icon name="edit outline"></Icon> </p>
                  <p onClick={() => handleDeleteAction("completed", task._id, task.task)} ><Icon name="trash"></Icon></p>


                </div>
              </fieldset>
            ))
            }
          </div>
        </div>}

        {deletedbtn && <div className="status del" id="deleted" onDragEnter={dragEnter} onDragLeave={dragLeave} onDragOver={dragOver} onDrop={dragDrop} >
          <h1 style={{ position: "absolute" }} id="deletedtasks" onDrop={dragDrop}>Deleted</h1>
          <div className='tasks' style={{ marginTop: "50px", overflowY: "auto", height: "400px" }} id="deleted" onDragLeave={dragLeave} onDragEnter={dragEnter} onDragOver={dragOver} onDrop={dragDrop} >
            &nbsp;&nbsp;<button className="ui primary button" style={{ backgroundColor: "blue", fontSize: "initial" }} id="show" onDrop={dragDrop} onClick={display}>Show</button>
          
            {deletedTasks.map(task => (
              <fieldset key={task._id} id={task._id} className={task.priority === "High" ? " high todo" : (task.priority === "Medium" ? "medium todo" : " low todo")} draggable="true" onDrop={dragDrop} onDragOver="return false" onDragStart={dragStart} onDragEnd={dragEnd} style={styleForDiv}>
                <legend>{task.priority}</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>

                  {task.desc !== " " && task.desc !== "" ? <Popup content={task.desc} trigger={<h4>  {capitalizeFirstLetter(task.task)}</h4>} /> : <h4>  {capitalizeFirstLetter(task.task)} </h4>}
                  {task.time !== " " && task.time !== "" && task.time !== undefined ? <p style={{ width: " max-content" }}>Time: {task.time} </p> : <></>}


                  {task.starttime !== " " && task.starttime !== "" && task.starttime !== undefined ? <p>StartTime:{task.starttime}</p> : <></>}
                  {task.endtime !== " " && task.endtime !== "" && task.endtime !== undefined ? <p>End Time:{task.endtime}</p> : <></>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 1rem' }} id={task._id}>

                  <p > <Popup
                    content={
                      <>
                        <div>
                          <span className="popup-heading">Deleted from:&nbsp;</span>
                          <span className="popup-value">{task.FromStatus}</span>
                        </div>
                        <div>
                          <span className="popup-heading">Reason:&nbsp;</span>
                          <span className="popup-value">{task.deldesc}</span>
                        </div>
                        <div>
                          <span className="popup-heading">Time:&nbsp;</span>
                          <span className="popup-value">{task.deltime}</span>
                        </div>
                      </>
                    }
                    trigger={<Icon name="info circle"></Icon>}
                  />
                  </p>


                  <p id={task._id} onClick={() => handleAction(task._id, task.task, task.desc, task.time, task.priority, task.starttime, task.endtime)}><Icon name="edit outline"></Icon> </p>

                  <p onClick={() => handleDeleteAction("deleted", task._id, task.task)} ><Icon name="trash"></Icon></p>

                </div>
              </fieldset>
            ))
            }


          </div>
        </div>}

      </div>
      <div className={modalVisibility ? "overlay active" : "overlay"}>
        {itemID == null ? (
          <></>
        ) : (
          <Modal
            size='mini'
            visibility={modalVisibility}
            setVisibility={setVisibility}
            id={itemID}
            task={editTask}
            desc={editDesc}
            time={editTime}
            priority={editPriority}
            starttime={editStarttime}
            endtime={editEndtime}
            getalltasks={getalltasks}
            // flag={flag}
            // setFlag={setFlag}
          />
        )}
      </div>
      <div className={modaldelVisibility ? "overlay active" : "overlay"}>
        {itemID == null ? (
          <></>
        ) : (
          <DeleteModal
            visibility={modaldelVisibility}
            setdelVisibility={setdelVisibility}
            id={itemID}
            status={status}
            getalltasks={getalltasks}
            // flag={flag}
            // setFlag={setFlag}
          />
        )}
      </div>
      <div className={open ? "overlay active" : "overlay"}>
        {itemID == null ? (
          <></>
        ) : (
          <DelPermanentModal
            visibility={open}
            setdelPermanentVisibility={setOpen}
            id={itemID}
            task={delTask}
            getalltasks={getalltasks}
            // flag={flag}
            // setFlag={setFlag}
          />
        )}
      </div>
      <div className={openAlert ? "overlay active" : "overlay"}>
        {(

          <div className="more-details" style={{ width: "33%" }}>
            <span className="close-button">
            </span>
            <h3>You cannot place your Task here</h3>
            <hr style={{ color: "black", width: "-webkit-fill-available", border: "1px solid black" }} />
            <span style={{ marginLeft: "auto" }}>
              <Button color='green' onClick={() => setOpenAlert(false)}>Ok</Button>&nbsp;
            </span>

          </div>

        )}
      </div>

    </>
  )
}
