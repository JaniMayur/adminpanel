import React from "react";
import axios from "axios";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser };

// ###########################################################

function loginUser(
  dispatch,
  loginValue,
  passwordValue,
  history,
  setIsLoading,
  setError,
) {
  setError(false);
  setIsLoading(true);

  if (loginValue && passwordValue) {
    axios
      .post("http://localhost:8000/adminLogin", {
        email: loginValue,
        password: passwordValue,
      })
      .then((response) => {
        setTimeout(() => {
          console.log("response", response);

          localStorage.setItem("id_token", response.data.Token);
          setError(null);
          setIsLoading(false);
          dispatch({ type: "LOGIN_SUCCESS" });

          history.push("/app/dashboard");
        }, 2000);
      })
      .catch((error) => {
        // console.log(error);
        setIsLoading(false);
        // if (error.response.status === 401 || error.response.status === 400) {
        //   setError(error.response.data.message);
        // } else {
        setError("Something Went Wrong.Try again later");
        // }
        // console.log("error", error);
      });

    // setTimeout(() => {
    // localStorage.setItem('id_token', 1)
    //   setError(null)
    //   setIsLoading(false)
    //   dispatch({ type: 'LOGIN_SUCCESS' })

    //   history.push('/app/dashboard')
    // }, 2000);
  }
  // else {
  //   dispatch({ type: "LOGIN_FAILURE" });
  //   setError(true);
  //   setIsLoading(false);
  // }
}

// function signOut(dispatch, history) {
//   localStorage.removeItem("id_token");
//   dispatch({ type: "SIGN_OUT_SUCCESS" });
//   history.push("/login");
// }
