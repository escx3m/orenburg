import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage, getIn } from 'formik';
import { Input, Checkbox, Radio, Button, Typography, Card, AutoComplete } from 'antd';
import MaskedInput from 'antd-mask-input';
import throttle from 'lodash.throttle';

import MOD from './../../../modal/ModalPolicy';
import { ticketPrices, cityZones, fastAccessLocation } from '../constants';
import * as Yup from 'yup';

const { TextArea } = Input;
const { Text } = Typography;
const gridStyle = {
  width: '100%',
};

const { ymaps } = window;

export const PassengersForm = (props) => {

  // const {
  //   cityFrom,
  //   cityTo,
  //   cityFromText,
  //   cityToText,
  //   values,
  //   touched,
  //   errors,
  //   dirty,
  //   handleBlur,
  //   handleSubmit,
  //   handleReset,
  //   isSubmitting } = props;

  const { cityFrom, cityTo, cityFromText, cityToText, placeOrder } = props;

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
    let result = 0;
    if ([cityFrom, cityTo].every(city => ['119', '23'].includes(city))) {
      const ticketPriceToElista = calculateTicketPrice(cityFrom, Elista, addressFrom, '', child);
      const ticketPriceFromElista = calculateTicketPrice(Elista, cityTo, '', addressTo, child);
      result = ticketPriceToElista + ticketPriceFromElista;
    } else {
      result = calculateTicketPrice(cityFrom, cityTo, addressFrom, addressTo, child);
    }
    // if ([cityFrom, cityTo].includes('119') && [addressFrom, addressTo].includes('Аэропорт(Платов)')) {
    //   const priceToAirport = Math.max(500, 1500 / seats);
    //   result += priceToAirport;
    // }
    return result;
  }

  const handleSubmitForm = (values) => {
    placeOrder(values);
    console.log(values.passengers[0].phone.replace(/[^0-9]/g, ''));
  }

  const handleChange = (city, inputValue) => {
    // if (city === 'Ростов-на-Дону' && name === 'addressFrom') {
    //   const newItems = fastAccessLocation[city].filter(({ value }) => value.toLowerCase().includes(inputValue));
    //   // setSuggestedAdresses(newItems);
    // } else {
    //   const boundedBy = cityZones[city];
    //   const itemsFastAccess = fastAccessLocation[city].filter(({ value }) => value.toLowerCase().includes(inputValue));
    //   ymaps.suggest(inputValue, { boundedBy }).then((items) => {
    //     const itemsFromYandex = items
    //       .filter(item => item.value.includes(city))
    //       .map((item, index) => ({ index, fullAddress: item.value, value: item.value.split(',').filter(item => !item.includes('Калмыкия')).slice(2).join(',') }));
    //     // setSuggestedAdresses([...itemsFastAccess, ...itemsFromYandex]);
    //   });
    // }
  }

  const passengers = []

  for (let i = 0; i < props.seats; i++) {
    passengers.push(
      {
        fullName: '',
        phone: '',
        addressFrom: '',
        fullAddressFrom: '',
        addressTo: '',
        fullAddressTo: '',
        comment: '',
        child: false,
        ageGroup: null,
        docs: false,
        baggage: false,
        ticketPrice: calculateTotalTicketPrice(cityFrom, cityTo, '', '', false),
        suggestedLocationsFrom: fastAccessLocation[cityFromText],
        suggestedLocationsTo: fastAccessLocation[cityToText],
      },
    );
  }

  const updateSuggestions = throttle((value, boundedBy, city, index, setFieldValue, name) => {
    if (name.includes('suggestedLocationsFrom') && city.includes('Ростов')) {
      const locations = fastAccessLocation[city].filter(location => location.value.toLowerCase().includes(value.toLowerCase()));
      setFieldValue(name, locations);
    } else {
      ymaps.suggest(value, { boundedBy }).then((items) => {
        const ymapsLocations = items
          .filter(item => item.value.includes(city))
          .map((item, index) => ({ index, fullAddress: item.value, value: item.value.split(',').filter(item => !item.includes('Калмыкия')).slice(2).join(',') }))
          .filter(item => item.value.length > 0);
        const locations = fastAccessLocation[city].filter(location => location.value.toLowerCase().includes(value.toLowerCase())).concat(ymapsLocations);
        setFieldValue(name, locations);
      });
    }
  }, 1500, { leading: false, trailing: true });

const isRequired = value => (!value ? "Обязятельное поле!" : "");
  
