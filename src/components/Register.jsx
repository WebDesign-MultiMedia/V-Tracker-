
import React, { useState } from 'react';
import '/src/index.css';
import { Link } from "react-router-dom";
import Login from "./Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarOn, faChartPie, faFileInvoice, faGaugeMed, faGaugeSimpleHigh } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import validation from "./RegisterVal"
import Font from 'react-font';

const Registers = () =>{
 
    const [values, setValues] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: ''
   })

   const [errors, setErrors] = useState({})

   const handleInput = (e) =>{
      setValues(prev => ({...prev, [e.target.name]: [e.target.value]}))
   }

   const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [RegisterData, setRegisterData] = useState('');

   const handleSubmit = async (e) =>{
      e.preventDefault();

      const UserRegisInfo = {firstName, lastName, email, password }

      try {
        // Send both POST requests at the same time
        const [registerResponse, loginResponse] = await Promise.all([
          fetch("http://localhost:8080/Register/add", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(UserRegisInfo),
          }),
          fetch("http://localhost:8080/Logins/add", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(UserRegisInfo), // You can modify this if login data is different
          })
        ]);
    
        if (registerResponse.ok && loginResponse.ok) {
          const registerData = await registerResponse.json();
          const loginData = await loginResponse.json();
          console.log('User registered:', registerData);
          console.log('User logged in:', loginData);
          
          setRegisterData(registerData);
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          
          alert("Registration and Login Successful");
          window.location.href = "/Login";
        } else {
          console.log("Failed to register or log in the user.");
        }
      } catch (error) {
        console.log("An error occurred:", error);
      }
      alert("Registration Successful");
      window.location.href = "/Login";
   }

    return(
        <>

<div className="flex justify-center space-x-4 flex-wrap h-14 bg-black ">
    <FontAwesomeIcon icon={faFileInvoice} className="text-3xl text-white  pr-4 relative top-5" />
    <FontAwesomeIcon icon={faChartPie} className="text-3xl text-white pr-10 relative top-5" />
    <FontAwesomeIcon icon={faGaugeMed} className="text-3xl text-white relative top-5"/>
    <FontAwesomeIcon icon={faCarOn} className="text-3xl text-white pl-5 relative top-5"/>
  </div>

<Font family='Graduate'>
    <div className="App flex items-center justify-center min-h-screen bg-black">
  <form 
    onSubmit={handleSubmit} htmlFor="Reg"
    className="relative bottom-64 -mb-px h-px w-80 bg-gradient-to-r from-transparent via-sky-300 to-transparent"
  >
    <fieldset className="space-y-4">
      <h2 className="text-2xl font-semibold text-center text-white ">Sign Up</h2>

      <div className="Field">
        <label className="block text-sm font-medium text-white" htmlFor="firstName">
          First name <sup>*</sup>
        </label>
        <input  
        id='firstName'

          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          name='firstName'
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          placeholder="First name"
        />
  {errors.firstName && <span className="text-red-600 absolute left-20 ">{errors.firstName}</span>}

      </div>

      <div className="Field">
        <label className="block text-sm font-medium text-white" htmlFor="lastName">Last name</label>
        <input 

          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={lastName}
          id='lastName'
          name='lastName'
          onChange={(e) => setLastName(e.target.value)}
        />
          {errors.lastName && <span className="text-red-600 absolute left-20">{errors.lastName}</span>}

      </div>

      <div className="Field">
        <label className="block text-sm font-medium text-white" htmlFor="email">
          Email address <sup>*</sup>
        </label>
        <input 
        id='email'
        autoComplete='email'
          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
          placeholder="Email address"
          name="email"
        />
          {errors.email && <span className="text-red-600 absolute left-28">{errors.email}</span>}

      </div>

      <div className="Field">
        <label className="block text-sm font-medium text-white" htmlFor="password">
          Password <sup>*</sup>
        </label>
        <input 
        id='password'
          className="text-red-400 mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
          name="password"
        />
          {errors.password && <span className="text-red-600 absolute left-24">{errors.password}</span>}
      </div>
  
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300 disabled:bg-gray-300"> 
        Create account
      </button>
    {/* {success && <p className="text-green-500 mt-4">Registration successful!</p>} */}

      <Link to="/Login"  className=" no-underline text-blue-700 bg-white inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200"> Login </Link>
    </fieldset>
  </form>
</div>
</Font>

        </>
    );
};

export default Registers;