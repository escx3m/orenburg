import React, { useEffect, useState } from 'react';
import ModalWin from './components/ModalWin';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import PassengerInfoDialog from './components/PassengerInfoDialog';
import { updatePassenger, addPassenger, sendOrder, passangersReset } from './actions';
import api from '../../api';
import { getCombinedTrips } from '../SearchPage/index';
import { discountSale } from './constants';
import car2 from './image/car2.png';
import { Steps } from 'antd';
import './index.css';
import 'antd/dist/antd.css';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';

const { Step } = Steps;
const { ym } = window;

const grid = {
  width: '100%',
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  title: {
    fontSize: 14,
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  margin: {
    margin: theme.spacing(1),
  },
  personInfo: {
    textAlign: 'center',
    marginTop: 50,
  },
  elista: {
    color: 'black',
    fontSize: 24,
  },
  head: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonModal: {
    background: '#3f51b5',
    color: 'white',
  },
  media: {
    height: 190,
  },
  cardTitle: {
    textAlign: 'center',
  },
  cardPass: {
    margin: 'auto',
    marginTop: 20,
    maxWidth: 350,
    Width: "100%",
  },
  infoPas: {
    zIndex: 1,
  },
  editButton: {
    zIndex: 200,
    position: 'absolute',
    // marginLeft: '300px',
    right: '280px',
  },
}));


