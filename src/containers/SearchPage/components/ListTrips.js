/* eslint-disable no-script-url */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { cityOptions } from '../constants';

const useStyles = makeStyles(theme => ({
  divider: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  tripInfo: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

const formatDate = (date) => {

  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}

export default function ListTrips({ trips, cityFrom, cityTo, date, handleButtonClick }) {
  const classes = useStyles();
  const cityFromText = cityOptions.find(({ value }) => value === cityFrom).text;
  const cityToText = cityOptions.find(({ value }) => value === cityTo).text;
  return (
    <React.Fragment>
      <Typography className={classes.tripInfo} component="h3" variant="h5" color="primary" align="center" gutterBottom>
        {cityFromText} - {cityToText} {formatDate(date)}
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
      {trips.map(({ fromTime, availableSeats }, index) => (
        <React.Fragment key={index}>
          <Divider className={classes.divider}/>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1" align="center">{`0${fromTime.hours}`.slice(-2)} : {`0${fromTime.minutes}`.slice(-2)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" align="center">{availableSeats}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Grid container alignItems="flex-end" justify="flex-end" direction="row">
                <Button onClick={handleButtonClick} variant="contained" color="primary">Купить</Button>
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
