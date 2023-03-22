import React, { useState } from 'react'
import { Button, Header, Modal ,Icon} from 'semantic-ui-react';
import './style.css'
export default function Table({data,deletetask}) {
  
  const [open, setOpen] = useState(false)
  const TableRows =
    data.map((info,index) => (
  
 <tr key={index} id={info._id}>
          <td>{info.task}</td>
          <td>{info.desc}</td>
          <td>{info.username}</td>
          <td>{info.time}</td>
          <td>{info.status}</td>
          <td><Modal
           size={'tiny'}
      closeIcon
      open={open}
      trigger={<Button className="deletebtn" >Delete</Button>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header icon='archive' content='Alert' />
      <Modal.Content>
        <p>
         Do you want to delete the task?
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => setOpen(false)}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' onClick={() => {
        deletetask(info._id)
          setOpen(false)}}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal></td>
        </tr>

    

    ));



  return (
    <div class="table-wrapper" style={{margin:"2rem"}}>
  <table class="ui celled table unstackable ">
    <thead style={{fontSize: "large"}}>
      <tr class="">
        <th>Task</th>
        <th>Description</th>
        <th>Assignee</th>
        <th>Time</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody class="">
      {TableRows}
    </tbody>
  </table>
  
        <footer style={{textAlign:"center",color:"white"}}>&copy; Copyright 2023 &nbsp;Sridevi</footer>
</div>

  )
}
