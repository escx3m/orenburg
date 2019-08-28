import React from 'react';
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

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
    cityFrom,
    cityTo,
    cityFromText,
    cityToText,
  } = props;

  const classes = useStyles();
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
    if (addressFrom.toLowerCase() === 'аэропорт') {
      ticketRoute = `${cityFrom}air-${cityTo}`
    } else if (addressTo.toLowerCase() === 'аэропорт') {
      ticketRoute = `${cityFrom}-${cityTo}air`
    }
    console.log('ticketRoute', ticketRoute);
    const ticketPrice = ticketPrices[ticketRoute]
    return child ? ticketPrice - 100 : ticketPrice;
  }

  const handleSubmit = (values, formikBag) => {
    const { setSubmitting, setTouched, resetForm } = formikBag;

    if (!isLastStep()) {
      setSubmitting(false);
      setTouched({});
      handleNext();
      return;
    }

    const { addressFrom, addressTo, child } = values;
    const ticketPrice = calculateTicketPrice(cityFrom, cityTo, addressFrom, addressTo, child);
    console.log('ticketPrice', ticketPrice);
    
    console.log('addPassenger');
    if (currentIndex === -1) {
      addPassenger({...values, ticketPrice});
    } else {
      updatePassenger(currentIndex, {...values, ticketPrice});
    }
    resetForm();
    setSubmitting(false);
    setActiveStep(0);
    handleClose();
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
      addressFrom: Yup.string()
        .max(50, 'Слишком длинный адрес!')
        .required('Обязательное поле'),
      addressTo: Yup.string()
        .max(50, 'Слишком длинный адрес!')
        .required('Обязательное поле'),
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
          <Dialog open={open} onClose={() => handleCancel(formikBag)} aria-labelledby="form-dialog-title">
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <DialogContent>
              <Form className={classes.form}>
                <CurrentStep {...formikBag} cityFromText={cityFromText} cityToTex={cityToText}/>
              </Form>
            </DialogContent>
            <DialogActions>
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
            </DialogActions>
          </Dialog>
        );
      }}
    />
  );
};

export default PassengerInfoDialog;
