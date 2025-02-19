/* eslint-disable no-script-url */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import moment from "moment-timezone";
import { Modal } from "antd";
import {
  cityOptions,
  timeWindowPhoneRedir,
  arriveInterval,
  cityTimeZones,
  waysTime
} from "../constants";
import { ticketPrices } from "../../PersonInfoPage/constants";

import Card from "@material-ui/core/Card";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import InfoIcon from "@material-ui/icons/Info";
import LocalTaxiIcon from "@material-ui/icons/LocalTaxi";
import EventIcon from "@material-ui/icons/Event";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { byzylyk } from "../constants";

const useStyles = makeStyles(theme => ({
  divider: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  tripInfo: {
    marginTop: theme.spacing(2)
  },
  card: {
    width: "100%",
    marginTop: "20px",
    borderColor: "#3f51b5",
    padding: "16px",
    paddingBottom: "3px"
  },
  title: {
    fontSize: "20px"
  },
  info: {
    marginTop: "20px"
  },
  infoRoad: {
    fontSize: "24px",
    marginTop: "20px"
  },
  btnModal: {
    background: "#3f51b5",
    color: "white"
  },
  iconsMUI: {
    color: "#3f51b5",
    verticalAlign: "sub"
  },
  iconTime: {
    fontSize: "medium",
    color: "#3f51b5",
    verticalAlign: "text-top"
  }
}));

const formatDate = date => {
  let dd = date.getDate();
  if (dd < 10) dd = "0" + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;

  const yy = date.getFullYear();

  return yy + "-" + mm + "-" + dd;
};

const calculatePriceFrom = (cityFrom, cityTo) => {
  return ticketPrices[`${cityFrom}-${cityTo}`];
};

