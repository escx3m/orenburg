import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import SwapIcon from '@material-ui/icons/SwapVert';
import { Button, TextField } from '@material-ui/core';

import { withFormik } from 'formik';

import ruLocale from 'date-fns/locale/ru';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import { cityOptions } from '../constants';

const useStyles = makeStyles(theme => ({
  "@global": {
    '.MuiButton-root': {
      minWidth: "30px",
    },
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  swapButtonAndDatePicker: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fab: {
    margin: theme.spacing(1),
  },
  seatsContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0 10px',
  },
  seats: {
    borderRadius: '0',
    maxWidth: '20px',
    width: '100%',
  },
  minus: {
    maxWidth: '20px',
    width: '100%',
    height: '56px',
    borderRadius: '5px 0 0 5px',
  },
  plus: {
    maxWidth: '20px',
    width: '100%',
    borderRadius: '0 5px 5px 0',
  },
}));

const SearchForm = props => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
  } = props;

  const inputLabel = React.useRef(null);
  const classes = useStyles();

  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleSwitchButtonClick = e => {
    e.preventDefault();
    const {
      values: {cityFrom, cityTo, date, seats},
      setFieldValue,
      handleReset,
    } = props;
    handleReset();
    setFieldValue('cityFrom', cityTo);
    setFieldValue('cityTo', cityFrom);
    setFieldValue('date', date);
    setFieldValue('seats', seats);
  };

  const cityFromOptions = cityOptions.filter(
    city => city.value !== values.cityTo,
  );
  const cityToOptions = cityOptions.filter(
    city => city.value !== values.cityFrom,
  );

 return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className={classes.form}>
        <FormControl
          className={classes.formControl}
          error={touched.cityFrom && errors.cityFrom}
          fullWidth
          variant="outlined">
          <InputLabel ref={inputLabel} htmlFor="cityFrom">
            Откуда
          </InputLabel>
          <Select
            value={values.cityFrom}
            onChange={handleChange}
            onBlur={handleBlur}
            input={<OutlinedInput labelWidth={50} />}
            inputProps={{
              name: 'cityFrom',
              id: 'cityFrom',
            }}>
            {cityFromOptions.map(city => (
              <MenuItem key={city.value} value={city.value}>
                {city.text}
              </MenuItem>
            ))}
          </Select>
          {touched.cityFrom && errors.cityFrom && (
            <FormHelperText>{errors.cityFrom}</FormHelperText>
          )}
        </FormControl>
        <div className={classes.swapButtonAndDatePicker}>
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
              <DatePicker
                cancelLabel="Отмена"
                showTodayButton={true}
                todayLabel="Сегодня"
                inputVariant="outlined"
                label="Когда"
                disablePast
                name="date"
                value={values.date}
                format="dd/MM/yyyy"
                helperText={errors.date}
                error={Boolean(errors.date)}
                onError={(_, error) => setFieldError('date', error)}
                onChange={date => date && setFieldValue('date', date, true)}
              />
            </MuiPickersUtilsProvider>
          </div>
            <div className={classes.seatsContainer}>
              <Button
                variant="outlined"
                className={classes.minus}
                onClick={e => {
                  values.seats =
                    values.seats <= 1
                      ? 1
                      : setFieldValue('seats', values.seats - 1);
                }}>-</Button>
              <Button
                className={classes.seats}
                classes={{
                  root: classes.seats
                }}
                label="Мест"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  classes: classes.seats
                }}
                id="seats"
                name="seats"
                onChange={handleChange}
                onBlur={handleBlur}
                labelWidth={labelWidth}
              >{values.seats}</Button>
              {touched.seats && errors.seats && (
                <FormHelperText>{errors.seats}</FormHelperText>
              )}
              <Button
                variant="outlined"
                classes={{
                  root: classes.plus
                }}
                className={classes.plus}
                onClick={e => {
                  values.seats =
                    values.seats >= 24
                      ? 24
                      : setFieldValue('seats', values.seats + 1);
                }}>+</Button>
            </div>
          <div>
            <Fab
              color="primary"
              onClick={handleSwitchButtonClick}
              size="small"
              aria-label="swap">
              <SwapIcon />
            </Fab>
          </div>
        </div>
        <FormControl
          className={classes.formControl}
          error={touched.cityTo && errors.cityTo}
          fullWidth
          variant="outlined">
          <InputLabel ref={inputLabel} htmlFor="cityTo">
            Куда
          </InputLabel>
          <Select
            value={values.cityTo}
            onChange={handleChange}
            onBlur={handleBlur}
            input={<OutlinedInput labelWidth={labelWidth} />}
            inputProps={{
              name: 'cityTo',
              id: 'cityTo',
            }}>
            {cityToOptions.map(city => (
              <MenuItem key={city.value} value={city.value}>
                {city.text}
              </MenuItem>
            ))}
          </Select>
          {touched.cityTo && errors.cityTo && (
            <FormHelperText>{errors.cityTo}</FormHelperText>
          )}
        </FormControl>
        <Button
          size="large"
          fullWidth
          onClick={handleSubmit}
          variant="contained"
          color="primary">
          Найти билеты
        </Button>
      </form>
    </React.Fragment>
  );
};

export default withFormik({
  mapPropsToValues: ({initialValues}) => ({
    cityFrom: '',
    cityTo: '',
    date: new Date(),
    seats: 1,
    ...initialValues,
  }),

  validate: values => {
    const errors = {};
    if (!values.cityFrom) {
      errors.cityFrom = 'Обязательное поле';
    }
    if (!values.cityTo) {
      errors.cityTo = 'Обязательное поле';
    }
    if (!values.date) {
      errors.date = 'Обязательное поле';
    }
    if (values.seats < 1) {
      errors.seats = 'Должно быть больше нуля';
    }
    return errors;
  },

  handleSubmit: (values, {props}) => {
    props.onSubmit(values);
  },
})(SearchForm);
