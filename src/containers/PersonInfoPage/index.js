import React, { useEffect, useState } from 'react';
import ModalWin from './components/ModalWin';

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
import { discountSale } from './constants';
import car2 from './image/car2.png';
import { Steps, Modal } from 'antd';
import './index.css';
import PassengersForm from './components/PassengersForm';
import 'antd/dist/antd.css';

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
    maxWidth: '500px',
    width: '100%',
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
    color:'white',
  },
}));


const PersonInfoPage = (props) => {
  const [open, setOpen] = React.useState(false);
  const [passengerValues, setPassengerValues] = React.useState({});
  const [prevPassengerValues, setPrevPassengerValues] = React.useState({});
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [showTakeFromPrevButton, setShowTakeFromPrevButton] = React.useState(false);

  useEffect(() => {
    if (!(!!cityFrom && !!cityTo)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isChildTicket, setIsChildTicket] = useState(false);
  const [isDocs, setIsDocs] = useState(false);
  const [isModalDocs, setModalDocs] = useState(false);
  
  

  const placeOrder = (data) => {
    // ym(34728795, 'reachGoal', 'success_booking');
    const orderData = {
      ...data,
      idempotenceKey: idempotenceKey === '' ? uuidv4() : idempotenceKey
    };
    console.log(orderData);
    // sendOrder(orderData, () => history.push('/orderSuccess'));
  }
  // const [disabledBntFind, setDisabledBtnFind] = useState(true);
  // const readyToOrder = passengers.length === seats;

  const [visibleBaggage, setVisibleBaggage] = useState(false);
  const [visibleDocs, setVisibleDocs] = useState(false);
  const handleCloseBaggage = () => {
    setVisibleBaggage(false);
  }

  const handleCloseDocs = () => {
    setVisibleDocs(false);
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
    departureTimeText,
    arrivalTimeText,
    addPassenger,
    updatePassenger,
    passangersReset,
    sendOrder,
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

  const handleOrderButtonClick = (data) => {
    ym(34728795, 'reachGoal', 'success_booking');
    const orderData = {
      ...data,
      idempotenceKey: idempotenceKey === '' ? uuidv4() : idempotenceKey
    };
    sendOrder(orderData, () => history.push('/orderSuccess'));
  }
  const [disabledBntFind, setDisabledBtnFind] = useState(true);
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
      {/* <Typography variant="h5" component="h2" align="center">
        {cityFromText} <ArrowForwardIcon /> {cityToText}
      </Typography>
      <Typography variant="h5" color="textSecondary" align="center">
        {dateText} {timeText}
      </Typography> */}
      
      <div className={classes.personInfo} style={grid}>
      <div className={classes.head}>
        <div className={classes.elista}>
          <div>{cityFromText} <img src={car2} alt="car2" width="120" /> {cityToText}</div>
          {/* <div >{dateText}</div> */}
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

      {/* {cityFrom && cityTo && <PassengersForm
        cityFrom={cityFrom}
        cityTo={cityTo}
        cityFromText={cityFromText}
        cityToText={cityToText}
        seats={seats}
        visibleBaggage={visibleBaggage}
        setVisibleBaggage={setVisibleBaggage}
        visibleDocs={visibleDocs}
        setVisibleDocs={setVisibleDocs}
        placeOrder={placeOrder}
      />}
      <Modal
        title="Правила провоза багажа"
        visible={visibleBaggage}
        onCancel={handleCloseBaggage}
        footer={
          <Button className={classes.buttonModal} type="primary" onClick={handleCloseBaggage}>Ok</Button>
        }
      >
        <div>
          <p>Бесплатно одно место багажа на одного человека размером 80 x 50 x 30 см. и весом не более 23 кг.</p>
          <p>Стоимость дополнительного багажа 100 рублей.</p>
          <p>Дополнительный багаж оплачивается водителю.</p>
          <p>Животные перевозятся только в клетках и с согласования всех остальных пассажиров.</p>
          <p>В случае габаритного багажа (длина одного измерения более 100 см или вес более 23 кг), уточните у оператора возможность его провоза.</p>
        </div>
      </Modal>
      <Modal
        title="Как получить отчетные документы?"
        visible={visibleDocs}
        onCancel={handleCloseDocs}
        footer={
          <Button  className={classes.buttonModal} type="primary" onClick={handleCloseDocs}>Ok</Button>
        }
      >
        <ol>
          <li>Указать галочку "Нужен отчетный документ"</li>
          <li>Заполнить поля "Дата рождения" и "Серия и номер паспорта"</li>
          <li>Получить отчетные документы вы можете в офис компании.</li>
          <li>Если у вас нет возможности приехать в офисе, то вы можете воспользоваться платной услугой доставки отчетных документов. Стоимость 150 рублей.</li>
        </ol>
      </Modal> */}

      <Grid container spacing={2} className={classes.root}>
        {passengers.map(({ lastName, firstName, middleName, phone, addressFrom, addressTo }, index) => (
          <Grid key={seats - index} item xs={12}>
            <Divider />
            <Grid container justify="center" spacing={1} className={classes.root}>
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
            <Button disabled={!(readyToOrder && !loading && !disabledBntFind)} onClick={() => handleOrderButtonClick(data)} variant="contained" color="primary">Оплатить</Button>
          </Grid>
        </Grid>
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

const mapStateToProps = ({ trips: { seats, cityFrom, cityTo, cityFromText, cityToText, dateText, timeText, departureTimeText, arrivalTimeText  }, passengers, payment: { idempotenceKey, loading, error } }) => ({
  seats,
  cityFrom,
  cityTo,
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
