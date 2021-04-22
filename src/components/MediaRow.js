import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Link as RouterLink} from 'react-router-dom';
import {GridListTileBar, IconButton, makeStyles} from '@material-ui/core';
import PageviewIcon from '@material-ui/icons/Pageview';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import {withRouter} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const MediaRow = ({file, ownFiles, history, deleteMedia}) => {
  const classes = useStyles();

  let desc = {}; // jos kuva tallennettu ennen week4C, description ei ole JSONia
  try {
    desc = JSON.parse(file.description);
    console.log(desc);
  } catch (e) {
    desc = {description: file.description};
  }

  return (
    <>
      <img
        src={uploadsUrl + file.thumbnails?.w320}
        alt={file.title}
        style={{
          filter: `
            brightness(${desc.filters?.brightness}%)
            contrast(${desc.filters?.contrast}%)
            saturate(${desc.filters?.saturate}%)
            sepia(${desc.filters?.sepia}%)
            `,
        }}
      />
      <GridListTileBar
        title={file.title}
        subtitle={ownFiles || desc.description}
        actionIcon={
          <>
            <IconButton
              aria-label={`info about ${file.title}`}
              component={RouterLink}
              to={
                {
                  pathname: '/single',
                  state: file,
                }
              }
              className={classes.icon}
            >
              <PageviewIcon fontSize="large"/>
            </IconButton>
            {ownFiles &&
            <>
              <IconButton
                aria-label={`modify file`}
                className={classes.icon}
                component={RouterLink}
                to={
                  {
                    pathname: '/modify',
                    state: file,
                  }
                }
              >
                <CreateIcon fontSize="large"/>
              </IconButton>
              <IconButton
                aria-label={`delete file`}
                className={classes.icon}
                onClick={() => {
                  try {
                    const conf = confirm('Do you really want to delete?');
                    if (conf) {
                      deleteMedia(file.file_id, localStorage.getItem('token'));
                    }
                  } catch (e) {
                    console.log(e.message);
                  }
                }}
              >
                <DeleteIcon fontSize="large"/>
              </IconButton>
            </>
            }
          </>
        }
      />
    </>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object,
  ownFiles: PropTypes.bool,
  history: PropTypes.object,
  deleteMedia: PropTypes.func,
};

export default withRouter(MediaRow);
