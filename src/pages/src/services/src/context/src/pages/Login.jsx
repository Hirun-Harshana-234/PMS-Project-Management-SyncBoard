import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){

    const [username,setUsername]=useState("");

    const [password,setPassword]=useState("");

    const {login,user}=useAuth();

    const navigate=useNavigate();

    useEffect(()=>{

        if(user){

            navigate("/");

        }

    },[]);

    const handleSubmit=(e)=>{

        e.preventDefault();

        const result=login(username,password);

        if(result.success){

            navigate("/");

        }else{

            alert(result.message);

        }

    }

    return(

        <div
        style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            height:"100vh"
        }}
        >

        <form
        onSubmit={handleSubmit}
        style={{
            width:"350px",
            padding:"30px",
            borderRadius:"10px",
            boxShadow:"0 0 10px rgba(0,0,0,.2)"
        }}
        >

        <h2>Login</h2>

        <input

        type="text"

        placeholder="Username"

        value={username}

        onChange={(e)=>setUsername(e.target.value)}

        required

        style={{
            width:"100%",
            padding:"10px",
            marginBottom:"20px"
        }}

        />

        <input

        type="password"

        placeholder="Password"

        value={password}

        onChange={(e)=>setPassword(e.target.value)}

        required

        style={{
            width:"100%",
            padding:"10px",
            marginBottom:"20px"
        }}

        />

        <button

        style={{
            width:"100%",
            padding:"12px"
        }}

        >

        Login

        </button>

        </form>

        </div>

    );

}