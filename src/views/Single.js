/* eslint-disable max-len */
import {uploadsUrl, appIdentifier} from '../utils/variables';
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
  Typography, Tooltip,
} from '@material-ui/core';
import BackButton from '../components/BackButton';
import CommentForm from '../components/CommentForm';
import {useTag, useUsers, useComments} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import Modal from '@material-ui/core/Modal';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

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
    width: `fit-content`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const flexContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  margin: '1px',
  alignItems: 'flex-start',
};


const Single = ({location, history}) => {
  const [owner, setOwner] = useState(null);
  const [avatar, setAvatar] = useState('logo512.png');
  const classes = useStyles();
  const {getUserById} = useUsers();
  const {getTag, getTagsByFileId} = useTag();
  const {getComments} = useComments();
  const [modalStyle] = useState(getModalStyle);
  const {postCategoryTag} = useTag();
  const [readyTag, setReady] = useState('Valmis');
  const [comments, setCommentsData]= useState(null);
  const [categories, setCategoryData]= useState(null);


  const file = location.state;
  let desc = {};
  try {
    desc = JSON.parse(file.description);
  } catch (e) {
    desc = {description: file?.description};
  }


  const markAsReady = async () => {
    try {
      const ready = await postCategoryTag(
          localStorage.getItem('token'),
          file.file_id,
          'Valmis',
      );
      console.log(ready);
      setReady('Valmis');
    } catch (e) {
      alert(e.message);
    }
    getCategory();
  };

  useEffect(() => {
    if (categories) {
      if (categories.filter((category) =>category.tag==='Valmis').length>0) {
        setReady('Valmis');
      } else {
        setReady('');
      }
    }
  }, [categories]);


  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const getCommentsit = async () => {
    try {
      const comments = await getComments(file.file_id);
      setCommentsData(comments);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getCategory = async () => {
    try {
      const categories = await getTagsByFileId(file.file_id);
      setCategoryData(categories);
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
        getCategory();
        getCommentsit();
      }
    })();

    return ()=>clearInterval(interval);
  }, [open]);

  if (file) {
    if (file.media_type === 'image') file.media_type = 'img';
  } else {
    history.push('/');
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Lisää katkelma</h2>
      <CommentForm fileId={file?.file_id}/>
    </div>
  );


  return (
    <>
      <BackButton />
      <Paper elevation="3">
        <Card className={classes.root}>
          <div style={{background: '#0e7b81'}}>
            <CardMedia
              component={file?.media_type}
              controls
              className={classes.media}
              image={uploadsUrl + file?.filename}
              title={file?.title}
              style={{
                width: '19%',
                height: '20%',
                filter: `
                    brightness(${desc.filters?.brightness}%)
                    contrast(${desc.filters?.contrast}%)
                    saturate(${desc.filters?.saturate}%)
                    sepia(${desc.filters?.sepia}%)
                    `,
              }}
            />

            <div style={{display: 'flex'}}>
              <List style={flexContainer}>

                {
                  categories?.filter((item) => item.tag.toLowerCase() != appIdentifier).map((singletag)=> {
                    return (<ListItem style={{width: 'auto'}} key={'single'+singletag.tag_id}>
                      <Button variant="outlined" style={{width: 'auto', color: '#fafafa', background: '#000'}} size="small" disabled>{singletag.tag}</Button>
                    </ListItem>
                    );
                  },
                  )
                }

              </List>
              <List>
                <ListItem style={{display: 'none'}}>
                  <ListItemAvatar>
                    <Avatar variant={'circle'} src={avatar} />
                  </ListItemAvatar>
                  <Typography variant="subtitle2" style={{color: 'white'}}>{owner?.username}</Typography>
                </ListItem>
              </List>
            </div>
            <Typography style={{margin: '50px', color: 'white'}}
              component="h4"
              variant="h4"
              gutterBottom
            >
              {file?.title}
            </Typography>
          </div>
          <CardContent>
            <Typography gutterBottom>{desc.description}</Typography>

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
            { (readyTag!=='Valmis') &&
            <Tooltip
              arrow
              title={(localStorage.getItem('token') == null) ? 'Kirjaudu sisään!' : ''}
              placement="top"
              aria-label="Lisää katkelma">
              <span>
                <Button
                  disabled={(localStorage.getItem('token') == null)}
                  variant="contained"
                  style={{color: '#fffff', background: '#0e7b81'}}
                  onClick={()=> {
                    handleOpen();
                  }}><AssignmentIcon style={{marginLeft: -10, marginRight: 5, color: 'white'}}/>
                  Lisää katkelma
                </Button>
              </span>
            </Tooltip>
            }
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
            {
              (readyTag!=='Valmis') &&
              <Tooltip
                arrow
                title={(localStorage.getItem('token') == null) ? 'Kirjaudu sisään!' : '' || (comments?.length < 5 && (localStorage.getItem('token') !== null)) ? 'Vaaditaan vähintään 5 katkelmaa' : '' }
                placement="top"
                aria-label="Merkkaa valmiiksi">
                <span>
                  <Button
                    disabled={(localStorage.getItem('token') == null) || (comments?.length < 5)}
                    variant="contained"
                    style={{color: '#fffff', background: '#0e7b81', margin: '5px'}}
                    onClick={()=> {
                      markAsReady();
                    }}>
                    <AssignmentTurnedInIcon style={{marginLeft: -10, marginRight: 5, color: 'white'}}/>
                    Merkitse valmiiksi
                  </Button>
                </span>
              </Tooltip>
            }
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};

Single.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default Single;

