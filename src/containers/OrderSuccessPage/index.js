import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { passangersReset } from '../PersonInfoPage/actions';
import { tripsReset } from '../SearchPage/actions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

const OrderSuccessPage = (props) => {
  const { history, dispatch } = props;

  const handleClick = () => {
    history.push('/');
    dispatch(passangersReset());
    dispatch(tripsReset());
  }

  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" align="center">
          Бронь успешно оформлена!
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Button onClick={handleClick} variant="contained" color="primary">В начало</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default connect()(OrderSuccessPage);
