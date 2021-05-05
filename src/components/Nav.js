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
  Button,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Link, Menu, MenuItem,
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
import React from 'react';
import {categories} from '../utils/variables';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggleDrawer = (opener) => () => {
    setOpen(opener);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await getUser(token);
        setUser(userData);

        if (
          categories
              .indexOf(window.location.pathname.substr(1).toLowerCase()) ===
              -1 &&
            categories
                .indexOf(window.location.pathname.substr(1).toLowerCase()) ===
                -1 &&
              window.location.pathname !== ('/valmis') &&
              window.location.pathname !== ('/info') &&
              window.location.pathname !== ('/single') &&
              window.location.pathname !== ('/kesken')) {
          history.push('/');
        }
      } catch (e) {
        // send to login
        if (window.location.pathname.includes('/myfiles') ||
        window.location.pathname.includes('/Upload')) {
          history.push('/login');
        }


        if (
          categories
              .indexOf(window.location.pathname.substr(1)) === -1 &&
            categories
                .indexOf(window.location.pathname.substr(1)) === -1 &&
              window.location.pathname !== ('/valmis') &&
              window.location.pathname !== ('/') &&
              window.location.pathname !== ('/info') &&
              window.location.pathname !== ('/single') &&
              window.location.pathname !== ('/kesken')) {
          history.push('/login');
        }
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
            <img src="../sdlogo.png"/>
          </a>
          <Typography variant="h6" className={classes.title}>
            <Link component={RouterLink} to="/" color="inherit"></Link>
            <Button
              color="inherit"
              component={RouterLink}
              to="/valmis"
            >Lue
            </Button>

            <Button
              color="inherit"
              component={RouterLink}
              to="/kesken"
            >Kirjoita
            </Button>


            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {
                categories.map((item) =>
                  <MenuItem key={item} onClick={handleClose}>
                    <Link component={RouterLink} to={item}
                      color="inherit">
                      {item[0].toUpperCase()+item.slice(1)}</Link>
                  </MenuItem>,
                )}
            </Menu>
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
            <Button aria-controls="simple-menu" aria-haspopup="true"
              onClick={handleClick} style={{color: 'white'}}>
              <SearchIcon />Hae kategorialla
            </Button>
            {user &&
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/info"
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
            to="/valmis"
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
              to="/kesken"
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
