/* eslint-disable max-len */
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia, List, ListItem, ListItemAvatar,
  makeStyles,
  Paper,
  // TextField,
  Typography,
} from '@material-ui/core';
import BackButton from '../components/BackButton';
import CommentForm from '../components/CommentForm';
import {useTag, useUsers, useComments} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import Modal from '@material-ui/core/Modal';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  media: {
    height: '50vh',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const Single = ({location}) => {
  const [owner, setOwner] = useState(null);
  const [avatar, setAvatar] = useState('logo512.png');
  const classes = useStyles();
  const {getUserById} = useUsers();
  const {getTag} = useTag();
  const {getComments} = useComments();
  const [modalStyle] = useState(getModalStyle);

  const [comments, setCommentsData]= useState(null);

  const file = location.state;
  let desc = {}; // jos kuva tallennettu ennen week4C, description ei ole JSONia
  try {
    desc = JSON.parse(file.description);
    console.log(desc);
  } catch (e) {
    desc = {description: file.description};
  }

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const getCommentsit = async ()=> {
    try {
      const comments = await getComments(file.file_id);
      setCommentsData(comments);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(()=>{
    const interval=setInterval(()=>{
      getCommentsit();
    }, 10000);

    (async () => {
      if (!open) {
        try {
          setOwner(await getUserById(localStorage.getItem('token'), file.user_id));
          const result = await getTag('avatar_'+file.user_id);

          if (result.length > 0) {
            const image = result.pop().filename;
            setAvatar(uploadsUrl + image);
          }
        } catch (e) {
          console.log(e.message);
        }

        getCommentsit();
      }
    })();

    return ()=>clearInterval(interval);
  }, [open]);

  if (file.media_type === 'image') file.media_type = 'img';


  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Lisää katkelma</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
      <CommentForm fileId={file.file_id}/>
    </div>
  );


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

            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar variant={'circle'} src={avatar} />
                </ListItemAvatar>
                <Typography variant="subtitle2">{owner?.username}</Typography>
              </ListItem>
            </List>
            <Typography gutterBottom>{desc.description}</Typography>


            {/* <Typography>Comments:</Typography> */}
            <List>
              {
                comments?.map((singlecomment)=> {
                  return (<ListItem key={singlecomment.comment_id}>
                    <Typography>{singlecomment.comment}</Typography>
                  </ListItem>
                  );
                },
                )
              }
            </List>
            <Button variant="contained" color="primary" onClick={()=> {
              handleOpen();
            }}>Lisää katkelma</Button>
            <Modal
              open={open}
              onClose={handleClose}
              onSubmit={handleClose}
              keepMounted
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              {body}
            </Modal>
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
