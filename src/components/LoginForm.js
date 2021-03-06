import {useContext} from 'react';
import useForm from '../hooks/FormHooks';
import {useLogin} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {Button, Grid, TextField, Typography} from '@material-ui/core';

const LoginForm = ({history}) => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useContext(MediaContext);
  const {postLogin} = useLogin();

  const doLogin = async () => {
    try {
      const userdata = await postLogin(inputs);
      localStorage.setItem('token', userdata.token);
      setUser(userdata.user);
      history.push('/');
    } catch (e) {
      console.log('doLogin', e.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(doLogin, {
    username: '',
    password: '',
  });

  // console.log('LoginForm', inputs, user);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          component="h1"
          variant="h2"
          gutterBottom>Kirjaudu sisään</Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid container item>
              <TextField
                fullWidth
                type="text"
                name="username"
                label="Käyttäjänimi"
                onChange={handleInputChange}
                value={inputs.username}
              />
            </Grid>
            <Grid container item>
              <TextField
                fullWidth
                type="password"
                name="password"
                label="Salasana"
                onChange={handleInputChange}
                value={inputs.password}
              />
            </Grid>

            <Grid container item>
              <Button
                fullWidth style={{background: '#0e7b81'}}
                color="primary"
                type="submit"
                variant="contained">
                Kirjaudu sisään
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

LoginForm.propTypes = {
  history: PropTypes.object,
};


export default withRouter(LoginForm);
