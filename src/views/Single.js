import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  CardMedia, List, ListItem, ListItemAvatar,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import BackButton from '../components/BackButton';
import {useTag, useUsers} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';

const useStyles = makeStyles({
  root: {
    maxWidth: '100%',
  },
  media: {
    height: '50vh',
  },
});

const Single = ({location}) => {
  const [owner, setOwner] = useState(null);
  const [avatar, setAvatar] = useState('avatarphoto.png');
  const classes = useStyles();
  const {getUserById} = useUsers();
  const {getTag} = useTag();

  const file = location.state;
  let desc = {}; // jos kuva tallennettu ennen week4C, description ei ole JSONia
  try {
    desc = JSON.parse(file.description);
    console.log(desc);
  } catch (e) {
    desc = {description: file.description};
  }

  useEffect(()=>{
    (async () => {
      try {
        setOwner(await getUserById(localStorage.getItem('token'),
            file.user_id));
        const result = await getTag('avatar_'+file.user_id);
        if (result.length > 0) {
          const image = result.pop().filename;
          setAvatar(uploadsUrl + image);
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, []);

  if (file.media_type === 'image') file.media_type = 'img';


  return (
    <>
      <BackButton />
      <Typography
        component="h1"
        variant="h2"
        gutterBottom
      >
        {file.title}
      </Typography>
      <Paper elevation="3">
        <Card className={classes.root}>
          <CardMedia
            component={file.media_type}
            controls
            className={classes.media}
            image={uploadsUrl + file.filename}
            title={file.title}
            style={{
              filter: `
                      brightness(${desc.filters?.brightness}%)
                      contrast(${desc.filters?.contrast}%)
                      saturate(${desc.filters?.saturate}%)
                      sepia(${desc.filters?.sepia}%)
                      `,
            }}
          />
          <CardContent>
            <Typography gutterBottom>{desc.description}</Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar variant={'circle'} src={avatar} />
                </ListItemAvatar>
                <Typography variant="subtitle2">{owner?.username}</Typography>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};

Single.propTypes = {
  location: PropTypes.object,
};

export default Single;
