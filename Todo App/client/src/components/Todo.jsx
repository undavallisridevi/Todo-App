import React, { useEffect, useState } from 'react'
import { Popup, Icon ,Dropdown} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import './style.css'
import Modal from './editmodel';
import DeleteModal from './deletemodal';
import DelPermanentModal from './delPermanentModal';
export default function Todo({pending, inProgressTasks,todoTasks, CompletedTasks,deletedTasks,getalltasks,flag,setFlag}) {
  const endpoint="http://192.168.1.31:3020/";
 
  //to display only if taskid is null
  const [itemID, setID] = useState(null)

  //setstate for passing task to edit,delete  model component to edit the task
  const [editTask, setTask] = useState(null)
  const [delTask,setDelTask]=useState(null)
  //to track the status of the task
  const [status, setStatus] = useState(null)
  
  //toggle between display and hide of particular tasks
  const [pendingbtn,setPendingToggle]=useState(true)
  const [progressbtn,setProgressToggle]=useState(true)
  const [completedbtn,setCompletedToggle]=useState(true)
  const [deletedbtn,setDeletedToggle]=useState(true)
  
  //toggle visibility of a model that appears on edit,delete of task
  const [modalVisibility, setVisibility] = useState(false);
  const [modaldelVisibility, setdelVisibility] = useState(false);
  
  //keep track of visible tasks using dropdown options
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [open, setOpen] = useState(false)
  //store status and id of charts
  let data = {
    status: "",
    id: ""
  }

  //styles for task
  const styleForDiv={
    display: 'flex', 
    justifyContent: 'space-between',
     gap:' 2rem', 
     alignItems: 'center',
      margin: '0.3rem 1rem', 
      padding: '0.5rem',
      border: "3px solid #485ba5", 
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
    data.id = event.target.id;                          //id of task
delFromStatus= event.target.parentNode.parentNode.id;  //get status of task
    draggableTodo = event.target;                     //whole div having task is selected

  
  }

  function dragEnd() {
    draggableTodo = null;
  }


  function dragOver(event) {

    event.preventDefault();
  }
  

  
  function dragDrop(event) {
    event.target.style.border = "none";
   let status = event.target.id;      //get new status of task after it is dropped in another div

    data["status"] = event.target.id;
    if(status==="deleted")                       //open delete model if task is placed in deleted tasks
    {
      setStatus( status=>status=delFromStatus);   //set status for passing it to delete modal
      setID(itemID => itemID = data.id);
      
       setdelVisibility(true);
    }

    axios.post(endpoint+"updatestatus", data, {
      headers: { "Content-Type": "application/json" }
    }).then(getalltasks )
  }


  const handleOptionClick = (option) => {
if(option==='Pending Tasks')
setPendingToggle (!pendingbtn);
if(option==='Progress Tasks')
setProgressToggle (!progressbtn)
if(option==='Completed Tasks')
setCompletedToggle (!completedbtn)
if(option==='Deleted Tasks')
setDeletedToggle (!deletedbtn)

    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((prevOption) => prevOption !== option); // unselect option if it was already selected
      }
      return [...prevOptions, option];
    });
  };

  // converting first letter to uppercase
  function capitalizeFirstLetter(str) {
    
    const capitalized = str.replace(/^./, str[0].toUpperCase());
   
   return capitalized;
}

  const getOptionStyle = (option) => {
    if (selectedOptions.includes(option)) {
      return { backgroundColor: '#6785b2', color: 'white' }; // set selected option style
    }
    return {}; // use default style for non-selected options
  };

  useEffect(() => { }, [itemID, modalVisibility])
  useEffect(() => { }, [itemID, modaldelVisibility])
  useEffect(() => { setVisibility(null)}, [])


  const handleAction = (e) => {
    
    
    setID(itemID => itemID = e.target.parentNode.parentNode.id);
    setTask(editTask => editTask = e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerHTML)
    setVisibility(true);
  };
 
  const handleDeleteAction = (e) => {
    
    
     if(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id==="deleted")
     {
      setID(itemID => itemID = e.target.parentNode.parentNode.id);
      setDelTask(delTask => delTask = e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerHTML)

     
     
    
      setOpen(true)

    
     }
     else{
      setStatus( status=>status=e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id);
      setID(itemID => itemID = e.target.parentNode.parentNode.id);
    
       setdelVisibility(true);
     }
  };

 

  return (

    <>
   
   <div className="dropdownSel">
      <Dropdown style={{ border: "2px solid black", marginBottom: "10%", padding: "0.5rem 1rem" }} text='Select Tasks'>
        <Dropdown.Menu>
          <Dropdown.Item className='drop' text='Pending Tasks' style={getOptionStyle('Pending Tasks')} onClick={() => handleOptionClick('Pending Tasks')} />
          <Dropdown.Item className='drop' text='Progress Tasks' style={getOptionStyle('Progress Tasks')} onClick={() => handleOptionClick('Progress Tasks')} />
          <Dropdown.Item className='drop' text='Completed Tasks' style={getOptionStyle('Completed Tasks')} onClick={() => handleOptionClick('Completed Tasks')} />
          <Dropdown.Item className='drop' text='Deleted Tasks' style={getOptionStyle('Deleted Tasks')} onClick={() => handleOptionClick('Deleted Tasks')} />
        </Dropdown.Menu>
      </Dropdown>
    </div>
   
    
      <div className="wrap" style={{ display: 'flex' ,gap:"0.5rem"}}>
      <div className="status"  onDragOver={dragOver}  onDrop="return false" id="no_status"  >
          <h1 style={{position:"absolute"}}id="Todo" onDrop="return false">Todo</h1>
          <div className='tasks' style={{marginTop:"50px",overflowY: "auto",height:"400px"}} onDragOver={dragOver}  onDrop="return false" id="no_status" >
          {todoTasks.map(task => (
            <div key={task._id} className="todo" id={task._id} draggable="true" onDragStart={event => dragStart(event)} onDragEnd={dragEnd} onDrop="return false" onDragOver="return false" style={styleForDiv} >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
           { task.desc!==" "&&task.desc!==""  ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter( task.task)}</h4>} /> :<h4> {capitalizeFirstLetter( task.task)}</h4>}
                <p> {task.time} </p>

              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 1rem' }} id={task._id}>



                <p onClick={handleAction}><Icon name="edit outline"></Icon> </p>
                <p onClick={handleDeleteAction} ><Icon name="trash"></Icon></p>

              </div>
            </div>
          ))
          }</div>
          </div>
    { pendingbtn &&  <div className="status"  onDragOver={dragOver}  onDrop={dragDrop} id="pending" >
          <h1 style={{position:"absolute"}} id="pendingtasks" onDrop="return false">Pending</h1>
          <div className='tasks' style={{marginTop:"50px",overflowY: "auto",height:"400px"}}  onDragOver={dragOver}  onDrop={dragDrop} id="pending"  >
          {pending.map(task => (
            <div key={task._id} className="todo" id={task._id} draggable="true"  onDrop="return false" onDragOver="return false" onDragStart={event => dragStart(event)} onDragEnd={dragEnd} style={styleForDiv}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
              { task.desc!==" "&&task.desc!==""  ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter( task.task)}</h4>} /> :<h4> {capitalizeFirstLetter( task.task)} </h4>}
                <p> {task.time} </p>

              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 1rem' }} id={task._id}>



                <p onClick={handleAction}><Icon name="edit outline"></Icon> </p>
                <p onClick={handleDeleteAction} ><Icon name="trash"></Icon></p>

              </div>
            </div>
          ))
          }
