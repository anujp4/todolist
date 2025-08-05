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
  OriginalNotes = [];
  LastProfile = "";

  componentDidMount(){
    try {
      this.refreshNotes();
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }
  API_URL = "https://localhost:7242/";
  async refreshNotes(){
    try {
    fetch(this.API_URL+ "api/todo/").then(response=>response.json())
    .then(data=>{
      this.OriginalNotes = data; // Store the original notes
      this.setState({notes:data});
    })} catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to fetch notes.");
    }
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
      console.error(err);
      this.refreshPage();
      //alert("Failed to add note.");
      
    });
}
  async deleteClick(id){
    try{
      const response = await fetch(this.API_URL+ "api/todo/"+id,{
        method: "DELETE",
      });
          this.refreshPage();
      const result = await response.json();
    
      this.refreshPage();
      alert(result);
    } catch (error) {
       console.error("Error deleting note:", error);
       this.refreshPage();
     
    }
  }
filterByProfile(profile) {
  this.LastProfile = profile;
  const { notes } = this.state;
  if (!profile) {
    this.setState({ notes: this.OriginalNotes }); // Reset to all notes if query is empty
  } else {
    const filteredNotes = this.OriginalNotes.filter(note => note.profile === profile);
    this.setState({ notes: filteredNotes });
  }
}
searchNotes(query) {
  const { notes } = this.state;
  if (!query) {
    this.setState({notes: this.OriginalNotes}); // Reset to all notes if query is empty
  }else{
   const filteredNotesbySearch = this.OriginalNotes.filter(note =>
    note.description.toLowerCase().includes(query.toLowerCase()));
     this.setState({ notes: filteredNotesbySearch });

}
}
  async refreshPage() {

    window.location.reload();
    this.filterByProfile(this.LastProfile);
  }
  render() {
  const{notes}=this.state;
  return (
    <div className="App">
   <h2> Todo List</h2>

       <label>Description:</label>
   <input required id = "newNotes"/>&nbsp;
    <label >priority:</label>
      <select name="priority" id="priority">
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
      <label>profile:</label>
      <select name="profile" id="profile">
    <option value="personal">Personal</option>
    <option value="work">Work</option>
  </select>
   <button onClick={()=>this.addClick()}>Add note</button>
   <br />
   <button onClick={()=>this.filterByProfile("")}>View All</button> &nbsp;&nbsp;
   <button onClick={()=>this.filterByProfile("personal")}>View Personal</button> &nbsp;&nbsp;
    <button onClick={()=>this.filterByProfile("work")}>View Work</button>
    <br />

       <label>Search:</label>
   <input id = "searchNotes" onChange={(e) => this.searchNotes(e.target.value)} />&nbsp;
   {notes.map((note) =>
      <div key={note.id}>
        <p>
          <label>Mark done:</label>
           <input type="checkbox" id="markdone" />
          <b>* {note.description}</b> - {note.priority} - {note.profile}
          <button onClick={()=>this.deleteClick(note.id)}>del note</button>
        </p>
      </div>
   )}
    </div>
  );
}
}



export default App;
