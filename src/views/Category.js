import MediaTable from '../components/MediaTable';
import {Typography} from '@material-ui/core';
import {useParams} from 'react-router-dom';
import {withRouter} from 'react-router-dom';


const Category = () => {
  const {category} = useParams();

  const getCategoryTitle = () => {
    let categoryTitle = '';
    if (category == 'valmis') {
      categoryTitle = 'Lue';
    } else {
      categoryTitle = category[0].toUpperCase()+category.slice(1).toLowerCase();
    }

    return categoryTitle;
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom>{getCategoryTitle()}</Typography>
      <MediaTable ownFiles={false} category={category}/>
    </>
  );
};

export default withRouter(Category);
