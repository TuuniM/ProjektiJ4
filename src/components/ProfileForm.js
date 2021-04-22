import {useMedia, useTag, useUsers} from '../hooks/ApiHooks';
import {Grid, Typography, Button} from '@material-ui/core';
// import {useState} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useEffect} from 'react';
import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';

const ProfileForm = ({user, setUser, setUpdate}) => {
  const {putUser, getUser} = useUsers();
  const {postMedia} = useMedia();
  const {postTag} = useTag();

  const validators = {
    confirm: ['isPasswordMatch'],
    email: ['required', 'isEmail'],
    // eslint-disable-next-line max-len
    full_name: ['matchRegexp:^[a-zA-ZåäöÅÄÖ]+(([\',. -][a-zA-ZåäöÅÄÖ ])?[a-zA-ZåäöÅÄÖ]*)*$'],
  };

  const errorMessages = {
    confirm: ['salasanat eivät täsmää'],
    email: ['vaadittu kenttä', 'sähköposti väärää muotoa'],
    full_name: ['vain kirjamia siis hei pliis jooko'],
  };

  const doRegister = async () => {
    try {
      console.log('user muokkaus lomake lähtee');
      if (inputs.file) {
        const fd = new FormData();
        fd.append('title', inputs.username);
        fd.append('file', inputs.file);
        const fileResult = await postMedia(fd, localStorage.getItem('token'));
        const tagResult = await postTag(
            localStorage.getItem('token'),
            fileResult.file_id,
            'avatar_' + user.user_id,
        );
        console.log(fileResult, tagResult);
        if (fileResult) {
          alert(tagResult.message);
          setUpdate(true);
        }
      }
      delete inputs.confirm;
      delete inputs.file;
      const result = await putUser(inputs, localStorage.getItem('token'));
      console.log('doUpload', result);
      if (result) {
        alert(result.message);
        const userData = await getUser(localStorage.getItem('token'));
        setUser(userData);
        // reset form (password and confirm)
        setInputs((inputs) => ({
          ...inputs,
          password: '',
          confirm: '',
        }));
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const {inputs, setInputs, handleInputChange, handleSubmit, handleFileChange} =
    useForm(doRegister, user);

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch',
        (value) => (value === inputs.password),
    );
  }, [inputs]);


  // console.log('RegisterForm', inputs);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          component="h1"
          variant="h4"
          gutterBottom>Muokkaa profiilia</Typography>
      </Grid>
      <Grid item xs={12}>
        <ValidatorForm onSubmit={handleSubmit}>
          <Grid container>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                type="password"
                name="password"
                label="Salasana"
                value={inputs?.password}
                onChange={handleInputChange}
                validators={validators.password}
                errorMessages={errorMessages.password}
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                type="password"
                name="confirm"
                label="Vahvista salasana"
                value={inputs?.confirm}
                onChange={handleInputChange}
                validators={validators.confirm}
                errorMessages={errorMessages.confirm}
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                type="email"
                name="email"
                label="Sähköposti"
                onChange={handleInputChange}
                value={inputs?.email}
                validators={validators.email}
                errorMessages={errorMessages.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                type="text"
                name="full_name"
                label="Koko nimi"
                onChange={handleInputChange}
                value={inputs?.full_name}
                validators={validators.full_name}
                errorMessages={errorMessages.full_name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                type="file"
                name="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth
                color="primary"
                type="submit"
                variant="contained">
                Päivitä
              </Button>
            </Grid>
          </Grid>
        </ValidatorForm>
      </Grid>
    </Grid>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
  setUpdate: PropTypes.func,
};

export default ProfileForm;
