
const express = require('express');
const app = express();
const cors = require("cors")
const axios = require("axios")
const connectdb = require('./db/conn.js')
connectdb();
const UserTasks = require("./db/models/tasks.js");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.listen(3020, (req, res) => {

})


app.get('/getupdateddata', (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = yyyy + '-' + mm + '-' + dd;


  UserTasks.updateMany(
    {
      $and: [
        { date: { $lt: formattedToday } },
        { status: { $in: ["no_status", "inprogress"] } }
      ]
    },
    { $set: { status: "pending", date: formattedToday } }, { new: true }, (err, data) => {
      if (err) {
        console.log(err);

      }
      else {
        console.log(data);
      }
    }
  )

  UserTasks.find({}, (err, data) => {
    if (err)
      console.log(err);
    else {
      res.send(data);
    }
  })

});
app.post('/updatetodel', (req, res) => {

  console.log(req.body);

  UserTasks.findByIdAndUpdate({ _id: req.body.id }, { status: req.body.status, FromStatus: req.body.FromStatus, deldesc: req.body.deldesc, deltime: req.body.deltime }, { new: true }, (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data);
    }
  })

  res.send("ok");
});


//delete task
app.post('/delete', (req, res) => {

  console.log(req.body);
  UserTasks.findByIdAndDelete({ _id: req.body.id }, (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data);
    }
  })

  res.send("deleted");
});

app.post('/edit', (req, res) => {

  console.log(req.body);

  UserTasks.findByIdAndUpdate({ _id: req.body.id }, { task: req.body.task }, { new: true }, (err, data) => {

    if (err) {
      console.log(err);
    }
    else {
      console.log(data);
    }
  })

  res.send("ok");
});





app.post('/updatestatus', (req, res) => {


  console.log(req.body);
  if (req.body.status !== "deleted") {
    UserTasks.updateOne({ _id: req.body.id }, { $unset: { "FromStatus": 1, "deltime": 1, "deldesc": 1 }, $set: { status: req.body.status } }, (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(data);
      }
    })

  }
  else {
    UserTasks.findByIdAndUpdate({ _id: req.body.id }, { status: req.body.status }, { new: true }, (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(data);
      }
    })

  }

  res.send("ok");
});



app.post('/postdata', (req, res) => {

  console.log(req.body);
  if (Array.isArray(req.body)) {

    for (var i in req.body) {

      const user = new UserTasks(req.body[i]);
      user.save((err, doc) => {
        err ? console.log(err) : console.log(user);
      })

    }
  }
  else {
    console.log("yes")
    const user = new UserTasks(req.body);
    user.save((err, doc) => {
      err ? console.log(err) : console.log(user);
    })

  }
  res.send("added")

});


//admin tasks assignment
app.get("/alltasks", (req, res) => {

  let AdminAssignedTask
  UserTasks.find({ assigned: true }, (err, data) => {
    err ? console.log(err) : res.send(data);
  });
})



app.post("/auth", (req, res) => {
  axios
    .post(
      "https://backflipt-accounts.onrender.com/checkAuth",
      {
        session_id: req.body.session_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(503).send("Server Down");
    });
});

app.post("/logout", (req, res) => {
  axios
    .post(
      "https://backflipt-accounts.onrender.com/clearSession",
      { session_id: req.body.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) =>
      response.data ? res.send(response.data) : response.send(false)
    );
});
