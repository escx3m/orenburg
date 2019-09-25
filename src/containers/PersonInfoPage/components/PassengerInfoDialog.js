import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Box from '@material-ui/core/Box';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { PassengerForm, AddressForm } from './formSteps';
import { ticketPrices } from '../constants';

const { ymaps } = window;

const phoneRegExp = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,11}(\s*)?$/;

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
  } = props;

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [activeStep, setActiveStep] = React.useState(0);

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

  const calculateTicketPrice = (cityFrom, cityTo, addressFrom, addressTo, child) => {
    let ticketRoute = `${cityFrom}-${cityTo}`
    if ((cityFrom !== '166') && addressFrom.toLowerCase().includes('аэропорт ')) {
      ticketRoute = `${cityFrom}air-${cityTo}`
    } else if ((cityTo !== '166') && addressTo.toLowerCase().includes('аэропорт ')) {
      ticketRoute = `${cityFrom}-${cityTo}air`
    }
    const ticketPrice = ticketPrices[ticketRoute]
    return child ? ticketPrice - 100 : ticketPrice;
  }

  const calculateTotalTicketPrice = (cityFrom, cityTo, addressFrom, addressTo, child) => {
    const Elista = '166';
    if ([cityFrom, cityTo].every(city => ['119', '23'].includes(city))) {
      const ticketPriceToElista = calculateTicketPrice(cityFrom, Elista, addressFrom, '', child);
      const ticketPriceFromElista = calculateTicketPrice(Elista, cityTo, '', addressTo, child);
      return ticketPriceToElista + ticketPriceFromElista;
    } else {
      return calculateTicketPrice(cityFrom, cityTo, addressFrom, addressTo, child);
    }
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
    const phoneOnlyNumbers = phone.replace(/\D+/g,"");
    const ticketPrice = calculateTotalTicketPrice(cityFrom, cityTo, addressFrom, addressTo, child);
    
    const addressFromPromise = addressFrom !== '' ? ymaps.geocode(addressFrom, { json: true, results: 1 }) : '';
    const addressToPromise = addressTo !== '' ? ymaps.geocode(addressTo, { json: true, results: 1 }) : '';
    Promise.all([addressFromPromise, addressToPromise]).then(coordinates => {
      const coordinatesFrom = coordinates[0] !== '' ? coordinates[0].GeoObjectCollection.featureMember[0].GeoObject.Point.pos : '';
      const coordinatesTo = coordinates[1] !== '' ? coordinates[1].GeoObjectCollection.featureMember[0].GeoObject.Point.pos : '';
      if (currentIndex === -1) {
        addPassenger({...values, ticketPrice, phone: phoneOnlyNumbers, coordinatesFrom, coordinatesTo});
      } else {
        updatePassenger(currentIndex, {...values, ticketPrice, phone: phoneOnlyNumbers, coordinatesFrom, coordinatesTo});
      }
    });
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
      firstName: Yup.string()
        .max(50, 'Слишком длинное имя!')
        .required('Обязательное поле'),
      lastName: Yup.string()
        .max(50, 'Слишком длинная фамилия!')
        .required('Обязательное поле'),
      phone: Yup.string()
        .matches(phoneRegExp, 'Неправильный номер')
        .required('Обязательное поле'),
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
        ageGroup: '1',
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
