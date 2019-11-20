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
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  href: {
    textDecoration: "none",
  }
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
          Спасибо за покупку!
        </Typography>
        <br />
        <Typography align="center" >
          Если будет нужна дополнительная информация по поездке, мы с вами свяжемся.
        </Typography>
        <br />
        <Typography align="center" >
          За час до поездки Вам придёт смс с телефоном водителя и маркой машины.
        </Typography>
        <br />
        <Typography align="center" >
          В указанный интервал сбора пассажиров будьте готовы. Водитель вам позвонит за 5-20 минут до прибытия.
        </Typography>
        <br />
        <Typography align="center" >Круглосуточная диспетчерская:</Typography>
        <Typography variant="h5" align="center" >
          <a href="tel:+79228800333" className={classes.href}>8(922)880-0333</a> <br />
          <a href="tel:+79228888121" className={classes.href}>8(922)888-8121</a>
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