const PersonInfoPage = (props) => {
  const [open, setOpen] = React.useState(false);
  const [passengerValues, setPassengerValues] = React.useState({});
  const [prevPassengerValues, setPrevPassengerValues] = React.useState({});
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [showTakeFromPrevButton, setShowTakeFromPrevButton] = React.useState(false);
  const [disabledBntFind, setDisabledBtnFind] = useState(true);
  const [notEnoughSeats, setNotEnoughSeats] = React.useState(false);

  useEffect(() => {
    if (!(!!cityFrom && !!cityTo)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setPassengerValues({});
    setOpen(false);
  }

  const classes = useStyles();

  const {
    passengers,
    cityFrom,
    cityTo,
    seats,
    date,
    dateStart,
    dateEnd,
    cityFromText,
    cityToText,
    dateText,
    timeText,
    departureTimeText,
    arrivalTimeText,
    addPassenger,
    sendOrder,
    updatePassenger,
    passangersReset,
    loading,
    error,
    idempotenceKey,
    history,
  } = props;

  useEffect(() => {
    if (!(!!cityFrom && !!cityTo)) {
      history.push('/');
    }
    passangersReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleOrderButtonClick = async (data) => {
    ym(34728795, 'reachGoal', 'success_booking');

    let availableSeats = 0;

    if ([cityFrom, cityTo].every(city => ['119', '23'].includes(city))) {
      const Elista = '166';
      const departureTime = {
        '119': { toElistaTime: 20, fromElistaTime: 3 },
        '23': { toElistaTime: 21, fromElistaTime: 1 }
      }[cityFrom];
      const routesToElista = await api.trips.get({ ...data, cityTo: Elista });
      const dateStart = moment(data.dateStart).add(1, 'days').format();
      const dateEnd = moment(data.dateEnd).add(1, 'days').format();
      const routesFromElista = await api.trips.get({ ...data, cityFrom: Elista, dateStart, dateEnd });

      const toElista = getCombinedTrips(routesToElista, cityFrom).find(({ fromTime }) => fromTime.hours === departureTime.toElistaTime);
      const fromElista = getCombinedTrips(routesFromElista, Elista).find(({ fromTime }) => fromTime.hours === departureTime.fromElistaTime);

      if (toElista && fromElista) {
        availableSeats = Math.min(toElista.availableSeats, fromElista.availableSeats)
      }
    } else {
      const trips = await api.trips.get({ cityFrom, cityTo, seats, date, dateStart, dateEnd });
      const timeToCheck = {
        hours: +timeText.split(':')[0],
        minutes: +timeText.split(':')[1]
      }
      availableSeats = getCombinedTrips(trips, cityFrom).find(({ fromTime }) => (fromTime.hours === timeToCheck.hours && fromTime.minutes === timeToCheck.minutes)).availableSeats;
    }

    if (availableSeats < seats) {
      setNotEnoughSeats(true);
    } else {
      const orderData = {
        ...data,
        idempotenceKey: idempotenceKey === '' ? uuidv4() : idempotenceKey
      };
      sendOrder(orderData, () => history.push('/orderSuccess'));
    }
  }
  const readyToOrder = passengers.length === seats;
  const priceToPay = passengers.reduce((sum, { ticketPrice }) => {
    return sum + ticketPrice;
  }, 0);

  let totalDiscount = discountSale * passengers.length;
  if ([cityFrom, cityTo].every(city => ['119', '23'].includes(city))) {
    totalDiscount *= 2;
  }

  const fullPrice = priceToPay + totalDiscount;



  return (
    <div>
      <div className={classes.personInfo} style={grid}>
        <div className={classes.head}>
          <div className={classes.elista}>
            <div>{cityFromText} <img src={car2} alt="car2" width="120" /> {cityToText}</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Steps progressDot current={3}>
              <Step title={departureTimeText} description="Отправка" />
              <Step title={dateText} description="Дата" />
              <Step title={arrivalTimeText} description="Прибытие" />
            </Steps>
          </div>
        </div>
      </div>
      <Grid container spacing={2} className={classes.root}>
        {passengers.map(({ lastName, firstName, middleName, phone, addressFrom, addressTo }, index) => (
          <Grid key={seats - index} item xs={12}>
            <Divider />
            <Card onClick={handleClickOpen({}, -1)} className={classes.cardPass}>
              <CardHeader
                title={`Пассажир № ${passengers.length + index}`} className={classes.cardTitle}
              />
            
              {/* {loading ? (
                <Skeleton variant="rect" className={classes.media} />
              ) : (
                  <CardMedia
                    className={classes.media}
                  >
                    <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <PersonIcon />{`${lastName} ${firstName} ${middleName}`}
                    </Typography></div>
                    <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <PhoneIcon />{phone}
                    </Typography></div>
                    <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <ArrowBackIcon />{addressFrom}
                    </Typography></div>
                    <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <ArrowForwardIcon />{addressTo}
                    </Typography></div>
                    <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <ArrowBackIcon />{addressFrom}
                    </Typography></div>
                  </CardMedia>
                )} */}

              <CardContent>
                <div className={classes.infoPas}>
                  <div><IconButton onClick={handleClickOpen(passengers[index], index)} aria-label="edit" className={classes.editButton}>
                    <EditIcon />
                  </IconButton></div>
              <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <PersonIcon />{`${lastName} ${firstName} ${middleName}`}
                    </Typography></div>
                    <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <PhoneIcon />{phone}
                    </Typography></div>
                    <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <ArrowBackIcon />{addressFrom}
                    </Typography></div>
                    <div><Typography variant="subtitle1" className={classes.wrapIcon}>
                      <ArrowForwardIcon />{addressTo}
                    </Typography></div>
                    </div>
              </CardContent>
            </Card>
            {/* <Grid container justify="center" spacing={1} className={classes.root}>
              <Grid item xs={11}>
                <Grid container direction="row" alignItems="center">
                  <Typography variant="subtitle1" className={classes.wrapIcon}>
                    <PersonIcon />{`${lastName} ${firstName} ${middleName}`}
                  </Typography>
                </Grid>
                <Grid container direction="row" alignItems="center">
                  <Typography variant="subtitle1" className={classes.wrapIcon}>
                    <PhoneIcon />{phone}
                  </Typography>
                </Grid>
                {addressFrom && <Grid container direction="row" alignItems="center">
                  <Typography variant="subtitle1" className={classes.wrapIcon}>
                    <ArrowBackIcon />{addressFrom}
                  </Typography>
                </Grid>}
                {addressTo && <Grid container direction="row" alignItems="center">
                  <Typography variant="subtitle1" className={classes.wrapIcon}>
                    <ArrowForwardIcon />{addressTo}
                  </Typography>
                </Grid>}
              </Grid>
              <Grid item xs={1}>
                <Grid container justify="flex-end">
                  <IconButton onClick={handleClickOpen(passengers[index], index)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        ))}
        {Array.from({ length: seats - passengers.length }).map((_, index) => (
          <Grid key={index} item xs={12}>
            <Divider />
            <Grid container justify="center" spacing={1} className={classes.root}>
              {/* <Button onClick={handleClickOpen({}, -1)} size="large" variant="outlined" className={classes.margin}>
                пассажир №{passengers.length + index + 1}
              </Button> */}
                
              <Card className={classes.cardPass} onClick={handleClickOpen({}, -1)} >
      <CardHeader
        title={`Пассажир № ${passengers.length + index + 1}`} className={classes.cardTitle}
      />
        <Skeleton variant="rect" className={classes.media} />
        {/* <CardMedia
          className={classes.media}
          image="https://pi.tedcdn.com/r/talkstar-photos.s3.amazonaws.com/uploads/72bda89f-9bbf-4685-910a-2f151c4f3a8a/NicolaSturgeon_2019T-embed.jpg?w=512"
          title="Ted talk"
        /> */}
      <CardContent>
          <React.Fragment>
            <Skeleton height={6} />
            <Skeleton height={6} width="80%" />
          </React.Fragment>
          <Typography variant="body2" color="textSecondary" component="p">
            {}
          </Typography>
      </CardContent>
    </Card>

            </Grid>
          </Grid>
        ))}
        {!notEnoughSeats ?
          <React.Fragment>
            <Grid item xs={12}>
              {readyToOrder
                ? <div>
                  <Grid direction="row" container xs={12} justify="center" alignItems="center">
                    <Grid xs={6}>
                      <Typography color="textSecondary" variant="h5" component="h2" align="right">
                        Стоимость:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="textSecondary" variant="h5" component="h2">{fullPrice} р.</Typography>
                    </Grid>
                  </Grid>
                  <Grid direction="row" container xs={12} justify="center" alignItems="center">
                    <Grid xs={6}>
                      <Typography color="textSecondary" variant="h5" component="h2" align="right">
                        Скидка:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid xs={6}><Typography color="textSecondary" variant="h5" component="h2">{totalDiscount} р.</Typography></Grid>
                  </Grid>
                  <Grid direction="row" container xs={12} justify="center" alignItems="center">
                    <Grid xs={6}>
                      <Typography variant="h5" component="h2" align="right">
                        К оплате:&nbsp;
                        </Typography>
                    </Grid>
                    <Grid xs={6}><Typography variant="h5" component="h2">{priceToPay} р.</Typography></Grid>
                  </Grid>
                </div>
                : <Typography variant="h5" component="h2" align="center">
                  Заполните данные пассажиров
                  </Typography>
              }
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Button disabled={!(readyToOrder && !loading && !disabledBntFind && !notEnoughSeats)} onClick={() => handleOrderButtonClick(data)} variant="contained" color="primary">Оплатить</Button>
              </Grid>
            </Grid>
          </React.Fragment>
          : <Grid item xs={12}>
            <Grid container justify="center">
              <Typography variant="h5" component="h2" align="center">
                Недостаточно свободных мест.
              </Typography>
            </Grid>
            <Grid container justify="center">
              <Button onClick={() => props.history.push('/')} variant="contained" color="primary">На главную</Button>
            </Grid>
          </Grid>
        }
        <ModalWin toggleBtnFindTickets={() => setDisabledBtnFind(!disabledBntFind)} />
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
        seats={seats}
      />
    </div>
  );
};

const mapStateToProps = ({ trips: { cityFrom, cityTo, seats, date, dateStart, dateEnd, cityFromText, cityToText, dateText, timeText, departureTimeText, arrivalTimeText }, passengers, payment: { idempotenceKey, loading, error } }) => ({
  cityFrom,
  cityTo,
  seats,
  date,
  dateStart,
  dateEnd,
  cityFromText,
  cityToText,
  dateText,
  departureTimeText,
  arrivalTimeText,
  timeText,
  passengers,
  loading,
  error,
  idempotenceKey,
})

export default connect(mapStateToProps, { addPassenger, updatePassenger, sendOrder, passangersReset })(PersonInfoPage);
