import useForm from '../hooks/FormHooks';
import {useComments} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {Button, TextField} from '@material-ui/core';
// import {useContext} from 'react';
// import {MediaContext} from '../contexts/MediaContext';

const CommentForm = (fileId) => {
  // const {comment} = useContext(MediaContext);
  const {postComment} = useComments();

  const doComment = async () => {
    try {
      const fd={
        file_id: fileId.fileId,
        comment: inputs.comment,
      };

      const commentData = await postComment(
          fd, localStorage.getItem('token'));
      console.log('commentData:', commentData);
    } catch (e) {
      console.log('doComment', e.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(doComment, {
    comment: '',
  });

  return (
    <>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          name="comment"
          id="filled-multiline-static"
          label="My text:"
          multiline
          rows={10}
          fullWidth
          variant="filled"
          onChange={(e) =>handleInputChange(e)}
          value={inputs.comment}
        />
        <Button variant="contained" type="submit" fullWidth>Lisää</Button>
      </form>

    </>
  );
};

CommentForm.propTypes = {
  comment: PropTypes.object,
};


export default CommentForm;
