import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button} from '@material-ui/core';
import {useState} from 'react';

const Login = () => {
  const [toggle, setToggle] = useState(true);

  const showHide = () => {
    setToggle(!toggle);
  };

  return (
    <>
      { toggle ? <LoginForm/> : <RegisterForm setToggle={setToggle}/> }
      {/* eslint-disable-next-line max-len */}
      <Button onClick={showHide}>{toggle ? 'Oletko uusi täällä? Luo tili tästä' : 'Oletko jo rekisteröitynyt? Kirjaudu sisään tästä'}</Button>
    </>
  );
};

export default Login;
