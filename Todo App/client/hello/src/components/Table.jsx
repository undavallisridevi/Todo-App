import React from 'react'

export default function Table(tasks) {

  const TableRows =
    tasks.data.map((info) => {
      return (
 <tr>
          <td>{info.task}</td>
          <td>{info.username}</td>
          <td>{info.time}</td>
          <td>{info.status}</td>

        </tr>

      );

    });



  return (
    <div class="table-wrapper">
  <table class="ui celled table unstackable ">
    <thead style={{fontSize: "large"}}>
      <tr class="">
        <th>Task</th>
        <th>Assignee</th>
        <th>Time</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody class="">
      {TableRows}
    </tbody>
  </table>
</div>

  )
}
