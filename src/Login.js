import React, { useState } from "react";
import './styles.css';
import authenticateApi from './services/authenticateAPI';

function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const authObject = {
      username: username,
      password: password
    };
    try {
      const response = await authenticateApi.post('', authObject);
      if (response && response.data) {
        setToken(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Incorrect username or password.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  }

  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <span className="login-form-title">Welcome</span><br></br><br></br><br></br>       
          <form onSubmit={handleSubmit}>
            <div className="wrap-input">
              <input
                className={username !== "" ? "has-val input" : "input"}
                type="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Username"></span>
            </div>
            <div className="wrap-input">
              <input
                className={password !== "" ? "has-val input" : "input"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Password"></span>
            </div>
            <div>
              <button type="submit" className="login-form-btn">Login</button>
              {error && <p className="error">{error}</p>}
            </div>
          </form>
          <div className="text-center">
            <span className="txt1">
              Don't have an account?
            </span>
            <a className="txt2" href="#">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
