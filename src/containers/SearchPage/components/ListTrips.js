/* eslint-disable no-script-url */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Modal } from 'antd';

import { cityOptions, timeWindowPhoneRedir } from '../constants';
import { ticketPrices } from '../../PersonInfoPage/constants';


const useStyles = makeStyles(theme => ({
  divider: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  tripInfo: {
    marginTop: theme.spacing(2),
  }
}));

const formatDate = (date) => {

  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  const yy = date.getFullYear();

  return yy + '-' + mm + '-' + dd;
}

const calculatePriceFrom = (cityFrom, cityTo) => {
  const Elista = '166';
  if ([cityFrom, cityTo].every(city => ['119', '23'].includes(city))) {
    return ticketPrices[`${cityFrom}-${Elista}`] + ticketPrices[`${Elista}-${cityTo}`] - 200;
  } else {
    return ticketPrices[`${cityFrom}-${cityTo}`] - 100;
  }
}

export default function ListTrips({ trips, cityFrom, cityTo, date, seats, handleButtonClick }) {
  const classes = useStyles();
  const cityFromText = cityOptions.find(({ value }) => value === cityFrom).text;
  const cityToText = cityOptions.find(({ value }) => value === cityTo).text;
  const dateText = formatDate(date);
  const priceFrom = calculatePriceFrom(cityFrom, cityTo);
  
  const diffMinutes = (t1, t2) => {
    let diff = (t2.getTime() - t1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  };

  const [visiblePhoneRedirect, setVisiblePhoneRedirect] = useState(false);

  const renderListTrips = (
    <React.Fragment>
      <Typography className={classes.tripInfo} component="h3" variant="h5" align="center">
        {cityFromText} - {cityToText} от {priceFrom} р.
      </Typography>
      <Typography component="h3" variant="h5" align="center">
        {dateText}
      </Typography>
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="body1" align="center">Время отправления</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" align="center">Свободных мест</Typography>
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </Grid>
      {trips.map(({ fromTime, availableRoute, availableSeats }, index) => {
        const timeText = `0${fromTime.hours}`.slice(-2) + ':' + `0${fromTime.minutes}`.slice(-2);
        console.log(diffMinutes(new Date(), new Date(fromTime.time)));
        return availableRoute
          ? (
            <React.Fragment key={index}>
              <Divider className={classes.divider}/>
              <Grid container alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="body1" align="center">{timeText}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" align="center">{availableSeats}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Grid container alignItems="flex-end" justify="flex-end" direction="row">
                    <Button disabled={availableSeats < seats} onClick={(diffMinutes(new Date(fromTime.time), new Date()) < timeWindowPhoneRedir.maxMinutes) ? () => setVisiblePhoneRedirect(!visiblePhoneRedirect) : () => handleButtonClick(cityFromText, cityToText, dateText, timeText)} variant="contained" color="primary">Купить</Button>
                    <Modal
                      title="Перенаправление"
                      visible={ visiblePhoneRedirect }
                      onCancel={ () => {setVisiblePhoneRedirect(!visiblePhoneRedirect)} }
                      footer={<Button type="primary" onClick={ () => {setVisiblePhoneRedirect(!visiblePhoneRedirect)} }>Ok</Button>}
                    >
                      <p>Продажа билетов через сайт прекращается за 2 часа до отправления.</p>
                      <p>Пожалуйста, позвоните по телефону <a href="tel:+79374646000">+7 (937) 464-6000</a> и забронируйте себе билет.</p>
                    </Modal>
                  </Grid>
                </Grid>
                
              </Grid>
            </React.Fragment>
          )
          : '';
      })}
    </React.Fragment>
  );
  
  const renderNoTrips = (
    <Typography variant="h5" color="textSecondary" align="center">Подходящих рейсов не найдено</Typography>
  );

  return !!trips.length ? renderListTrips : renderNoTrips;
}