export default function ListTrips({
  trips,
  cityFrom,
  cityTo,
  date,
  seats,
  handleButtonClick
}) {
  const classes = useStyles();
  const cityFromText = cityOptions.find(({ value }) => value === cityFrom).text;
  const cityToText = cityOptions.find(({ value }) => value === cityTo).text;
  const cityFromTZ = cityTimeZones.find(value => value.city === cityFrom)
    .timeZone;
  const cityToTZ = cityTimeZones.find(value => value.city === cityTo).timeZone;
  const dateText = formatDate(date);
  const priceFrom = calculatePriceFrom(cityFrom, cityTo);
  const { wayTime } = waysTime.find(
    ({ fromCityId, toCityId }) => fromCityId === cityFrom && toCityId === cityTo
  );

  const diffMinutes = (t1, t2) => {
    let diff = (t2.getTime() - t1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  };

  const [visiblePhoneRedirect, setVisiblePhoneRedirect] = useState(false);

  const renderListTrips = (
    <React.Fragment>
      <div className={classes.infoRoad}>
        {" "}
        <InfoIcon style={{ color: "#3f51b5" }} /> Информация о рейсе
      </div>
      <Card className={classes.card}>
        <Typography className={classes.title} gutterBottom>
          <LocalTaxiIcon className={classes.iconsMUI} /> Рейс: {cityFromText} -{" "}
          {cityToText}
        </Typography>
        <Typography className={classes.title} gutterBottom>
          <EventIcon className={classes.iconsMUI} /> Дата: {dateText}
        </Typography>
        <Typography className={classes.title} gutterBottom>
          <AccountBalanceWalletIcon className={classes.iconsMUI} /> От:{" "}
          {priceFrom} рублей
        </Typography>
      </Card>

      <Grid container style={{ marginTop: "20px" }}>
        <Grid item xs={3}>
          <Typography variant="body1" align="center">
            Отпр.
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" align="center">
            Приб.
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" align="center">
            Билеты
          </Typography>
        </Grid>
      </Grid>
      {trips.map(({ fromTime, availableRoute, availableSeats }, index) => {
        const timeText =
          `0${fromTime.hours}`.slice(-2) +
          ":" +
          `0${fromTime.minutes}`.slice(-2);
        let departureTimeText, arrivalTimeText;
        let lowBrdDepTime = {
          hours: 0,
          minutes: 0
        };
        let upArrTime = {
            hours: 0,
            minutes: 0
          },
          lowArrTime = {
            hours: 0,
            minutes: 0
          };
        if (cityFrom === byzylyk) {
          fromTime.hours += 3;
          fromTime.hours %= 24;
        }
        if (fromTime.minutes - arriveInterval.minutes < 0) {
          lowBrdDepTime.hours--;
          lowBrdDepTime.minutes =
            fromTime.minutes - (arriveInterval.minutes % 60);
        } else {
          lowBrdDepTime.minutes = fromTime.minutes - arriveInterval.minutes;
        }

        if (fromTime.hours - arriveInterval.hours < 0) {
          lowBrdDepTime.hours = 23;
        } else {
          lowBrdDepTime.hours = fromTime.hours - arriveInterval.hours;
        }

        lowArrTime.hours =
          (fromTime.hours +
            wayTime.hours +
            moment.tz(cityToTZ).hour() -
            moment.tz(cityFromTZ).hour()) %
          24;
        lowArrTime.minutes = fromTime.minutes;

        if (lowArrTime.minutes + wayTime.minutes >= 60) {
          lowArrTime.hours++;
          lowArrTime.minutes = (fromTime.minutes + wayTime.minutes) % 60;
        } else {
          lowArrTime.minutes = fromTime.minutes + wayTime.minutes;
        }

        if (
          lowArrTime.hours +
            (moment.tz(cityToTZ).hour() - moment.tz(cityFromTZ).hour()) <
          0
        ) {
          lowArrTime.hours = 23;
        }

        upArrTime.hours = (lowArrTime.hours + arriveInterval.hours) % 24;
        upArrTime.minutes = lowArrTime.minutes;

        if (fromTime.minutes === 30) {
          lowArrTime.minutes = 0;
          lowArrTime.hours++;
          upArrTime.minutes = 0;
          upArrTime.hours++;
        }

        departureTimeText =
          `0${lowBrdDepTime.hours % 24}`.slice(-2) +
          ":" +
          `0${lowBrdDepTime.minutes}`.slice(-2) +
          " - " +
          `0${fromTime.hours}`.slice(-2) +
          ":" +
          `0${fromTime.minutes}`.slice(-2);

        arrivalTimeText =
          `0${lowArrTime.hours}`.slice(-2) +
          ":" +
          `0${(lowArrTime.minutes +
            (moment.tz(cityToTZ).minutes() - moment.tz(cityFromTZ).minutes())) %
            60}`.slice(-2) +
          " - " +
          `0${upArrTime.hours}`.slice(-2) +
          ":" +
          `0${upArrTime.minutes +
            (moment.tz(cityToTZ).minutes() -
              moment.tz(cityFromTZ).minutes())}`.slice(-2);

        // return availableRoute && availableSeats > 0 ? (
        return availableRoute ? (
          <React.Fragment key={index}>
            <Divider className={classes.divider} />
            <Grid container alignItems="center">
              <Grid item xs={3}>
                <Typography variant="body1" align="center">
                  {departureTimeText}&nbsp;
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" align="center">
                  {arrivalTimeText}&nbsp;
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" align="center">
                  {availableSeats}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Grid
                  container
                  alignItems="flex-end"
                  justify="flex-end"
                  direction="row"
                >
                  <Button
                    disabled={availableSeats < seats}
                    onClick={
                      diffMinutes(new Date(fromTime.time), new Date()) <
                      timeWindowPhoneRedir.maxMinutes
                        ? () => setVisiblePhoneRedirect(!visiblePhoneRedirect)
                        : () =>
                            handleButtonClick(
                              cityFromText,
                              cityToText,
                              dateText,
                              timeText,
                              departureTimeText,
                              arrivalTimeText
                            )
                    }
                    variant="contained"
                    color="primary"
                  >
                    Купить
                  </Button>
                  <Modal
                    title="Перенаправление"
                    visible={visiblePhoneRedirect}
                    onCancel={() => {
                      setVisiblePhoneRedirect(!visiblePhoneRedirect);
                    }}
                    footer={
                      <Button
                        className={classes.btnModal}
                        type="primary"
                        onClick={() => {
                          setVisiblePhoneRedirect(!visiblePhoneRedirect);
                        }}
                      >
                        Ok
                      </Button>
                    }
                  >
                    <p>
                      Продажа билетов через сайт прекращается за 24 часа до
                      отправления.
                    </p>
                    <p>
                      Пожалуйста, позвоните по телефону{" "}
                      <a href="tel:+79228800333">+7 (922) 880-0333</a> или{" "}
                      <a href="tel:+79228888121">+7 (922) 888-8121</a> и
                      забронируйте себе билет.
                    </p>
                  </Modal>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        ) : (
          ""
        );
      })}
      <Typography className={classes.info}>
        <AccessTimeIcon className={classes.iconTime} /> Отправление и прибытие
        указано по местному времени
      </Typography>
    </React.Fragment>
  );

  const renderNoTrips = (
    <Typography variant="h5" color="textSecondary" align="center">
      Подходящих рейсов не найдено
    </Typography>
  );

  return !!trips.length ? renderListTrips : renderNoTrips;
}
