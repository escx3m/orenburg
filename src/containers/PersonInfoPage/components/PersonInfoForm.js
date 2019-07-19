import React, { Component } from 'react'
import { Form, Input, Select } from 'semantic-ui-react'

const optionsDoc = [
  { key: 'pass_rus', text: 'Паспорт РФ', value: 'pass_rus' },
  { key: 'int_pass', text: 'Заграничный паспорт РФ', value: 'int_pass' },
  { key: 'int_pass_not_rus', text: 'Иностранный документ', value: 'int_pass_not_rus' },
  { key: 'birth_cert', text: 'Свидетельство о рождении', value: 'birth_cert' },
];

const optionsSex = [
  { key: 'm', text: 'Муж.', value: 'male' },
  { key: 'f', text: 'Жен.', value: 'female' },
];

class PersonInfoForm extends Component {
  state = {}

  handleChange = (e, { value }) => this.setState({ value })

  render() {
    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Field control={Input} label='Фамилия' />
          <Form.Field control={Input} label='Имя' />
          <Form.Field control={Input} label='Отчество' />
        </Form.Group>
        <Form.Group>
          <Form.Field control={Select} compact label='Пол' options={optionsSex} width={2} />
          <Form.Field control={Select} label='Документ' options={optionsDoc} width={6} />
          <Form.Field control={Input} label='Номер документа' width={4} />
          <Form.Field control={Input} label='Дата рождения' width={4} />
        </Form.Group>
      </Form>
    )
  }
}

export default PersonInfoForm;
