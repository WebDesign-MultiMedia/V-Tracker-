import React from "react";
import Navbar from './Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import RecordLog from './RecordLog';
import AutoParts from './AutoParts'
import bgimgVid from './video'
import video from './video'
import CustomerSupport from './CustomerSupport'
import Monitor from './Monitor'


const Homes = () =>{


    return(
        <>


        
      <div className="bg-black min-h-screen ">     
        <Navbar/>
        <RecordLog/>
                <Monitor/>
      <AutoParts/>
      </div>
</>
    )

}

export default Homes;