const express = require('express');
const jsonParser = require('body-parser').json();
const Student = require(__dirname + '/../models/student');
const handleDBError = require(__dirname + '/../lib/handle_db_error');

var studentRouter = module.exports = exports = express.Router();

studentRouter.get('/students', (req, res) => {
  Student.find({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({message: data});
  });
});

studentRouter.post('/students', (req, res) => {
  req.body = '';
  req.on('data', (chunk) => {
    req.body += chunk.toString();
  });
  req.on('end', () => {
    req.body = JSON.parse(req.body);
    console.log(req.body);
    console.log();
    var newStudent = new Student(req.body);
    newStudent.save((err, data) => {
      if (err) return handleDBError(err, res);
      res.status(200).json({message: 'Successfully created student with name [' + req.body.name + '] and location [' + req.body.location + ']'});
    });
  });
});

studentRouter.put('/students/:id', (req, res) => {
  req.body = '';
  req.on('data', (chunk) => {
    req.body += chunk.toString();
  });
  req.on('end', () => {
    req.body = JSON.parse(req.body);
    var studentData = req.body;
    delete studentData._id;
    Student.update({_id: req.params.id}, studentData, (err) => {
      if (err) return handleDBError(err, res);
      res.status(200).json({message: 'Successfully updated student with ID [' + req.params.id + '].'});
    });
  });
});

studentRouter.delete('/students/:id', (req, res) => {
  Student.remove({_id: req.params.id}, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({message: 'Successfully deleted student with ID [' + req.params.id + '].'});
  });
});
