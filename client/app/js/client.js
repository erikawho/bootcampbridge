const React = require('react');
const ReactDOM = require('react-dom');
const jquery = require('jquery');
const baseUri = 'http://localhost:3000/api/students';

//React Classes
var CreateStudentForm = React.createClass({
  displayName: 'CreateStudentForm',
  getInitialState: function() {
    return({studentName: '', studentLocation: ''});
  },
  handleNameChange: function(e) {
    this.setState({studentName: e.target.value});
  },
  handleAmountChange: function(e) {
    this.setState({studentLocation: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var studentName = this.state.studentName.trim(), student = this.state.studentLocation.trim();
    if (!studentName || !studentLocation) return;
    this.onFormSubmit({name: studentName, location: studentLocation});
    this.setState({studentName: '', studentLocation: ''});
  },
  onFormSubmit: function(newStudent) {
    studentPOSTRequest(newStudent, renderStudentDisplay);
  },
  render: function() {
    return (
      <form className="createStudentForm" onSubmit={this.handleSubmit} >
        <input type="text" placeholder="Student name" value={this.state.studentName} onChange={this.handleNameChange} />
        <input type="text" placeholder="Student location" value={this.state.studentLocation} onChange={this.handleLocationChange} />
        <input type="submit" value="Create Student" />
      </form>
    );
  }
});
var StudentDisplay = React.createClass({
  displayName: 'StudentDisplay',
  getInitialState: function() {
    return({studentName: this.props.name, studentLocation: this.props.amount});
  },
  handleNameChange: function(e) {
    this.setState({studentName: e.target.value});
  },
  handleAmountChange: function(e) {
    this.setState({studentLocation: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var studentName = this.state.studentName.trim(), studentLocation = this.state.studentLocation.trim();
    if (!studentName || !studentLocation) return;
    this.onUpdateClick(e, {name: studentName, location: studentLocation});
  },
  onUpdateClick: function(e, newStudent) {
    e.preventDefault();
    var studentId = this.props._id;
    var uri = baseUri + '/' + studentId;
    //console.log('Update URI: ' + uri);
    studentPUTRequest(newStudent, uri, renderStudentsDisplay);
  },
  onDeleteClick: function(e) {
    e.preventDefault();
    var studentId = this.props._id;
    var uri = baseUri + '/' + studentId;
    //console.log('Delete URI: ' + uri);
    studentDELETERequest(uri, renderStudentsDisplay);
  },
  render: function() {
    return (
      <form className="studentDisplay" >
        <input type="text" placeholder="New student name" value={this.state.studentName} onChange={this.handleNameChange} />
        <input type="text" placeholder="New student location" value={this.state.studentLocation} onChange={this.handleLocationChange} />
        <input type="submit" value="Update" onClick={this.handleSubmit} />
        <input type="submit" value="Delete" onClick={this.onDeleteClick} />
      </form>
    );
  }
});

//Render the application.
renderCreateStudentForm();
renderStudentsDisplay();

//Render Functions
function renderCreateStudentForm() {
  jquery('#createStudent').remove();
  jquery('<section id="createStudent"></section>').appendTo('#studentApplication');
  ReactDOM.render(React.createElement(CreateStudentForm, null), document.getElementById('createStudent'));
  jquery('<h2 id="createStudentHeader">Create a New Student</h2>').prependTo('#createStudent');
}
function renderStudentsDisplay() {
  jquery('#studentDisplays').remove();
  jquery('<section id="studentDisplays"><h2 id="studentDisplaysHeader">Participating Students</h2></section>').appendTo('#studentApplication');
  studentGETRequest(renderStudentDisplays);
}
function renderStudentDisplays(data) {
  //console.log('Rendering bear displays.');
  var students = data.message;
  if (!students.length) jquery('#studentDisplaysHeader').remove();
  if (students.length) jquery('#studentDisplaysHeader').css('display', 'block');
  for(var i = 0; i < students.length; i++) {
    var id = 'studentsDisplay-' + i.toString();
    var jqueryID = '#' + id;
    jquery(jqueryID).remove();
    var tag = '<section id="' + id + '"></section>';
    jquery(tag).appendTo('#studentDisplays');
    ReactDOM.render(React.createElement(StudentDisplay, students[i]), document.getElementById(id));
  }
  //console.log('Rendering student displays complete.');
  //console.log();
}

//AJAX Requests
function studentGETRequest(callback) {
  jquery.ajax({
    url: baseUri,
    type: 'GET',
    success: function(data) {
      //console.log('GET request completed!');
      //console.log(data);
      callback(data);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(baseUri, status, err.toString());
    }.bind(this)
  });
}
function studentPOSTRequest(newStudent, callback) {
  jquery.ajax({
    url: baseUri,
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify(newStudent),
    success: function(data) {
      //console.log('POST request completed!');
      //console.log(data);
      callback();
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(baseUri, status, err.toString());
    }.bind(this)
  });
}
function studentPUTRequest(newStudent, uri, callback) {
  jquery.ajax({
    url: uri,
    dataType: 'json',
    type: 'PUT',
    data: JSON.stringify(newStudent),
    success: function(data) {
      //console.log('PUT request completed!');
      //console.log(data);
      callback();
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(baseUri, status, err.toString());
    }.bind(this)
  });
}
function studentDELETERequest(uri, callback) {
  jquery.ajax({
    url: uri,
    type: 'DELETE',
    success: function(data) {
      //console.log('DELETE request completed!');
      //console.log(data);
      callback();
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(baseUri, status, err.toString());
    }.bind(this)
  });
}
