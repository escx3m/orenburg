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
import ModalWinBaggage from './ModalWinBaggage';
import ModalDocs from './ModalDocs';

import { cityZones, fastAccessLocation } from '../constants';


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
    fullAddress,
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
      const newItems = fastAccessLocation[city].filter(({ value }) => value.toLowerCase().includes(inputValue));
      setSuggestedAdresses(newItems);
    } else {
      const boundedBy = cityZones[city];
      const itemsFastAccess = fastAccessLocation[city].filter(({ value }) => value.toLowerCase().includes(inputValue));
      ymaps.suggest(inputValue, { boundedBy }).then((items) => {
        const itemsFromYandex = items
          .filter(item => item.value.includes(city))
          .map((item, index) => ({ index, fullAddress: item.value, value: item.value.split(',').filter(item => !item.includes('Калмыкия')).slice(2).join(',') }));
        setSuggestedAdresses([...itemsFastAccess, ...itemsFromYandex]);
      });
    }
  }

  return (
    <Downshift
      onChange={selection => {
        selection && form.setFieldValue(name, selection.value);
      }}
      itemToString={item => (item ? item.value : '')}
      initialSelectedItem={{ value, fullAddress }}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        clearSelection,
        selectedItem,
      }) => (
        <div className={classes.container}>
          <TextField {...getInputProps({
            name,
            onChange: (e) => {
              handleChange(e);
              clearSelection();
            },
            onBlur: () => {
              if (city === 'Ростов-на-Дону' && name === 'addressFrom' && !selectedItem) {
                form.setFieldValue(name, '');
              }
              if (selectedItem) {
                setFullAddress(selectedItem.fullAddress);
                form.setFieldValue(name, selectedItem.value);
              } else {
                setFullAddress('');
              }
            },
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
                            item
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
        onChange={(e) => {
          const { setOpenModal } = props;
          !field.value && setOpenModal && setOpenModal(true);
          field.onChange(e);
        }}
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
      <FormControlLabel value="0-1" control={<Radio />} label="0 - 1" />
      <FormControlLabel value="1-4" control={<Radio />} label="1 - 4" />
      <FormControlLabel value="4-7" control={<Radio />} label="4 - 7" />
    </RadioGroup>
  </FormControl>
);

export const PassengerForm = (props) => {
  const showAgeGroup = props.values.child;
  const showSendDocs = props.values.sendDocs;
  const { showTakeFromPrevButton, setPrevPassengerValues } = props;
  const [openDocsModal, setOpenDocsModal] = React.useState(false);
  const [openBaggageModal, setOpenBaggageModal] = React.useState(false);

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
       <Field
        name="baggage"
        label="Дополнительный багаж"
        setOpenModal={setOpenBaggageModal}
        component={renderCheckbox}
      />
      <Field
        name="sendDocs"
        label="Нужен отчетный документ"
        setOpenModal={setOpenDocsModal}
        component={renderCheckbox}
      />
      {showSendDocs && <Field
        name="birthday"
        label="Дата рождения"
        component={renderTextField}
      />}
      {showSendDocs && <Field
        name="passport"
        label="Серия и номер паспорта"
        component={renderTextField}
      />}
      {showTakeFromPrevButton && <Chip
        label="Взять у предыдущего"
        size="small"
        onClick={() => setPrevPassengerValues()}
      />}
       <ModalWinBaggage open={openBaggageModal} setOpen={setOpenBaggageModal} styles={{borderRadius:'5px'}} />
       <ModalDocs open={openDocsModal} setOpen={setOpenDocsModal} />
    </>
  );
}

export const AddressForm = (props) => {
  const classes = useStyles();

  const [suggestedAdresses, setSuggestedAdresses] = useState([]);

  const { cityFromText, cityToText, fullAddressFrom, fullAddressTo, setFullAddressFrom, setFullAddressTo } = props;
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
        fullAddress={fullAddressFrom}
        setFullAddress={setFullAddressFrom}
        component={renderDownShift}
      />
      <Field
        name="addressTo"
        label="Адрес куда"
        suggestedAdresses={suggestedAdresses}
        setSuggestedAdresses={setSuggestedAdresses}
        fullAddress={fullAddressTo}
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
