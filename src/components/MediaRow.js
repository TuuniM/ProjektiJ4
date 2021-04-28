import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Link as RouterLink} from 'react-router-dom';
import {GridListTileBar, IconButton, makeStyles} from '@material-ui/core';
import PageviewIcon from '@material-ui/icons/VisibilityOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import {withRouter} from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  icon: {
    color: 'rgba(255,255,255,0.9)',
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
      <GridListTileBar style={{background: 'rgb(3, 76, 78, 0.93)'}}
        title={file.title}
        subtitle={ownFiles}
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
                               aria-label={`delete file`}
                               className={classes.icon}
                               onClick={() => {
                                 try {
                                   // eslint-disable-next-line max-len
                                   const conf = confirm('Do you really want to delete?');
                                   if (conf) {
                                     // eslint-disable-next-line max-len
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
