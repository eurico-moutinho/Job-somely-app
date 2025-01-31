import React, { useState, useEffect } from "react";
import axios from "axios";


const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem('authToken', token);
  }


  const authenticateUser = () => {

    const storedToken = localStorage.getItem('authToken'); 


    if (storedToken) {

      axios.get(
        `${process.env.REACT_APP_API_URL}/api/verify`,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
        .then((response) => {

          const payload = response.data;

          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(payload);
        })
        .catch((error) => {

          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {

      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  }


  const removeToken = () => {
    localStorage.removeItem("authToken"); // Upon logout, remove the token from the localStorage
  }


  const logOutUser = () => {
    removeToken(); // To log out the user, remove the token
    authenticateUser(); // and update the state variables
  }


  useEffect(() => {
    authenticateUser();
  }, []);


  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, storeToken, authenticateUser, logOutUser }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProviderWrapper, AuthContext };