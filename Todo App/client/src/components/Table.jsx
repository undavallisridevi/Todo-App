import React, { useState } from 'react';
import { Button, Header, Modal, Icon } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react';
import axios from 'axios'
import Pagination from 'react-js-pagination';

import './style.css';

export default function TableComponent({ data, setToggle, toggleTable }) {
  const endpoint = "http://192.168.1.43:3020/";
  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [id,setId]=useState('')
  const itemsPerPage = 5;

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  }

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
 
  const TableRows =
    currentItems.map((info, index) => {
      return <Table.Row id={info._id} key={index}>
        

        <Table.Cell >{info.task}</Table.Cell>
        <Table.Cell >{info.desc}</Table.Cell>
        <Table.Cell>{info.username}</Table.Cell>
        <Table.Cell>{info.time}</Table.Cell>
        <Table.Cell>{info.status}</Table.Cell>
        <Table.Cell> <Button className="deletebtn" value={info._id} onClick={(event)=>{
          
          setId(event.target.value)
          setOpen(true)
        }}>Delete</Button></Table.Cell>
       
      </Table.Row>

    });

  return (
    <div class="table-wrapper" style={{margin:"1rem"}}>
      <Table striped>
        <Table.Header style={{fontSize: "large"}}>
          <Table.Row>

            <Table.HeaderCell>Task</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Assignee</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>

          </Table.Row>
        </Table.Header>
        <Table.Body>
          {TableRows}
        </Table.Body>
       
        <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={data.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
      </Table>
    <footer style={{textAlign:"center",color:"black"}}>&copy; Copyright 2023 &nbsp;Sridevi</footer>

      <Modal
          size={'tiny'}
          closeIcon
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Header icon='archive' content='Alert' />
          <Modal.Content>
            <p>
              Do you want to delete the task  ?
            </p>
          </Modal.Content>
          <Modal.Actions>
          
            <Button color='red' onClick={() => setOpen(false)}>
              <Icon name='remove' /> cancel
            </Button>
            <Button color='green'  onClick={() => {
              
              
              setOpen(false)
              let data = {
      id: id
    }
    axios.post(endpoint + "delete", data, {
      headers: { "Content-Type": "application/json" }
    }).then(() => setToggle(!toggleTable))
              
              }}>
              <Icon name='checkmark' /> Delete
            </Button>
          </Modal.Actions>
        </Modal>
      
        </div>
  );
}
