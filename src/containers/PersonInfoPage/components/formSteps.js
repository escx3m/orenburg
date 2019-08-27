import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Chip from '@material-ui/core/Chip';
import { Field } from 'formik';

const renderTextField = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    {...field}
    {...props}
    fullWidth
    margin="dense"
    variant="outlined"
    error={touched[field.name] && !!errors[field.name]}
    helperText={touched[field.name] && errors[field.name]}
  />
);

const renderMultilineTextField = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    {...field}
    {...props}
    fullWidth
    multiline
    rows="4"
    margin="dense"
    variant="outlined"
    error={touched[field.name] && !!errors[field.name]}
    helperText={touched[field.name] && errors[field.name]}
  />
);

const renderCheckbox = ({ field, label, form: { touched, errors }, ...props }) => (
  <FormControlLabel
    control={
      <Checkbox
        {...field}
        checked={field.value}
        color="primary"
      />
    }
    label={label}
  />
);

const renderRadioGroup = ({ field, label, form: { touched, errors }, ...props }) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">{label}</FormLabel>
    <RadioGroup
      aria-label={label}
      name="ageGroup"
      {...field}
      row
    >
      <FormControlLabel value="1" control={<Radio />} label="0 - 1" />
      <FormControlLabel value="2" control={<Radio />} label="1 - 4" />
      <FormControlLabel value="3" control={<Radio />} label="4 - 7" />
    </RadioGroup>
  </FormControl>
);

export const PassengerForm = (props) => {
  const showAgeGroup = props.values.child;
  return (
    <>
      <Field
        name="lastName"
        label="Фамилия"
        component={renderTextField}
      />
      <Field
        name="firstName"
        label="Имя"
        component={renderTextField}
      />
      <Field
        name="middleName"
        label="Отчество"
        component={renderTextField}
      />
      <Field
        name="phone"
        label="Телефон"
        component={renderTextField}
      />
      <Field
        name="child"
        label="Детский билет"
        component={renderCheckbox}
      />
      {showAgeGroup && <Field
        name="ageGroup"
        label="Возрастная группа"
        component={renderRadioGroup}
      />}
    </>
  );
}

export const AddressForm = (props) => {
  const { cityFromText, cityToText, setFieldValue } = props;
  const showAirport = city => ['Волгоград', 'Астрахань', 'Ростов-на-Дону'].includes(city);
  return (
    <>
      <Field
        name="addressFrom"
        label="Адрес откуда"
        component={renderTextField}
      />
      {showAirport(cityFromText) && <Chip
        label="Аэропорт"
        size="small"
        onClick={() => setFieldValue('addressFrom', 'Аэропорт')}
      />}
      <Field
        name="addressTo"
        label="Адрес куда"
        component={renderTextField}
      />
      {showAirport(cityToText) && <Chip
        label="Аэропорт"
        size="small"
        onClick={() => setFieldValue('addressTo', 'Аэропорт')}
      />}
      <Field
        name="comment"
        label="Комментарий"
        component={renderMultilineTextField}
      />
    </>
  );
}
