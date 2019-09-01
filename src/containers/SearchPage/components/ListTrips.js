/* eslint-disable no-script-url */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { cityOptions } from '../constants';
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

export default function ListTrips({ trips, cityFrom, cityTo, date, seats, handleButtonClick }) {
  const classes = useStyles();
  const cityFromText = cityOptions.find(({ value }) => value === cityFrom).text;
  const cityToText = cityOptions.find(({ value }) => value === cityTo).text;
  const dateText = formatDate(date);
  const priceFrom = ticketPrices[`${cityFrom}-${cityTo}`] - 100;

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
                    <Button disabled={availableSeats < seats} onClick={() => handleButtonClick(cityFromText, cityToText, dateText, timeText)} variant="contained" color="primary">Бронь</Button>
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
