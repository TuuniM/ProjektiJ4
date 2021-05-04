import {Typography} from '@material-ui/core';
import BackButton from '../components/BackButton';
import React from 'react';
import ReactPlayer from 'react-player';

const Info = () => {
  return (
    <>
      <BackButton />
      <Typography
        component="h1"
        variant="h3"
        gutterBottom> </Typography>
      <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          url='https://youtu.be/yZ7U_JE6gek'
          width='100%'
          height='100%'
        />
      </div>
    </>
  );
};

export default Info;