const validationSchema = Yup.object().shape({
  passengers: Yup.array()
    .of(
      Yup.object().shape({
        fullName: Yup.string()
          .min(5, "Слишком короткое ФИО")
          .max(100, "Слишком длинное ФИО")
          .required("Обязательное поле")
          .nullable(),
        phone: Yup.string()
          .required("Обязательное поле")
          .matches(/\+7\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}/, "Неправильный номер"),
        comment: Yup.string()
        .max(150, 'Не более 150 символов!'),
        birthday: Yup.string()
          .required("Обязательное поле")
          .matches(/\d{2}\.\d{2}\.\d{4}/, "Введите корректные данные"),
        passport: Yup.string()
          .required("Обязательное поле")
          .matches(/\d{4}\-\d{6}/, "Введите корректные данные!"),
      })
    )
  })

  const [disabledBtnBuy, setDisabledBtnBuy] = useState(true);

  return (
    <Formik
      initialValues={{ passengers }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      render={({ values, setFieldValue, handleSubmit }) => (
        <Form>
          <FieldArray
            name="passengers"
            render={arrayHelpers => {
              const totalPrice = values.passengers.reduce((sum, { ticketPrice }) => {
                return sum + ticketPrice;
              }, 0);
              return (
                <div>
                  {values.passengers.map((passenger, index) => {
                    const { addressFrom, addressTo, child, suggestedLocationsFrom, suggestedLocationsTo } = passenger;
                    const recalculateTotalTicketPrice = () => {
                      setFieldValue(`passengers.${index}.ticketPrice`, calculateTotalTicketPrice(cityFrom, cityTo, addressFrom, addressTo, child));
                    }
                    return (
                      <Card className="cardInfo" key={index} style={gridStyle}>
                        <h2>Пассажир №{index + 1}</h2>
                        <Field
                          name={`passengers[${index}].fullName`}
                          render={({ field, form, meta }) => (
                            <Input
                              {...field}
                              size="large"
                              value={field.value}
                              className="input-passenger"
                              placeholder="Фамилия Имя Отчество"
                            />
                          )}
                        /> 
                        <div className="input-error"><ErrorMessage name={`passengers[${index}].fullName`} /></div>
                        <Field
                          name={`passengers[${index}].phone`}
                          render={({ field }) => (
                            <MaskedInput
                              mask="+7 (111) 111 11 11"
                              {...field}
                              size="large"
                              className="input-passenger"
                            />
                          )}
                        />
                        <div className="input-error"><ErrorMessage name={`passengers[${index}].phone`} /></div>
                        <Field
                          name={`passengers[${index}].addressFrom`}
                          render={({ field }) => {
                            
                            const boundedBy = cityZones[cityFromText];

                            const onSelect = value => {
                              setFieldValue(`passengers.${index}.addressFrom`, value);
                              const fullAddress = suggestedLocationsFrom.find(item => value === item.value).fullAddress;
                              setFieldValue(`passengers.${index}.fullAddressFrom`, fullAddress);
                              setFieldValue(`passengers.${index}.ticketPrice`, calculateTotalTicketPrice(cityFrom, cityTo, value, addressTo, child));
                            }                            

                            const onChange = (value) => {
                              setFieldValue(`passengers.${index}.addressFrom`, value);
                              updateSuggestions(value, boundedBy, cityFromText, index, setFieldValue, `passengers.${index}.suggestedLocationsFrom`);
                            }

                            const onBlur = () => {
                              if (!dataSource.includes(field.value)) {
                                setFieldValue(`passengers.${index}.fullAddressFrom`, '');
                                if (cityFromText.includes('Ростов')) {
                                  onChange('');
                                }
                              }
                              recalculateTotalTicketPrice();
                            }

                            const dataSource = suggestedLocationsFrom.map(item => item.value);

                            return (
                              <AutoComplete
                                {...field}
                                size="large"
                                className="input-passenger"
                                placeholder="Откуда"
                                dataSource={dataSource}
                                onSelect={onSelect}
                                onBlur={onBlur}
                                onChange={onChange}
                              />
                            )
                          }}
                        />
                        <div className="input-error"><ErrorMessage name={`passengers[${index}].addressFrom`} /></div>
                        <Field
                          name={`passengers[${index}].addressTo`}
                          render={({ field }) => {
                            
                            const boundedBy = cityZones[cityToText];

                            const onSelect = value => {
                              setFieldValue(`passengers.${index}.addressTo`, value);
                              const fullAddress = suggestedLocationsTo.find(item => value === item.value).fullAddress;
                              setFieldValue(`passengers.${index}.fullAddressTo`, fullAddress);
                              setFieldValue(`passengers.${index}.ticketPrice`, calculateTotalTicketPrice(cityFrom, cityTo, addressFrom, value, child));
                            }

                            const onChange = (value) => {
                              setFieldValue(`passengers.${index}.addressTo`, value);
                              updateSuggestions(value, boundedBy, cityToText, index, setFieldValue, `passengers.${index}.suggestedLocationsTo`);
                            }

                            const onBlur = () => {
                              if (!dataSource.includes(field.value)) {
                                setFieldValue(`passengers.${index}.fullAddressTo`, '');
                              }
                              recalculateTotalTicketPrice();
                            }

                            const dataSource = suggestedLocationsTo.map(item => item.value);

                            return (
                              <AutoComplete
                                {...field}
                                size="large"
                                className="input-passenger"
                                placeholder="Куда"
                                dataSource={dataSource}
                                onSelect={onSelect}
                                onBlur={onBlur}
                                onChange={onChange}
                              />
                            )
                          }}
                        />
                        <div className="input-error"><ErrorMessage name={`passengers[${index}].addressTo`} /></div>
                        <Field
                          name={`passengers[${index}].comment`}
                          render={({ field }) => (
                            <TextArea {...field} size="large" className="input-passenger" rows={4} placeholder="Комментарий" />
                          )}
                        />
                        <div className="input-error"><ErrorMessage name={`passengers[${index}].comment`} /></div>
                        <div className="allModal">
                          <Field
                            name={`passengers[${index}].child`}
                            render={({ field: { value, ...rest } }) => (
                              <Checkbox
                                {...rest}
                                checked={value}
                                className="addModal"
                                onChange={(e) => {
                                  rest.onChange(e);
                                  const { addressFrom, addressTo, child } = passenger;
                                  const price = calculateTotalTicketPrice(cityFrom, cityTo, addressFrom, addressTo, !child);
                                  setFieldValue(`passengers[${index}].ticketPrice`, price);
                                }}
                              >Детский билет</Checkbox>
                            )}
                          />
                          {passenger.child &&
                            <Field
                              name={`passengers[${index}].ageGroup`}
                              render={({ field }) => (
                                <div style={{ marginTop: '10px' }}><Text className="ageGroup">Возраст</Text>
                                  <Radio.Group {...field} buttonStyle="solid" size="small">
                                    <Radio.Button value="1">0-1</Radio.Button>
                                    <Radio.Button value="2">1-4</Radio.Button>
                                    <Radio.Button value="3">4-7</Radio.Button>
                                  </Radio.Group></div>
                              )}
                            />
                          }
                          <div><Field
                            name={`passengers[${index}].baggage`}
                            render={({ field: { value, ...rest } }) => (
                              <Checkbox
                                {...rest}
                                className="addModal"
                                checked={value}
                                onChange={(e) => {
                                  !value && props.setVisibleBaggage(true);
                                  rest.onChange(e);
                                }}
                              >Дополнительный багаж</Checkbox>
                            )}
                          /></div>
                          <Field
                            name={`passengers[${index}].docs`}
                            render={({ field: { value, ...rest } }) => (
                              <Checkbox
                                {...rest}
                                className="addModal"
                                checked={value}
                                onChange={(e) => {
                                  !value && props.setVisibleDocs(true);
                                  rest.onChange(e);
                                }}
                              >Нужен отчетный документ</Checkbox>
                            )}
                          />
                          {passenger.docs && <>
                            <Field
                              name={`passengers[${index}].birthday`}
                              render={({ field }) => (
                                  <MaskedInput
                                    mask="11.11.1111"
                                    {...field}
                                    size="large"
                                    className="input-passenger"
                                    placeholder="Дата рождения 25.01.1999"
                                  />
                              )}
                            />
                             <div className="input-error"><ErrorMessage name={`passengers[${index}].birthday`} /></div>
                            <Field
                              name={`passengers[${index}].passport`}
                              render={({ field }) => (
                                  <MaskedInput
                                    mask="1111-111111"
                                    {...field}
                                    size="large"
                                    className="input-passenger"
                                    placeholder="Номер и серия паспорта"
                                  />
                              )}
                            />
                             <div className="input-error"><ErrorMessage name={`passengers[${index}].passport`} /></div>
                          </>
                          }
                        </div>
                      </Card>
                    )}
                  )}
                  <div>
                    <Card className="cardCondif"><MOD toggleBtnFindTickets={() => setDisabledBtnBuy(!disabledBtnBuy)}/></Card>
                  </div>
                  <Card className="cardPrice">Итого к оплате: {totalPrice} рублей</Card>
                  <Button  
                    type="primary" 
                    htmlType="submit" 
                    block 
                    className="payTicket"
                    disabled={disabledBtnBuy}
                  >ОПЛАТИТЬ</Button>
                </div>
              )
            }}
          />
        </Form>
      )}
    />
  );
}

export default PassengersForm;
