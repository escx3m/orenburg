import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const OrderSuccessPage = (props) => {
  const { history, dispatch } = props;

  const handleClick = () => {
    history.push('/');
    dispatch({ type: 'reset' });
  }

  return (
    <div>
      <Typography variant="h5" component="h2" align="center">
        Бронь успешно оформлена!
      </Typography>
      <Button onClick={handleClick} variant="contained" color="primary">В начало</Button>
    </div>
  );
}

export default connect()(OrderSuccessPage);
