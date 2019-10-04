import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from "@material-ui/core/Paper";
import ListItem from '@material-ui/core/ListItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Chip from '@material-ui/core/Chip';
import { Field } from 'formik';
import Downshift from "downshift";

import { cityZones, allowedAddressesRostov } from '../constants';


const useStyles = makeStyles(theme => ({
  stepper: {
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 100,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
}));

const renderDownShift = (props) => {
  const { ymaps } = window;
  const {
    classes,
    suggestedAdresses,
    setSuggestedAdresses,
    setFullAddress,
    field: { name, value },
    form,
    label,
    city
  } = props;
  
  const handleChange = (e) => {
    form.handleChange(e);
    const inputValue = e.target.value.trim().toLowerCase();
    if (city === 'Ростов-на-Дону' && name === 'addressFrom') {
      const newItems = Object.keys(allowedAddressesRostov)
        .filter(key => key.toLowerCase().includes(inputValue))
        .map(item => ({ value: item }));
      setSuggestedAdresses(newItems);
    } else {
      const boundedBy = cityZones[city];
      ymaps.suggest(inputValue, { boundedBy }).then((items) => {
        const newItems = items.map((item, index) => ({ index, fullAddress: item.value, value: item.value.split(',').filter(item => !item.includes('Калмыкия')).slice(2).filter(item => !item.includes('Калмыкия')).join(',') }));
        setSuggestedAdresses(newItems);
      });
    }
  }

  return (
    <Downshift
      onChange={selection => {
        const value = selection ? selection.value : '';
        form.setFieldValue(name, value);
      }}
      itemToString={item => (item ? item.value : '')}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div className={classes.container}>
          <TextField {...getInputProps({
            name,
            onChange: handleChange,
            onBlur: () => setFullAddress(selectedItem.fullAddress),
            value,
            label,
            variant: "outlined",
            margin: "dense",
            fullWidth: true
          })} />
          <div {...getMenuProps()}>
            {isOpen
              ? (
                <Paper className={classes.paper} square>
                  {suggestedAdresses
                    .map((item, index) => (
                        <ListItem key={index}
                          button
                          {...getItemProps({
                            key: index,
                            index,
                            item,
                            style: {
                              backgroundColor:
                                highlightedIndex === index ? 'lightgray' : 'white',
                              fontWeight: selectedItem === item ? 'bold' : 'normal',
                            },
                          })}
                        >
                          {item.value}
                        </ListItem>
                    ))}
                </Paper>
              )
              : null}
          </div>
        </div>
      )}
    </Downshift>
  );
}

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
    rows="6"
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
  const { showTakeFromPrevButton, setPrevPassengerValues } = props;
  return (
    <>
      <Field
        required
        name="lastName"
        label="Фамилия"
        component={renderTextField}
      />
      <Field
        required
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
        required
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
      {showTakeFromPrevButton && <Chip
        label="Взять у предыдущего"
        size="small"
        onClick={() => setPrevPassengerValues()}
      />}
    </>
  );
}

export const AddressForm = (props) => {
  const classes = useStyles();

  const [suggestedAdresses, setSuggestedAdresses] = useState([]);

  const { cityFromText, cityToText, setFullAddressFrom, setFullAddressTo } = props;
  const commentPlaceholder = `-Укажите доп. информацию для водителя.\r\n-Время прилета/вылета, отправления/прибытия поезда\r\n-Багаж, возраст детей, доп. телефон для связи.`;
  return (
    <>
      <Field
        name="addressFrom"
        label="Адрес откуда"
        suggestedAdresses={suggestedAdresses}
        setSuggestedAdresses={setSuggestedAdresses}
        classes={classes}
        city={cityFromText}
        setFullAddress={setFullAddressFrom}
        component={renderDownShift}
      />
      <Field
        name="addressTo"
        label="Адрес куда"
        suggestedAdresses={suggestedAdresses}
        setSuggestedAdresses={setSuggestedAdresses}
        setFullAddress={setFullAddressTo}
        classes={classes}
        city={cityToText}
        component={renderDownShift}
      />
      <Field
        name="comment"
        label="Комментарий"
        placeholder={commentPlaceholder}
        component={renderMultilineTextField}
      />
    </>
  );
}
