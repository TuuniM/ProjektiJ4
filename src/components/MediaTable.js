import {useEffect} from 'react';
import MediaRow from './MediaRow';
import {useMedia} from '../hooks/ApiHooks';
import {
  CircularProgress,
  GridList,
  GridListTile,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const MediaTable = ({ownFiles, category}) => {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:697px)');

  const {updateMedia, picArray, loading,
    deleteMedia} = useMedia(true, ownFiles, category);

  // console.log('MediaTable', picArray, 'Category:', category);

  useEffect(()=>{
    updateMedia();
  }, [category]);


  return (
    <div className={classes.root}>
      <GridList
        cellHeight={320}
        className={classes.gridList}
        cols={matches ? 3 : 1}>
        {!loading ?
          picArray.map((item, idx) =>
            <GridListTile key={idx}>
              <MediaRow
                file={item}
                ownFiles={ownFiles}
                category={category}
                deleteMedia={deleteMedia}
              />
            </GridListTile>) :
          <GridListTile>
            <CircularProgress />
          </GridListTile>
        }
      </GridList>
    </div>
  );
};

MediaTable.propTypes = {
  ownFiles: PropTypes.bool,
  category: PropTypes.string,
};

export default MediaTable;
