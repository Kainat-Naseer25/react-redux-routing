import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Row, Col } from 'reactstrap';
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavbar from "./Components/Navbar/navbar.js"
import DataForm from "./Components/Form/form.js"
import UserCard from "./Components/Card/card.js"
import UserLogin from "./Components/Login/login.js"
import DisplayUser from "./Components/DisplayUser/display.js"
import { useDispatch } from 'react-redux';

function App() {
  const [userData, setUserData] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);
  const [user, setUser] = useState({});

  const dispatch = useDispatch()
  useEffect(() => {
    console.log("run") 
    fetchData();
  }, []);

  // fetching users
  function fetchData() {
    console.log("run")
    fetch('https://dummyjson.com/users?limit=3&select=id,username,email,phone,gender,image')
      .then(res => res.json())
      .then(jsonData => {
        dispatch({ type: 'setAllUsers', payload: jsonData.users })
      })
  }

  // creating users
  const handleCreateUser = (user) => {
    fetch(`https://dummyjson.com/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'createUsers', payload: data })
      })
      .catch((error) => console.error(error));
  };

  // deleting users
  function handleDeleteUser(id) {
    fetch(`https://dummyjson.com/users/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({type:'deleteUser', payload:data.id})
      })
      .catch((error) => console.error(error));
  };

  //creating users
  useEffect(() => {
    if (userToEdit) {
      // directly spread all values from userToEdit to user state
      setUser({
        ...userToEdit,
      });
    }
  }, [userToEdit]);

  const updateUserData = (key, value) => {
    // dynamically  set user data based on key ie. username, gender
    setUser({
      ...user,
      [key]: value,
    });
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("run");
    const newData = { ...user };
  
    if (userToEdit) {
      fetch(`https://dummyjson.com/users/${userToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "editUser", payload: newData });
          setUser({});
          setUserToEdit(null);
        });
    } else {
      handleCreateUser(newData);
      setUser({});
    }
    console.log("userToEdit:", userToEdit);
    console.log("userData:", userData);
    console.log("user:", user);
    console.log("newData:", newData);
  };
       
  return (
    <BrowserRouter>
      <MyNavbar />

        <Routes>
          <Route exact   path="/" element={<UserLogin />}/>
          <Route
            path="/contacts"
            element={
              <div className="row"  style={{padding:'15px'}}>
                <Row>
                <Col md={{size: 5}}>
                <DataForm user={user} updateUserData={updateUserData} handleSubmit={handleSubmit} userToEdit={userToEdit}/>
                </Col>

                <Col md={{size: 7}}>
                <UserCard key={user.id} user={user} handleDeleteUser={handleDeleteUser} setUserToEdit={setUserToEdit}/>
                </Col>
                </Row>
              </div>
            }
          />
          <Route path="/displayUserData" element={<div className="container">
            <div className="row">
          
            <DisplayUser/>
            </div>
          </div>} />
        </Routes>
      
    </BrowserRouter>
  );
}
export default App;
           
