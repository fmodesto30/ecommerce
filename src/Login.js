import React, { useState } from "react";
import './styles.css';
import authenticateApi from './services/authenticateAPI';
import CreateAccount from './CreateAccount';

function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const authObject = {
      username: username,
      password: password
    };

    localStorage.setItem('username', username);

    // Check if either username or password is empty
    if (!username || !username.trim() || !password || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await authenticateApi.post('', authObject);
      if (response && response.data) {
        setToken(response.data);   
        sessionStorage.removeItem('token');
        localStorage.setItem('token', response.data);       
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Incorrect username or password.');
      } else {
        console.log(error)
        setError('An error occurred. Please try again.');
      }
    }
  }


  const handleCreateAccount = e => {
    e.preventDefault();
    setShowCreateAccount(true);
  }

  return (
    <div className="container">
      {showCreateAccount ? (
        <CreateAccount />
      ) : (
        <div className="container-login">
          <div className="wrap-login">
            <React.Fragment>
              <span className="login-form-title">Welcome</span><br></br><br></br>
              {error && <p className="error">{error}</p>}<br></br><br></br><br></br>
              <form onSubmit={handleSubmit}>
                <div className="wrap-input">
                  <input
                    className={username !== '' ? 'has-val input' : 'input'}
                    type="text"
                    value={username}
                    onChange={e => setUserName(e.target.value)}
                  />
                  <span className="focus-input" data-placeholder="Username" />
                </div>
                <div className="wrap-input">
                  <input
                    className={password !== '' ? 'has-val input' : 'input'}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <span className="focus-input" data-placeholder="Password" />
                </div>
                <div>
                  <button type="submit" className="login-form-btn">Login</button>
                </div>
              </form>
              <div className="text-center">
                <span className="txt1">Don't have an account? </span>
                <button className="txt2 link-like-button" onClick={handleCreateAccount}>Create one</button>
              </div>
            </React.Fragment>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
