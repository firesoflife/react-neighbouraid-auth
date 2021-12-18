import React, { useState, useEffect, Fragment } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';
import Nav from './components/Nav';

import Home from './pages/public/Home';
import Dashboard from './pages/private/Dashboard';
import RegistrationLayout from './pages/public/RegistrationLayout';
import LoginLayout from './pages/public/LoginLayout';

const App = () => {
  const history = useHistory();
  const [loggedInStatus, setLoggedInStatus] = useState('NOT_LOGGED_IN');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:3001/logged_in', { withCredentials: true })
      .then((response) => {
        console.log('resp from server', response);
        if (response.data.logged_in && loggedInStatus === 'NOT_LOGGED_IN') {
          setLoggedInStatus('LOGGED_IN');
          setUserData(response.data.user);
        } else if (
          !response.data.logged_in &
          (loggedInStatus === 'LOGGED_IN')
        ) {
          setLoggedInStatus('NOT_LOGGED_IN');
          setUserData({});
        }
      })
      .catch((error) => {
        console.log('check login error', error);
      });
  }, []);

  const handleLogout = () => {
    setLoggedInStatus('NOT_LOGGED_IN');
    setUserData({});
  };

  const handleLogin = (data) => {
    setLoggedInStatus('LOGGED_IN');
    setUserData(data.user);
  };

  // const { loggedInStatus } = props.loggedInStatus;

  const handleSuccessfulAuth = (data) => {
    handleLogin(data);
    history.push('/dashboard');
  };

  const handleLogoutClick = () => {
    axios
      .delete('http://localhost:3001/logout', { withCredentials: true })
      .then((response) => {
        handleLogout();
      })
      .catch((error) => {
        console.log('logout error', error);
      });
  };

  return (
    <div className='flex flex-col bg-gray-900 h-screen'>
      <Fragment>
        <Nav handleLogoutClick={handleLogoutClick} />
        <Switch>
          <Route
            exact
            path={'/'}
            render={(props) => (
              <Home
                {...props}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                loggedInStatus={loggedInStatus}
                handleSuccessfulAuth={handleSuccessfulAuth}
              />
            )}
          />
          <Route
            exact
            path={'/dashboard'}
            render={(props) => (
              <Dashboard
                {...props}
                loggedInStatus={loggedInStatus}
                handleLogout={handleLogin}
              />
            )}
          />
          <Route
            exact
            path={'/signup'}
            render={(props) => (
              <RegistrationLayout
                {...props}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                loggedInStatus={loggedInStatus}
              />
            )}
          />
          <Route
            exact
            path={'/login'}
            render={(props) => (
              <LoginLayout
                {...props}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                loggedInStatus={loggedInStatus}
                handleSuccessfulAuth={handleSuccessfulAuth}
              />
            )}
          />
        </Switch>
      </Fragment>
    </div>
  );
};

export default App;
