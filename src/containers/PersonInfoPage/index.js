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
import Skeleton from '@material-ui/lab/Skeleton';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import WorkIcon from '@material-ui/icons/Work';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import DescriptionIcon from '@material-ui/icons/Description';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    display: 'inline-flex',
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
  fillData: {
    marginTop: '20px',
  },
  head: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  iconColor: {
    color: '#3f51b5',
    marginRight: '10px',
  },
  media: {
    height: 120,
  },
  cardTitle: {
    textAlign: 'center',
  },
  cardPass: {
    margin: 'auto',
    marginTop: 20,
    maxWidth: 300,
    width: "100%",
  },
  cardDate: {
    padding: '0 16px',
    position: 'relative',
  },
  arrowDown: {
    position: 'absolute',
    top: '74px',
  },
  payButton: {
    maxWidth: 300,
    width: "100%",
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
        <Grid item xs={12}>
        {!readyToOrder ?
          <Typography
            className={classes.fillData}
            variant="h5"
            component="h2"
            align="center">
            Заполните данные пассажир{
              seats > 1 ? 'ов' : 'а'
            }
          </Typography> : ''}
          </Grid>
          {passengers.map(({ lastName, firstName, middleName, phone, addressFrom, addressTo, comment, child, ageGroup, sendDocs, passport, birthday, baggage }, index) => (
          <Grid key={seats - index} item xs={12}>
            <Divider />
            <Card className={classes.cardPass}> {/*Вывод данных после заполнения*/}
              <CardHeader
                title={`Пассажир № ${index + 1}`}
                className={classes.cardTitle}
                subheader={child ? <div style={{ color: 'black' }}>(Детский билет)</div> : ''}
              />
              <CardContent className={classes.cardDate}>
                <Grid container justify="center" spacing={1} >
                  <Grid item xs={11}>
                    <Grid container direction="row" alignItems="center">
                      <Typography variant="subtitle1" className={classes.wrapIcon}>
                        <PersonIcon className={classes.iconColor} />{`${lastName} ${firstName} ${middleName}`}
                      </Typography>
                    </Grid>
                    <Grid container direction="row" alignItems="center">
                      <Typography variant="subtitle1" className={classes.wrapIcon}>
                        <PhoneIphoneIcon className={classes.iconColor} />{phone}
                      </Typography>
                    </Grid>
                    {addressFrom && <Grid container direction="row" alignItems="center">
                      <Typography variant="subtitle1" className={classes.wrapIcon}>
                        <FiberManualRecordIcon className={classes.iconColor} />{addressFrom}
                      </Typography>
                    </Grid>}
                    {addressFrom && addressTo && <Grid container direction="row" alignItems="center" className={classes.arrowDown}>
                      <ExpandMoreIcon className={classes.iconColor} />
                    </Grid>}
                    {addressTo && <Grid container direction="row" alignItems="center">
                      <Typography variant="subtitle1" className={classes.wrapIcon}>
                        <FiberManualRecordIcon className={classes.iconColor} />{addressTo}
                      </Typography>
                    </Grid>}
                    {child && <Grid container direction="row" alignItems="center">
                      <Typography variant="subtitle1" className={classes.wrapIcon}>
                        <ChildCareIcon className={classes.iconColor} />Возрастная группа: {ageGroup}
                      </Typography>
                    </Grid>}
                    {baggage && <Grid container direction="row" alignItems="center">
                      <Typography variant="subtitle1" className={classes.wrapIcon}>
                        <WorkIcon className={classes.iconColor} />Дополнительный багаж {baggage}
                      </Typography>
                    </Grid>}
                    {sendDocs && <Grid container direction="row" alignItems="center">
                      <Typography variant="subtitle1" className={classes.wrapIcon}>
                        <DescriptionIcon className={classes.iconColor} />Отчетные документы:
                      </Typography>
                      <div style={{ marginLeft: '30px' }}>дата рождения: {birthday}</div>
                      <div style={{ marginLeft: '30px' }}>пасп. данные: {passport}</div>
                    </Grid>}
                    {comment && <Grid container direction="row" alignItems="center">
                      <Typography variant="subtitle1" className={classes.wrapIcon}>
                        <ChatBubbleIcon className={classes.iconColor} />{comment}
                      </Typography>
                    </Grid>}
                  </Grid>
                  <Grid item xs={1}>
                    <Grid container justify="flex-end">
                      <IconButton onClick={handleClickOpen(passengers[index], index)} aria-label="edit">
                        <EditIcon className={classes.iconColor} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
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
                <CardContent>
                  <React.Fragment>
                    <Skeleton height={6} width="100%" />
                    <Skeleton height={6} width="80%" />
                  </React.Fragment>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ))}
        
        {!notEnoughSeats ?
          <React.Fragment>
            <Grid item xs={12}>
              <ModalWin toggleBtnFindTickets={() => setDisabledBtnFind(!disabledBntFind)} />
              {readyToOrder
                ? <div>
                  <Card className={classes.cardPass}>
                  <Grid direction="row" container xs={12} justify="center" alignItems="center">
                   <Grid xs={7}>
                     <Typography color="textSecondary" variant="h5" component="h2" align="right">
                       Стоимость:&nbsp;
                       </Typography>
                   </Grid>
                   <Grid xs={5}>
                     <Typography color="textSecondary" variant="h5" component="h2">{fullPrice} р.</Typography>
                   </Grid>
                 </Grid>
                 <Grid direction="row" container xs={12} justify="center" alignItems="center">
                   <Grid xs={7}>
                     <Typography color="textSecondary" variant="h5" component="h2" align="right">
                       Скидка:&nbsp;
                       </Typography>
                   </Grid>
                   <Grid xs={5}><Typography color="textSecondary" variant="h5" component="h2">{totalDiscount} р.</Typography></Grid>
                 </Grid>
                 <Grid direction="row" container xs={12} justify="center" alignItems="center">
                   <Grid xs={7}>
                     <Typography variant="h5" component="h2" align="right">
                      К оплате:&nbsp;
                      </Typography>
                   </Grid>
                   <Grid xs={5}><Typography variant="h5" component="h2">{priceToPay} р.</Typography></Grid>
                 </Grid>
                  </Card>
                </div>
                : ''
              }
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Button className={classes.payButton} disabled={!(readyToOrder && !loading && !disabledBntFind && !notEnoughSeats)} onClick={() => handleOrderButtonClick(data)} variant="contained" color="primary">Оплатить</Button>
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
