import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import { passangersReset } from '../PersonInfoPage/actions';
import { tripsReset } from '../SearchPage/actions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  heroContent: {
    padding: theme.spacing(3, 0, 6),
  },
  textIndent: {
    textIndent: "1.5em"
  },
  heroButtons: {
    marginTop: theme.spacing(4),
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
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography component="h5" variant="h5" align="center" color="textPrimary" gutterBottom>
          Спасибо, что купили у нас билет.
        </Typography>
        <Typography className={classes.textIndent}>
          Если нам понадобится какая-либо информация по вашей поездке, мы свяжемся с вами
          по контактным номерам указанным в билете.
        </Typography>
        <Typography className={classes.textIndent}>
          За день до поездки с 19:00 до 20:00 ожидайте смс с номером водителя и маркой машины. В указанный диапазон сбора
          будьте готовы. За 5-10 минут до прибытия вам позвонит водитель.
        </Typography>
        <Typography className={classes.textIndent}>
          Телефон диспетчерской <phone>8937464600</phone>
        </Typography>
        <Grid container spacing={2} justify="center" className={classes.heroButtons}>
          <Grid item>
            <Button onClick={handleClick} variant="contained" color="primary">Купить обратный билет</Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default connect()(OrderSuccessPage);
