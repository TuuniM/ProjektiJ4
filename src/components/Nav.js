import {Link as RouterLink} from 'react-router-dom';
import {useEffect, useContext, useState} from 'react';
import {useUsers} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Link,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Twitter';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Account from '@material-ui/icons/Person';
import Add from '@material-ui/icons/Add';
import {CloudUpload} from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(4),
  },
  title: {
    flexGrow: 1,
  },
}));


const Nav = ({history}) => {
  const classes = useStyles();
  const [user, setUser] = useContext(MediaContext);
  const [open, setOpen] = useState(false);
  const {getUser} = useUsers();

  const toggleDrawer = (opener) => () => {
    setOpen(opener);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await getUser(token);
        setUser(userData);
      } catch (e) {
        // send to login
        history.push('/');
      }
    };

    checkUser();
  }, []);

  return (
    <>
      <AppBar color="secondary">

        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon hidden/>
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            <Link component={RouterLink} to="/" color="inherit"></Link>
            {user &&
            <>
              <Button
                color="inherit"
                component={RouterLink}
                startIcon={<Account/>}
                to="/Profile"
              >
                Profiili
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/"
              >
              Kirjoita
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/"
              >
              Lue
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                startIcon={<Add/>}
                to="/Upload"
              >
                Luo uusi tarina
              </Button>
            </>
            }

          </Typography>

          {user ?
            <Button
              color="inherit"
              startIcon={<ExitToAppIcon/>}
              component={RouterLink}
              to="/logout"
            >
              Logout
            </Button> :
            <Button
              color="inherit"
              startIcon={<ExitToAppIcon/>}
              component={RouterLink}
              to="/login"
            >
              Login
            </Button>
          }
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <List>
          <ListItem
            button
            component={RouterLink}
            onClick={toggleDrawer(false)}
            to="/"
          >
            <ListItemIcon>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText primary="Home"/>
          </ListItem>
          {user &&
          <>
            <ListItem
              button
              component={RouterLink}
              onClick={toggleDrawer(false)}
              to="/profile"
            >
              <ListItemIcon>
                <AccountBoxIcon/>
              </ListItemIcon>
              <ListItemText primary="Profile"/>
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              onClick={toggleDrawer(false)}
              to="/upload"
            >
              <ListItemIcon>
                <CloudUpload/>
              </ListItemIcon>
              <ListItemText primary="Upload"/>
            </ListItem>
          </>
          }
        </List>
      </Drawer>
    </>
  );
};

Nav.propTypes = {
  history: PropTypes.object,
};


export default withRouter(Nav);
