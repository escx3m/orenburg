import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import PassengerInfoDialog from './components/PassengerInfoDialog';
import { updatePassenger, addPassenger, sendOrder } from './actions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  title: {
    fontSize: 14,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const PersonInfoPage = (props) => {
  const [open, setOpen] = React.useState(false);
  const [passengerValues, setPassengerValues] = React.useState({});
  const [currentIndex, setCurrentIndex] = React.useState(-1);

  const handleClickOpen = (passengerValues, index) => () => {
    setCurrentIndex(index);
    setPassengerValues(passengerValues);
    setOpen(true);
  }

  const handleClose = () => {
    setPassengerValues({});
    setOpen(false);
  }

  const classes = useStyles();

  const { 
    passengers,
    seats,
    cityFrom,
    cityTo,
    cityFromText,
    cityToText,
    dateText,
    timeText,
    addPassenger,
    updatePassenger,
    sendOrder,
    loading,
    error,
    orderSuccess,
    history,
  } = props;

  const handleOrderButtonClick = (passengers) => {
    sendOrder(passengers, () => history.push('/orderSuccess'))
  }

  const readyToOrder = passengers.length === seats;
  const totalPrice = passengers.reduce((sum, { ticketPrice, child }) => {
    return child ? sum + ticketPrice - 100 : sum + ticketPrice;
  }, 0);

  console.log('props', props);

  return (
    <div>
      <Typography variant="h5" component="h2" align="center">
        {cityFromText} - {cityToText}
      </Typography>
      <Typography variant="h5" color="textSecondary" align="center">
        {dateText} {timeText}
      </Typography>
      <Grid container spacing={2} className={classes.root}>
        {passengers.map(({ lastName, firstName, middleName, phone, addressFrom, addressTo }, index) => (
          <Grid key={seats - index} item xs={12}>
            <Divider />
              <Grid container justify="center" spacing={1} className={classes.root}>
                <Grid item xs={8}>
                  <Typography variant="h5" component="h2">
                    {`${lastName} ${firstName} ${middleName}`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {`тел: ${phone}`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    откуда: {addressFrom}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    куда: {addressTo} 
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Grid container justify="flex-end">
                    <IconButton onClick={handleClickOpen(passengers[index], index)} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
          </Grid>
        ))}
        {Array.from({ length: seats - passengers.length }).map((_, index) => (
          <Grid key={index} item xs={12}>
            <Divider />
              <Grid container justify="center" spacing={1} className={classes.root}>
                <Button onClick={handleClickOpen({}, -1)} size="large" variant="outlined" className={classes.margin}>
                  пассажир №{passengers.length + index + 1}
                </Button>
              </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          {readyToOrder
            ? <Typography variant="h5" component="h2" align="center">
                Итого к оплате: {totalPrice} р.
              </Typography>
            : <Typography variant="h5" component="h2" align="center">
                Заполните данные пассажиров
              </Typography>
          }
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Button disabled={!readyToOrder} onClick={() => handleOrderButtonClick(passengers)} variant="contained" color="primary">Оформить бронь</Button>
          </Grid>
        </Grid>
        {error &&
          <Grid item xs={12}>
            <Grid container justify="center">
              {loading && <CircularProgress disableShrink />}
              {error && <Typography variant="h5" color="textSecondary" align="center">
                Ошибка. Попробуйте еще раз.
              </Typography>}
            </Grid>
          </Grid>
        }
        
      </Grid>
      <PassengerInfoDialog
        open={open}
        handleClose={handleClose}
        addPassenger={addPassenger}
        updatePassenger={updatePassenger}
        currentIndex={currentIndex}
        passengerValues={passengerValues}
        cityFrom={cityFrom}
        cityTo={cityTo}
        cityFromText={cityFromText}
        cityToText={cityToText}
      />
    </div>
  );
};

const mapStateToProps = ({ trips: { seats, cityFrom, cityTo, cityFromText, cityToText, dateText, timeText }, passengers, order: { loading, error, orderSuccess } }) => ({
  seats,
  cityFrom,
  cityTo,
  cityFromText,
  cityToText,
  dateText,
  timeText,
  passengers,
  loading,
  error,
  orderSuccess,
})

export default connect(mapStateToProps, { addPassenger, updatePassenger, sendOrder })(PersonInfoPage);
