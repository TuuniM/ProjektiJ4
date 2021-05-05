import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  List,
  ListItem, ListItemAvatar,
  ListItemIcon, ListItemText,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import BackButton from '../components/BackButton';
import {Link as RouterLink} from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import CreateIcon from '@material-ui/icons/Create';
import MenuBookIcon from '@material-ui/icons/MenuBook';

const Profile = () => {
  const [user, setUser] = useContext(MediaContext);
  const [avatar, setAvatar] = useState('avatarphoto.png');
  const [update, setUpdate] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const {getTag} = useTag();

  useEffect(() => {
    (async ()=>{
      try {
        const result = await getTag('avatar_'+user.user_id);
        if (result.length > 0) {
          const image = result.pop().filename;
          setAvatar(uploadsUrl + image);
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [user, update]);

  return (
    <>
      <BackButton />
      <Typography
        component="h1"
        variant="h3"
        gutterBottom>Profiili</Typography>
      {user &&
      <Card>
        <CardContent>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar variant={'square'} src={avatar} />
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={user.full_name} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary={user.email} />
            </ListItem>
            <ListItem component={RouterLink} to="/myfiles">
              <ListItemIcon>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText primary="Minun tarinat"/>
            </ListItem>
            <ListItem button onClick={()=> {
              setToggleForm(!toggleForm);
            }}>
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText
                primary=
                  {toggleForm ? 'Sulje muokkaus' : 'Muokkaa profiilia' }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      }
      {toggleForm &&
      <Grid>
        <ProfileForm user={user} setUser={setUser} setUpdate={setUpdate}/>
      </Grid>
      }
    </>
  );
};

export default Profile;


