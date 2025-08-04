import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
class App extends Component
{
  constructor(props){
    super(props);
    this.state ={
      notes:[]
    }
  }
  componentDidMount(){
    this.refreshNotes();
  }
  API_URL = "https://localhost:7242/";
  async refreshNotes(){
    fetch(this.API_URL+ "api/todo/").then(response=>response.json())
    .then(data=>{
      this.setState({notes:data});
    })
  }
  async refreshPage() {
    window.location.reload();
  }
  async addClick() {
  const newNotes = document.getElementById("newNotes").value;
  const data = {
    description: newNotes,
    priority: document.getElementById("priority").value,
    profile: document.getElementById("profile").value
  };
  console.log(data);
   const response = await fetch(this.API_URL + "api/todo/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => console.log(res))
    .then(res => res.json())
    .then(result => {
      alert(result.message || "Note added!");
     // this.refreshNotes();
      document.getElementById("newNotes").value = "";
    })
    .catch(err => {
      alert("Failed to add note.");
      console.error(err);
    });
}
  async deleteClick(id){
    try{
      const response = await fetch(this.API_URL+ "api/todo/"+id,{
        method: "DELETE",
      });
      const result = await response.json();
      console.log(result);
      this.refreshPage();
      alert(result);
     this.refreshPage();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }
  render() {
  const{notes}=this.state;
  return (
    <div className="App">
   <h2> Todo List</h2>
       <label>Description:</label>
   <input id = "newNotes"/>&nbsp;
    <label >priority:</label>
      <select name="priority" id="priority">
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
      <label for="profile">profile:</label>
      <select name="profile" id="profile">
    <option value="personal">Personal</option>
    <option value="work">Work</option>
  </select>
   <button onClick={()=>this.addClick()}>Add note</button>
   {notes.map((note) =>
    <p key={notes.id}>
      <b>* {note.description}</b> - {note.priority} - {note.profile}
         <button onClick={()=>this.deleteClick(note.id)}>del note</button>
      </p>
    
   )}
    </div>
  );
}
}



export default App;
