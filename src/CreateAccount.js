import React, { useState } from "react";
import './styles.css';
import newUserApi from "./services/newUserAPI";
import Login from './Login';

function InputComponent({ value, setValue, type, placeholder }) {
  return (
    <div className="wrap-input">
      <input
        className={value !== '' ? 'has-val input' : 'input'}
        type={type}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <span className="focus-input" data-placeholder={placeholder} />
    </div>
  );
}

function CreateAccount() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCreated, setIsCreated] = useState(false);  // New state for successful creation
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsCreated(false); // Resetting the state on new submission

    const newUser = {
      username: username,
      password: password,
      email: email
    };

    if (!username.trim() || !password.trim() || !email.trim()) {
      setError('All fields are required !');
      return;
    }

    try {
      const response = await newUserApi.post('', newUser);
      console.log(response.data);
      setIsCreated(true); // Set successful creation to true when API call succeeds
      setSuccess('Account created successfully !');
      setError('');
    } catch (error) {
      setIsCreated(false); // Ensure state is set to false on error
      if (error.response && error.response.status === 403) {
        setError('An error occurred. Please try again !');
      } else if (error.response && error.response.status === 409) {
        setError('This user already exists !');
      }
    }
    setUserName('');
    setPassword('');
    setEmail('');
  }

  const handleLogin = e => {
    e.preventDefault();
    setShowLogin(true);
  }

  return (
    <div className="container">
      {showLogin ? (
        <Login />
      ) : (
        <div className="container-login">
          <div className="wrap-login">
            <form onSubmit={handleSubmit}>
              {error && <p className="error">{error}</p>}
              {isCreated && <p className="success">{success}</p>}
              <br /><br />
              <span className="login-form-title">Create Account</span>
              <br /><br />
              <InputComponent value={username} setValue={setUserName} type="text" placeholder="Username" />
              <InputComponent value={password} setValue={setPassword} type="password" placeholder="Password" />
              <InputComponent value={email} setValue={setEmail} type="email" placeholder="E-mail" />
              <div>
                <button type="submit" className="login-form-btn">Create</button>
              </div>
              <div className="text-center">
                <span className="txt1">Already have an account? </span>
                <button className="txt2 link-like-button" onClick={handleLogin}>Log in</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateAccount;