</div>
        </div>}
       {progressbtn && <div className="status" id="inprogress"  onDragOver={dragOver}  onDrop={dragDrop}  >
          <h1 style={{position:"absolute"}} id="progresstasks" onDrop="return false">Progress</h1>
          <div className='tasks' style={{marginTop:"50px",overflowY: "auto",height:"400px"}} id="inprogress"  onDragOver={dragOver}  onDrop={dragDrop}>
          {inProgressTasks.map(task => (
            <div key={task._id} className="todo" id={task._id} draggable="true"  onDrop="return false" onDragOver="return false" onDragStart={dragStart} onDragEnd={dragEnd} style={styleForDiv}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
              { task.desc!==" "&&task.desc!==""  ? <Popup content={task.desc} trigger={<h4> {capitalizeFirstLetter( task.task)}</h4>} /> :<h4> {capitalizeFirstLetter( task.task)} </h4>}
                <p> {task.time} </p>

              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 0.5rem' }} id={task._id}>



                <p onClick={handleAction}><Icon name="edit outline"></Icon> </p>
                <p onClick={handleDeleteAction}><Icon name="trash"></Icon></p>

              </div>
            </div>
          ))
          }
</div>
        </div>}
       {completedbtn && <div className="status" id="completed"  onDragOver={dragOver}  onDrop={dragDrop} >
          <h1  style={{position:"absolute"}} id="completedtasks" onDrop="return false">Completed</h1>
          <div style={{marginTop:"50px",overflowY: "auto",height:"400px"}} id="completed" className='tasks' onDragOver={dragOver}  onDrop={dragDrop} >
          {CompletedTasks.map(task => (
            <div key={task._id} id={task._id} className="todo" draggable="true"  onDrop="return false" onDragOver="return false" onDragStart={dragStart} onDragEnd={dragEnd} style={styleForDiv}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
              { task.desc!==" "&&task.desc!==""  ? <Popup content={task.desc} trigger={<h4>  {capitalizeFirstLetter( task.task)}</h4>} /> :<h4> {capitalizeFirstLetter( task.task)} </h4>}
                <p> {task.time} </p>

              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: ' 1rem' }} id={task._id}>



                <p onClick={handleAction}><Icon name="edit outline"></Icon> </p>
                <p onClick={handleDeleteAction} ><Icon name="trash"></Icon></p>

              </div>
            </div>
          ))
          }
          </div>
        </div>}

      {deletedbtn &&  <div className="status del" id="deleted"  onDragOver={dragOver} onDrop={dragDrop} >
          <h1 style={{position:"absolute"}}id="deletedtasks" onDrop="return false">Deleted</h1>
          <div  className='tasks' style={{marginTop:"50px",overflowY: "auto",height:"400px"}} id="deleted"  onDragOver={dragOver} onDrop={dragDrop} >
          &nbsp;&nbsp;<button class="ui primary button" style={{backgroundColor:"blue",fontSize:"initial"}} id="show" onDrop="return false" onClick={display}>show</button>
          {deletedTasks.map(task => (
            <div key={task._id} id={task._id} className="todo" draggable="true"  onDrop="return false" onDragOver="return false"  onDragStart={dragStart} onDragEnd={dragEnd} style={styleForDiv}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
               
              { task.desc!==" "&&task.desc!==""  ? <Popup content={task.desc} trigger={<h4>  {capitalizeFirstLetter( task.task)}</h4>} /> :<h4>  {capitalizeFirstLetter( task.task)} </h4>}
                <p> {task.time} </p>

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


                <p onClick={handleAction}><Icon name="edit outline"></Icon> </p>
                <p onClick={handleDeleteAction} ><Icon name="trash"></Icon></p>

              </div>
            </div>
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
            getalltasks = {getalltasks}
            flag={flag}
            setFlag = {setFlag}
          />
        )}
      </div>
      <div className={modaldelVisibility ? "overlay active" : "overlay"}>
        {itemID == null? (
          <></>
        ) : (
          <DeleteModal
            visibility={modaldelVisibility}
            setdelVisibility={setdelVisibility}
            id={itemID}
            status={status}
            getalltasks = {getalltasks}
            flag={flag}
            setFlag = {setFlag}
          />
        )}
      </div>
      <div className={open ? "overlay active" : "overlay"}>
        {itemID == null? (
          <></>
        ) : (
          <DelPermanentModal
            visibility={open}
            setdelPermanentVisibility={setOpen}
            id={itemID}
            task={delTask}
            getalltasks = {getalltasks}
            flag={flag}
            setFlag = {setFlag}
          />
        )}
      </div>
    </>
  )
}
