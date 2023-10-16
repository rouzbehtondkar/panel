import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { useAuthDispatch, useAuthState } from "../../../context/Auth-context";
import { actionTypes } from "../../../context/Reducer";
import { style } from "../../unauthorized/login/style.css";
import Password from "antd/es/input/Password";

const fetchToken=async (username,password)=>{
  return axios
  .post('https://dummyjson.com/auth/login',{
    username,
    password,
  })
  .then((response)=>((response && response?.data))
  );
}


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const [accessToken,setAccessToken]=useState(null);
  const [refreshToken,setRefreshToken]=useState(null);
  console.log(refreshToken)
  const [user,setUser]=useState(null);
  console.log(user)
  const { loading } = useAuthState();
  const dispatch = useAuthDispatch();
  const handleLogin = (event) => {
    event.preventDefault();
    dispatch({
        type: actionTypes.LOGIN_REQUEST,
      });
    fetchToken(username, password).then((res) => {
      console.log(res)
      if (res) {
        setAccessToken(res.token)
        setUser(res.user)
        setRefreshToken(res.refreshToken)
     
      }
    });
  };
  const fetchCurrentUserInfo=async(token)=>{
    return axios.get('http://localhost:3001/users/me',{
      headers:{                                               //explian about headers=>send data in axisos what is this?
        Authorization:token
      }
    }
    ).then(response=> console.log(response.data));
  }
  useLayoutEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      dispatch(
        {
          type: actionTypes.LOGIN_REQUEST,
        },
        [dispatch]
      );
      setToken(token);
    }
  }, []);
 
  useEffect(() => {
    if (token) {
      fetchCurrentUserInfo(token).then(({res }) => {
        if (res) {
          debugger
          localStorage.setItem("token", token);
          localStorage.setItem("RToken", refreshToken);
          localStorage.setItem("user", user);
          dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            // payload: {
            //   user: data,
            //   token,
            // },
          });
        }
      });
    }
  }, [token, dispatch]);
 
  return (
    <>
      {/* {loading ? ( */}
        {/* <p>loading</p> */}
      {/* ) : ( */}
        <div className="login">
          <h1>Login</h1>
          <form method="post" onSubmit={handleLogin}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              required="required"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required="required"
            />
            <button
              type="submit"
              className="btn btn-primary btn-block btn-large"
            >
              Let me in.
            </button>
          </form>
        </div>
      {/* )} */}
    </>
  );
}
