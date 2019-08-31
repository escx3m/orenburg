import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import SwapIcon from '@material-ui/icons/SwapVert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


import { withFormik } from 'formik';

import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import { cityOptions } from '../constants';

const useStyles = makeStyles(theme => ({
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
    const { values: { cityFrom, cityTo, date, seats }, setFieldValue, handleReset } = props;
    handleReset();
    setFieldValue('cityFrom', cityTo);
    setFieldValue('cityTo', cityFrom);
    setFieldValue('date', date);
    setFieldValue('seats', seats);
  }

  const cityFromOptions = cityOptions.filter(city => city.value !== values.cityTo);
  const cityToOptions = cityOptions.filter(city => city.value !== values.cityFrom);
  
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className={classes.form}>
        <FormControl className={classes.formControl} error={touched.cityFrom && errors.cityFrom} fullWidth variant="outlined">
          <InputLabel ref={inputLabel} htmlFor="cityFrom">Откуда</InputLabel>
          <Select
            value={values.cityFrom}
            onChange={handleChange}
            onBlur={handleBlur}
            input={<OutlinedInput labelWidth={50}/>}
            inputProps={{
              name: 'cityFrom',
              id: 'cityFrom',
            }}
          >
            {cityFromOptions.map(city => (<MenuItem key={city.value} value={city.value}>{city.text}</MenuItem>))}
          </Select>
          {touched.cityFrom && errors.cityFrom && <FormHelperText>{errors.cityFrom}</FormHelperText>}
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
                name='date'
                value={values.date}
                format="dd/MM/yyyy"
                helperText={errors.date}
                error={Boolean(errors.date)}
                onError={(_, error) => setFieldError('date', error)}
                onChange={date => date && setFieldValue('date', date, true)}
              />
            </MuiPickersUtilsProvider>
          </div>
          <FormControl className={classes.formControl} error={errors.seats && touched.seats} variant="outlined">
            <InputLabel ref={inputLabel} htmlFor="seats">Мест</InputLabel>
            <OutlinedInput
              id="seats"
              name="seats"
              type="number"
              value={values.seats}
              onChange={handleChange}
              onBlur={handleBlur}
              labelWidth={labelWidth}
            />
            {touched.seats && errors.seats && <FormHelperText>{errors.seats}</FormHelperText>}
          </FormControl>
          <div>
            <Fab color="primary" onClick={handleSwitchButtonClick} size="small" aria-label="swap">
              <SwapIcon />
            </Fab>
          </div>
        </div>
        <FormControl className={classes.formControl} error={touched.cityTo && errors.cityTo} fullWidth variant="outlined">
          <InputLabel ref={inputLabel} htmlFor="cityTo">Куда</InputLabel>
          <Select
            value={values.cityTo}
            onChange={handleChange}
            onBlur={handleBlur}
            input={<OutlinedInput labelWidth={labelWidth}/>}
            inputProps={{
              name: 'cityTo',
              id: 'cityTo',
            }}
          >
            {cityToOptions.map(city => (<MenuItem key={city.value} value={city.value}>{city.text}</MenuItem>))}
          </Select>
          {touched.cityTo && errors.cityTo && <FormHelperText>{errors.cityTo}</FormHelperText>}
        </FormControl>
        <Button size="large" fullWidth onClick={handleSubmit} variant="contained" color="primary" >Поиск</Button>
      </form>
    </React.Fragment>
  );
}

export default withFormik({
  mapPropsToValues: () => ({
    cityFrom: '',
    cityTo: '',
    date: new Date(),
    seats: 1,
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

  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
})(SearchForm);
