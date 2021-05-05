import MediaTable from '../components/MediaTable';
import {Typography} from '@material-ui/core';

const Home = () => {
  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom>Kaikki tarinat</Typography>
      <MediaTable ownFiles={false}/>
    </>
  );
};

export default Home;
