import React from 'react';
import useForm from '../hooks/FormHooks';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {
  CircularProgress,
  Button,
  Grid,
  Typography,
  Slider,
  MenuItem, Card,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {ValidatorForm, TextValidator,
  SelectValidator} from 'react-material-ui-form-validator';
import useSlider from '../hooks/SliderHooks';
import BackButton from '../components/BackButton';
import {useState} from 'react';
import {categories} from '../utils/variables';

const Upload = ({history}) => {
  const {postMedia, loading} = useMedia();
  const {postTag, postCategoryTag} = useTag();
  const [category, setCategory] = useState('');

  const handleChange = (event) => {
    setCategory(event.target.value);
    console.log(event.target.value);
  };

  const validators = {
    title: ['required', 'minStringLength: 3'],
    // eslint-disable-next-line max-len
    description: ['minStringLength: 10'],
    category: ['required'],
  };

  const errorMessages = {
    title: ['Otsikko', 'Vähintään 3 merkkiä'],
    description: ['Vähintään 10 merkkiä'],
    category: ['Valitse kategoria!'],
  };

  const doUpload = async () => {
    try {
      const fd = new FormData();
      fd.append('title', inputs.title);
      const desc = {
        description: inputs.description,
        filters: sliderInputs,
      };
      fd.append('description', JSON.stringify(desc));
      fd.append('file', inputs.file);
      const result = await postMedia(fd, localStorage.getItem('token'));
      const tagResult = await postTag(
          localStorage.getItem('token'),
          result.file_id,
      );

      if (tagResult) {
        const categoryTag = await postCategoryTag(
            localStorage.getItem('token'),
            result.file_id,
            category,
        );
        console.log(categoryTag);
      }
      console.log('doUpload', result, tagResult);
      history.push('/');
    } catch (e) {
      alert(e.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit, handleFileChange, setInputs} =
    useForm(doUpload, {
      title: '',
      description: '',
      file: null,
      dataUrl: '',
    });

  const [sliderInputs, handleSliderChange] = useSlider({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    sepia: 0,
  });


  useEffect(() => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setInputs((inputs) => ({
        ...inputs,
        dataUrl: reader.result,
      }));
    });

    if (inputs.file !== null) {
      if (inputs.file.type.includes('image')) {
        reader.readAsDataURL(inputs.file);
      } else {
        setInputs((inputs) => ({
          ...inputs,
          dataUrl: 'logo512.png',
        }));
      }
    }
  }, [inputs.file]);


  return (
    <>
      <BackButton />
      <Card>
        <Grid container>
          <Grid item xs={12}>
            <Typography style={{display: 'flex', margin: '25px'}}
              component="h4"
              variant="h4"
              gutterBottom
              color="green"
            >

              Luo uusi tarina
            </Typography>
          </Grid>
          <Grid item>
            {!loading ?
              <ValidatorForm onSubmit={handleSubmit}>
                <Grid container>
                  <Typography style={{display: 'flex', margin: 'auto'}}
                    component="h5"
                    variant="h5"
                    gutterBottom
                  >
                    Tarinan otsikko
                  </Typography>
                  <Grid item xs={10} style={{margin: 'auto', padding: '15px'}}>
                    <TextValidator
                      fullWidth
                      name="title"
                      label=""
                      value={inputs.title}
                      onChange={handleInputChange}
                      validators={validators.title}
                      errorMessages={errorMessages.title}
                    />
                  </Grid>
                  <Typography style={{display: 'flex', margin: 'auto'}}
                    component="h5"
                    variant="h5"
                    gutterBottom
                  >
                    Tarinan aloitus
                  </Typography>
                  <Grid item xs={10} style={{margin: 'auto', padding: '15px'}}>
                    <TextValidator
                      fullWidth
                      name="description"
                      label=""
                      value={inputs.description}
                      onChange={handleInputChange}
                      validators={validators.description}
                      errorMessages={errorMessages.description}
                    />
                  </Grid>
                  <Grid item xs={10} style={{margin: 'auto', padding: '15px'}}>
                    <Typography style={{display: 'flex', margin: 'auto'}}
                      component="h5"
                      variant="h5"
                      gutterBottom
                    >
                      Lisää tarinaan liittyvä kuva tai video
                    </Typography>
                    <TextValidator style={{margin: 'auto', padding: '15px'}}
                      fullWidth
                      type="file"
                      name="file"
                      accept="image/*, audio/*, video/*"
                      onChange={handleFileChange}
                    />
                  </Grid>
                  <Typography style={{display: 'flex', margin: 'auto'}}
                    component="h5"
                    variant="h5"
                    gutterBottom
                  >
                    Valitse Kategoria
                  </Typography>
                  <Grid item xs={10} style={{display: 'flex', margin: 'auto'}}>
                    <div style={{display: 'flex', margin: 'auto',
                      padding: '15px'}}>
                      <SelectValidator
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={category}
                        label=""
                        onChange={handleChange}
                        validators={validators.category}
                        errorMessages={errorMessages.category}
                      >
                        {categories.map((item) =>
                          <MenuItem key={item} value={item}>
                            {item[0].toUpperCase()+item.slice(1)}
                          </MenuItem>,
                        )}
                      </SelectValidator>
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      margin="10px"
                      type="submit"
                      color="primary"
                      variant="contained"
                      fullWidth
                      style={{background: '#0e7b81'}}
                    >
                      Julkaise Tarina
                    </Button>
                  </Grid>
                </Grid>
                {inputs.dataUrl.length > 0 &&
                <Grid container
                  direction="column"
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={6}>
                    <img
                      src={inputs.dataUrl}
                      style={{
                        filter: `
                    brightness(${sliderInputs.brightness}%)
                    contrast(${sliderInputs.contrast}%)
                    saturate(${sliderInputs.saturate}%)
                    sepia(${sliderInputs.sepia}%)
                    `,
                        width: '100%',
                      }}
                    />
                  </Grid>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography>Brightness</Typography>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        name="brightness"
                        value={sliderInputs?.brightness}
                        valueLabelDisplay="on"
                        valueLabelFormat={(value) => value + '%'}
                        onChange={handleSliderChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Contrast</Typography>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        name="contrast"
                        value={sliderInputs?.contrast}
                        valueLabelDisplay="on"
                        valueLabelFormat={(value) => value + '%'}
                        onChange={handleSliderChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Saturation</Typography>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        name="saturate"
                        value={sliderInputs?.saturate}
                        valueLabelDisplay="on"
                        valueLabelFormat={(value) => value + '%'}
                        onChange={handleSliderChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Sepia</Typography>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        name="sepia"
                        value={sliderInputs?.sepia}
                        valueLabelDisplay="on"
                        valueLabelFormat={(value) => value + '%'}
                        onChange={handleSliderChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                }
              </ValidatorForm> :
              <CircularProgress/>
            }
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

Upload.propTypes =
  {
    history: PropTypes.object,
  };


export default Upload;
