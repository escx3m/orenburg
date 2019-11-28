import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Box from '@material-ui/core/Box';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { PassengerForm, AddressForm } from './formSteps';
import { ticketPrices, discountChild, discountSale } from '../constants';

const { ymaps } = window;

const phoneRegExp = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){11}(\s*)?$/;
const passportRegExp = /\d{2}\s\d{2}\s\d{3}\s\d{3}/;
const birthdayRegExp = /\d{2}\.\d{2}\.\d{4}/;

const useStyles = makeStyles(theme => ({
  stepper: {
  },
  form: {
    display: "flex",
    flexDirection: "column",
  }
}));

const PassengerInfoDialog = (props) => {
  const {
    open,
    handleClose,
    addPassenger,
    updatePassenger,
    currentIndex,
    passengerValues,
    prevPassengerValues,
    showTakeFromPrevButton,
    cityFrom,
    cityTo,
    cityFromText,
    cityToText,
    seats,
  } = props;

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [activeStep, setActiveStep] = React.useState(0);
  const [fullAddressFrom, setFullAddressFrom] = React.useState('');
  const [fullAddressTo, setFullAddressTo] = React.useState('');

  const isLastStep = () => {
    return activeStep === steps.length - 1;
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleCancel = (formikBag) => {
    const { resetForm } = formikBag;
    setActiveStep(0);
    resetForm();
    handleClose();
  }

  const calculateTicketPrice = (cityFrom, cityTo, addressFrom, addressTo, child, ageGroup) => {
    let ticketRoute = `${cityFrom}-${cityTo}`
    if ((cityFrom !== '166') && addressFrom.toLowerCase().includes('аэропорт ')) {
      ticketRoute = `${cityFrom}air-${cityTo}`
    } else if ((cityTo !== '166') && addressTo.toLowerCase().includes('аэропорт ')) {
      ticketRoute = `${cityFrom}-${cityTo}air`
    }
    const ticketPrice = ticketPrices[ticketRoute]
    return child ? ticketPrice * discountChild[ageGroup] - discountSale : ticketPrice - discountSale;
  }

  const calculateTotalTicketPrice = (cityFrom, cityTo, addressFrom, addressTo, child, ageGroup) => {
    const Elista = '166';
    let result = 0;
    if ([cityFrom, cityTo].every(city => ['119', '23'].includes(city))) {
      const ticketPriceToElista = calculateTicketPrice(cityFrom, Elista, addressFrom, '', child, ageGroup);
      const ticketPriceFromElista = calculateTicketPrice(Elista, cityTo, '', addressTo, child, ageGroup);
      result = ticketPriceToElista + ticketPriceFromElista;
    } else {
      result = calculateTicketPrice(cityFrom, cityTo, addressFrom, addressTo, child, ageGroup);
    }
    if ([cityFrom, cityTo].includes('119') && [addressFrom, addressTo].includes('Аэропорт Платов')) {
      const priceToAirport = Math.max(500, 1500 / seats);
      result += priceToAirport;
    }
    return result;
  }

  const handleSubmit = (values, formikBag) => {
    const { setSubmitting, setTouched, resetForm } = formikBag;

    if (!isLastStep()) {
      setSubmitting(false);
      setTouched({});
      handleNext();
      return;
    }

    const { addressFrom, addressTo, child, phone } = values;
    const ageGroup = child ? values.ageGroup : null;
    const phoneOnlyNumbers = phone.replace(/\D+/g,"");
    const ticketPrice = calculateTotalTicketPrice(cityFrom, cityTo, addressFrom, addressTo, child, ageGroup);

    const addressFromPromise = fullAddressFrom !== '' ? ymaps.geocode(fullAddressFrom, { json: true, results: 1 }) : '';
    const addressToPromise = fullAddressTo !== '' ? ymaps.geocode(fullAddressTo, { json: true, results: 1 }) : '';
    Promise.all([addressFromPromise, addressToPromise])
      .then(coordinates => {
        const coordinatesFrom = coordinates[0] !== '' ? coordinates[0].GeoObjectCollection.featureMember[0].GeoObject.Point.pos : '';
        const coordinatesTo = coordinates[1] !== '' ? coordinates[1].GeoObjectCollection.featureMember[0].GeoObject.Point.pos : '';
        if (currentIndex === -1) {
          addPassenger({...values, ticketPrice, phone: phoneOnlyNumbers, coordinatesFrom, coordinatesTo ,ageGroup});
        } else {
          updatePassenger(currentIndex, {...values, ticketPrice, phone: phoneOnlyNumbers, coordinatesFrom, coordinatesTo, ageGroup});
        }
      })
      .catch(() => {
        if (currentIndex === -1) {
          addPassenger({...values, ticketPrice, phone: phoneOnlyNumbers, ageGroup});
        } else {
          updatePassenger(currentIndex, {...values, ticketPrice, phone: phoneOnlyNumbers, ageGroup});
        }
      });;
    resetForm();
    setSubmitting(false);
    setActiveStep(0);
    handleClose();
  }

  const setPrevPassengerValues = (setFieldValue) => {
    Object.keys(prevPassengerValues).forEach(key => {
      setFieldValue(key, prevPassengerValues[key]);
    })
  }

  const steps = ['Личные данные', 'Адреса'];

  const stepContents = [
    PassengerForm,
    AddressForm,
  ];

  const stepSchemas = [
    Yup.object().shape({
      sendDocs: Yup.boolean(),
      firstName: Yup.string()
        .max(50, 'Слишком длинное имя!')
        .required('Обязательное поле'),
      lastName: Yup.string()
        .max(50, 'Слишком длинная фамилия!')
        .required('Обязательное поле'),
      phone: Yup.string()
        .matches(phoneRegExp, 'Неправильный номер')
        .required('Обязательное поле'),
      birthday: Yup.string()
        .when('sendDocs', {
          is: true,
          then: Yup.string()
            .required("Обязательное поле")
            .matches(birthdayRegExp, "Неполные данные")
        }),
      passport: Yup.string()
       .when('sendDocs', {
          is: true,
          then: Yup.string()
            .required("Обязательное поле")
            .matches(passportRegExp, "Неполные данные")
        }),
    }),
    Yup.object().shape({
      comment: Yup.string()
        .max(150, 'Не более 150 символов!')
    }),
  ];

  const CurrentStep = stepContents[activeStep];
  const validationSchema = stepSchemas[activeStep];

  return (
    <Formik
      initialValues={{
        lastName: '',
        firstName: '',
        middleName: '',
        phone: '',
        addressFrom: '',
        addressTo: '',
        comment: '',
        child: false,
        ageGroup: '0-3',
        sendDocs: false,
        passport: '', 
        birthday: '',

        ...passengerValues,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      render={(formikBag) => {
        return (
          <Dialog
            fullScreen={fullScreen}
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={() => handleCancel(formikBag)}
            aria-labelledby="form-dialog-title">
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <DialogContent>
              <Form className={classes.form}>
                <CurrentStep
                  {...formikBag}
                  cityFromText={cityFromText}
                  cityToText={cityToText}
                  fullAddressFrom={fullAddressFrom}
                  setFullAddressFrom={setFullAddressFrom}
                  fullAddressTo={fullAddressTo}
                  setFullAddressTo={setFullAddressTo}
                  showTakeFromPrevButton={showTakeFromPrevButton}
                  setPrevPassengerValues={() => setPrevPassengerValues(formikBag.setFieldValue)}
                />
              </Form>
              <div style={{ width: '100%' }}>
                <Box display="flex" p={1} bgcolor="background.paper">
                  <Box p={1} flexGrow={1}>
                    <Button onClick={() => handleCancel(formikBag)} color="primary">
                      Отмена
                    </Button>
                  </Box>
                  <Box p={1}>
                    {
                      activeStep === 1 && 
                      <Button onClick={handleBack} color="primary">
                        Назад
                      </Button>
                    }
                  </Box>
                  <Box p={1}>
                    <Button onClick={formikBag.handleSubmit} variant="contained" color="primary">
                      {activeStep === 0 ? 'Далее' : 'Ок'}
                    </Button>
                  </Box>
                </Box>
              </div>
            </DialogContent>
          </Dialog>
        );
      }}
    />
  );
};

export default PassengerInfoDialog;
