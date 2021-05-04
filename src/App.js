import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Nav from './components/Nav';
import Home from './views/Home';
import Profile from './views/Profile';
import Single from './views/Single';
import Login from './views/Login';
import Logout from './views/Logout';
import Upload from './views/Upload';
import {MediaProvider} from './contexts/MediaContext';
import {Container} from '@material-ui/core';
import MyFiles from './views/MyFiles';
import Modify from './views/Modify';
import Category from './views/Category';
import Info from './views/Info';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <MediaProvider>
        <Container maxWidth="md">
          <Nav />
          <main style={{marginTop: 80, marginBottom: 40}}>
            <Switch>
              <Route path="/login" component={Login}/>
              <Route path="/profile" component={Profile}/>
              <Route path="/single" component={Single}/>
              <Route path="/logout" component={Logout}/>
              <Route path="/upload" component={Upload}/>
              <Route path="/myfiles" component={MyFiles}/>
              <Route path="/modify" component={Modify}/>
              <Route path="/info" component={Info}/>
              <Route path="/:category" exact component={Category}/>
              <Route path="/" exact component={Home}/>
            </Switch>
          </main>
        </Container>
      </MediaProvider>

    </Router>
  );
};

export default App;
