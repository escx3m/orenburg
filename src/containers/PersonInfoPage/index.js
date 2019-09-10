import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import ForwardIcon from '@material-ui/icons/Forward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import PassengerInfoDialog from './components/PassengerInfoDialog';
import { updatePassenger, addPassenger, sendOrder, passangersReset } from './actions';

const { ym } = window;

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
  const [prevPassengerValues, setPrevPassengerValues] = React.useState({});
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [showTakeFromPrevButton, setShowTakeFromPrevButton] = React.useState(false);
  
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
    passangersReset,
    sendOrder,
    loading,
    error,
    isSubmitting,
    history,
  } = props;

  useEffect(() => {
    if (!(!!cityFrom && !!cityTo)) {
      history.push('/');
    }
    passangersReset();
  }, []);

  const handleClickOpen = (passengerValues, index) => () => {
    setCurrentIndex(index);
    setPassengerValues(passengerValues);
    if (index === -1 && passengers.length > 0) {
      setShowTakeFromPrevButton(true);
      setPrevPassengerValues(passengers[passengers.length - 1]);
    } else {
      setShowTakeFromPrevButton(false);
    }
    setOpen(true);
  }
  
  const data = {
    passengers,
    cityFrom,
    cityTo,
    date_time: `${dateText} ${timeText}`,
  }
  
  const handleOrderButtonClick = (data) => {
    ym(34728795, 'reachGoal', 'success_booking');
    sendOrder(data, () => history.push('/orderSuccess'))
  }

  const readyToOrder = passengers.length === seats;
  const totalPrice = passengers.reduce((sum, { ticketPrice }) => {
    return sum + ticketPrice;
  }, 0);

  return (
    <div>
      <Typography variant="h5" component="h2" align="center">
        {cityFromText} <ArrowForwardIcon /> {cityToText}
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
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${lastName} ${firstName} ${middleName}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary={phone} />
                  </ListItem>
                  {addressFrom && <ListItem>
                    <ListItemIcon>
                      <ArrowBackIcon />
                    </ListItemIcon>
                    <ListItemText primary={addressFrom} />
                  </ListItem>}
                  {addressTo && <ListItem>
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary={addressTo} />
                  </ListItem>}
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
            <Button disabled={!(readyToOrder && !loading)} onClick={() => handleOrderButtonClick(data)} variant="contained" color="primary">Оформить бронь</Button>
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
        showTakeFromPrevButton={showTakeFromPrevButton}
        prevPassengerValues={prevPassengerValues}
        cityFrom={cityFrom}
        cityTo={cityTo}
        cityFromText={cityFromText}
        cityToText={cityToText}
      />
    </div>
  );
};

const mapStateToProps = ({ trips: { seats, cityFrom, cityTo, cityFromText, cityToText, dateText, timeText }, passengers, order: { loading, error } }) => ({
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
})

export default connect(mapStateToProps, { addPassenger, updatePassenger, sendOrder, passangersReset })(PersonInfoPage);
