import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, Field } from 'redux-form';
import { Form, Select, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import { cityOptions } from '../constants';

const renderDatePickerField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <DatePicker
    {...input}
    onBlur={() => input.onBlur()}
    error={touched && error}
    dateFormat="dd-MM-yyyy"
    selected={input.value}
    onChange={input.onChange}
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

class SearchForm extends React.Component {
  state = {
    loading: false
  };

  handleSwitchButtonClick = e => {
    e.preventDefault();
    const { cityFrom, cityTo, change, reset } = this.props;
    console.log(cityFrom, cityTo);
    reset();
    change('cityFrom', cityTo);
    change('cityTo', cityFrom);
  }

  render() {
    const { handleSubmit, cityFrom, cityTo } = this.props;
    const cityFromOptions = cityOptions.filter(city => city.value !== cityTo);
    const cityToOptions = cityOptions.filter(city => city.value !== cityFrom);
    return (
      <Form onSubmit={handleSubmit} style={{ marginTop: '3em' }}>
        <Form.Group>
          <Field name="cityFrom" component={renderSelectField} options={cityFromOptions} placeholder="Откуда" width={6} />
          <Form.Field>
            <Button icon='exchange' onClick={this.handleSwitchButtonClick} />
          </Form.Field>
          <Field name="cityTo" component={renderSelectField} options={cityToOptions} placeholder="Куда" width={6}/>
          <Form.Field>
            <Field name="date" component={renderDatePickerField} />
          </Form.Field>
          <Form.Field>
            <Button fluid primary>Search</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    )
  }

  // render() {
  //   const { data, errors } = this.state;

  //   return (
  //     <Form onSubmit={this.onSubmit} style={{ marginTop: '3em' }}>
  //       <Form.Group widths='equal'>
  //         <Form.Field 
  //           error={!!errors.from} 
  //           control={Select} 
  //           options={cityOptions} 
  //           id="from"
  //           name="from"
  //           placeholder="Откуда"
  //         />
  //         {errors.from && <InlineError text={errors.from} />}
  //         <Form.Field 
  //           error={!!errors.from}
  //           control={Select}
  //           options={cityOptions}
  //           id="to"
  //           name="to"
  //           placeholder="Куда"
  //         />
  //         {errors.from && <InlineError text={errors.from} />}
  //         <Form.Field>
  //           <DatePicker
  //             selected={data.date}
  //             onChange={this.handleDateChange}
  //             dateFormat="dd-MM-yyyy"
  //           />
  //         </Form.Field>
  //         <Form.Field>
  //           <Button fluid primary>Search</Button>
  //         </Form.Field>
  //       </Form.Group>
  //     </Form>
  //   );
  // }
}

SearchForm = reduxForm({
  form: 'searchFrom'
})(SearchForm);

const mapStateToProps = (state => {
  const selector = formValueSelector('searchFrom');
  const cityFrom = selector(state, 'cityFrom');
  const cityTo = selector(state, 'cityTo');
  return {
    cityFrom,
    cityTo
  };
});

export default connect(mapStateToProps)(SearchForm);
