import "./App.css";

import firebase from "firebase/app";

import "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { useState } from "react";

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();

  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
  });

  const handleSignInBtn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        console.log(res);
        const { displayName, email } = res.user;
        const userInfo = {
          isSignedIn: true,
          displayName: displayName,
          email: email,
        };
        setUser(userInfo);
      });
  };

  const handleSignOutBtn = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        const userSignOut = {
          isSignedIn: false,
          name: "",
          email: "",
        };
        setUser(userSignOut);
      });
  };

  const handleForm = (e) => {
    let isFieldValid = true;

    if (e.target.name === "email") {
      const isValidMail = /\S+@\S+\.\S+/.test(e.target.value);
      isFieldValid = isValidMail;
    }

    if (e.target.name === "password") {
      const isValidLength = e.target.value.length > 6;
      const isPassValid = /\d{1}/.test(e.target.value);
      isFieldValid = isValidLength && isPassValid;
    }

    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };

  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.success = "New user successfully created!";
          setUser(newUserInfo);
          console.log('Sign in user info', userCredential.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          setUser(newUserInfo);
        });
    }

    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.success = "New user successfully login!";
          setUser(newUserInfo);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          setUser(newUserInfo);
          updateUserName(user.name);
        });
    }

    e.preventDefault();
  };

  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name,
      })
      .then((res) => {
        console.log("successfully updated info",res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      {user.isSignedIn && (
        <div>
          <h2>Welcome Mr. {user.displayName.toUpperCase()}</h2>
          <p>Email: {user.email}</p>
        </div>
      )}
      {user.isSignedIn ? (
        <button onClick={handleSignOutBtn}>Sign Out</button>
      ) : (
        <button onClick={handleSignInBtn}>Sign In</button>
      )}

      {user.success ? (
        <p style={{ color: "green" }}>{user.success}</p>
      ) : (
        <p style={{ color: "red" }}>{user.error}</p>
      )}

      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
        id=""
      />
      <label htmlFor="newUser">New User Sign Up</label>

      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            type="text"
            name="name"
            onBlur={handleForm}
            placeholder="Enter name"
          />
        )}
        <br />
        <input
          type="text"
          name="email"
          onBlur={handleForm}
          placeholder="Enter email"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          onBlur={handleForm}
          placeholder="Enter password"
          required
        />
        <br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
    </div>
  );
}

export default App;
