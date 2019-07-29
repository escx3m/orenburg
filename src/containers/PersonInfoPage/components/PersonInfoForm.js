import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Form, Input, Select, Button } from 'semantic-ui-react';

const documentOptions = [
  { key: 'pass_rus', text: 'Паспорт РФ', value: 'pass_rus' },
  { key: 'int_pass', text: 'Заграничный паспорт РФ', value: 'int_pass' },
  { key: 'int_pass_not_rus', text: 'Иностранный документ', value: 'int_pass_not_rus' },
  { key: 'birth_cert', text: 'Свидетельство о рождении', value: 'birth_cert' },
];

const genderOptions = [
  { key: 'm', text: 'Муж.', value: 'male' },
  { key: 'f', text: 'Жен.', value: 'female' },
];

const validate = values => {
  const errors = {}
  if (!values.lastName) {
    errors.lastName = 'Введите фамилию'
  }
  if (!values.firstName) {
    errors.firstName = 'Введите имя'
  }
  if (!values.middleName) {
    errors.middleName = 'Введите отчество'
  }
  if (!values.gender) {
    errors.gender = 'Выберите пол'
  }
  if (!values.document) {
    errors.document = 'Выберите тип документа'
  }
  if (!values.documentNumber) {
    errors.documentNumber = 'Введите номер документа'
  }
  if (!values.birthDate) {
    errors.birthDate = 'Введите дату рождения'
  }
  // if (!values.email) {
  //   errors.email = 'Required'
  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = 'Invalid email address'
  // }
  return errors
}

const renderInputField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <Form.Field 
    control={Input}
    label={label}
    error={touched && error}
    {...input}
    {...custom}
  />
);

const renderSelectField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <Form.Field 
    control={Select}
    label={label}
    value={input.value}
    error={touched && error}
    {...input}
    onChange={(event, data) => {
      input.onChange(data.value);
    }}
    {...custom}
  />
);

const renderPersons = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Form.Field control={Button} onClick={() => fields.push()}>Add person</Form.Field>
  
    {fields.map((person, index) => (
      <div key={index}>
        <Form.Group widths='equal'>
          <Field name={`${person}.lastName`} component={renderInputField} label="Фамилия"/>
          <Field name={`${person}.firstName`} component={renderInputField} label="Имя"/>
          <Field name={`${person}.middleName`} component={renderInputField} label="Отчество"/>
        </Form.Group>
        <Form.Group>
          <Field name={`${person}.gender`} component={renderSelectField} label="Пол" compact options={genderOptions} width={2} />
          <Field name={`${person}.document`} component={renderSelectField} label="Документ" compact options={documentOptions} width={6} />
          <Field name={`${person}.documentNumber`} component={renderInputField} label="Номер документа" width={4} />
          <Field name={`${person}.birthDate`} component={renderInputField} label="Дата рождения" width={4} />
        </Form.Group>
      </div>
    ))}
  </div>
);

class PersonInfoForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <FieldArray name="persons" component={renderPersons} />
        <Form.Field
          control={Button}
          content='Confirm'
        />
      </Form>
    )
  }
}

PersonInfoForm = reduxForm({
  form: 'personInfo',
  validate
})(PersonInfoForm);

export default PersonInfoForm;
