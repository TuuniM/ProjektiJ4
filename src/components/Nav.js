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
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Book';
// import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Account from '@material-ui/icons/Person';
// import Bell from '@material-ui/icons/NotificationsNone';
import Create from '@material-ui/icons/Create';
import Add from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(4),
  },
  title: {
    [theme.breakpoints.up('md')]: {
      display: 'block',
      flexGrow: 1,
    },
    display: 'none',
  },
  buttonCollapse2: {
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    display: 'none',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    display: 'block',
    flex: 1,
  },
  logout: {
    [theme.breakpoints.up('md')]: {
      display: 'block',
      flexGrow: 1,
    },
    display: 'none',
    flexGrow: 1,
  },
  logo: {
    [theme.breakpoints.up('md')]: {
      display: 'block',
      flexGrow: 0,
    },
    display: 'block',
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
      <AppBar style={{background: '#034c4e'}} >

        <Toolbar>
          <a className={classes.drawer}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >

              <MenuIcon fontSize="large"/>

            </IconButton>
          </a>
          <a className={classes.logo}>
            <img src="sdlogo.png"/>
          </a>
          <Typography variant="h6" className={classes.title}>
            <Link component={RouterLink} to="/" color="inherit"></Link>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
            >Lue
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
            >Kirjoita
            </Button>
            {user &&
            <>
              <Button
                color="inherit"
                component={RouterLink}
                // startIcon={<Add/>}
                to="/Upload"
              >
                Luo uusi tarina
              </Button>
            </>
            }

          </Typography>

          <a className={classes.buttonCollapse2}>
            {user &&
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/Info"
              >
                <InfoOutlinedIcon fontSize="large"/>
                Info
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/Profile"
              >
                <Account fontSize="large"/>
                Profiili
              </Button>
            </>
            }
          </a>
          {user ?
            <Button
              color="inherit"
              component={RouterLink}
              to="/logout"
            >
              <ExitToAppIcon fontSize="large"/>
              <a className={classes.logout}>
                Kirjaudu Ulos
              </a>
            </Button> :
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
            >
              <ExitToAppIcon fontSize="large"/>
              <a className={classes.logout}>
                Kirjaudu Sisään
              </a>
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
            <ListItemIcon style={{color: '#0e7b81'}}>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText primary="Lue"/>
          </ListItem>
          {user &&
          <>
            <ListItem
              button
              component={RouterLink}
              onClick={toggleDrawer(false)}
              to="/"
            >
              <ListItemIcon style={{color: '#0e7b81'}}>
                <Create/>
              </ListItemIcon>
              <ListItemText primary="Kirjoita"/>
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              onClick={toggleDrawer(false)}
              to="/upload"
            >
              <ListItemIcon style={{color: '#0e7b81'}}>
                <Add/>
              </ListItemIcon>
              <ListItemText primary="Uusi Tarina"/>
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              onClick={toggleDrawer(false)}
              to="/profile"
            >
              <ListItemIcon>
                <PersonIcon style={{color: '#0e7b81'}}/>
              </ListItemIcon>
              <ListItemText primary="Profiili"/>
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              onClick={toggleDrawer(false)}
              to="/info"
            >
              <ListItemIcon style={{color: '#0e7b81'}}>
                <InfoIcon/>
              </ListItemIcon>
              <ListItemText primary="Info"/>
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
