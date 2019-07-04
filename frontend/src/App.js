import React, { Component } from 'react';
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted : false,
      activeItem: {
              title: "",
              description: "",
              completed: false
      },
      todolist: []
    };
  }

  componentDidMount() {
      this.refreshList();
  };

  refreshList = () => {
    console.log(axios.get("http://localhost:8000/api/todos/"))
    axios
      .get("http://localhost:8000/api/todos/")
      .then(res => this.setState( {todolist : res.data}))
      .catch(err => console.log(err));
  };

  displayCompleted = (status) => {
    return this.setState({ viewCompleted: status });
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
      const { viewCompleted } = this.state;
      const newItems = this.state.todolist.filter(
        (item) => item.completed === viewCompleted
      );
      return newItems.map( item => (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            className={`todo-title mr-2 ${
              this.state.viewCompleted ? "active" : ""
            }`}
            title={item.description}
            >
              {item.title}
          </span>
          <span>
            <button
              className="btn btn-secondry mr-2"
              onClick={() => this.editItem(item)}> Edit </button>
            <button
              className="btn btn-danger"
              onClick={() => this.handleDelete(item)}> Delete </button>
          </span>
        </li>
      ));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = item => {
    this.toggle();
      if (item.id) {
        axios
          .put(`http://localhost:8000/api/todos/${item.id}/`, item)
          .then(res => this.refreshList());
        return;
      }
      axios
        .post(`http://localhost:8000/api/todos/`, item)
        .then(res => this.refreshList());
  };

  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/todos/${item.id}`)
      .then(res => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  render(){
    return (
      <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-primary">Add task</button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
          ) : null}
      </main>
    );
  }
}
export default App;
