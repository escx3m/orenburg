import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import InlineError from '../../../components/messages/InlineError';

class SearchForm extends React.Component {
  state = {
    data: {
      from: '',
      to: '',
      date: new Date(),
    },
    loading: false,
    errors: {},
  };

  handleDateChange = date => {
    this.setState({
      data: { ...this.state.data, date },
    });
  };

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props.submit(this.state.data);
    }
  };

  validate = data => {
    const errors = {};
    if (!data.from) errors.from = "Can't be blank";
    if (!data.to) errors.to = "Can't be blank";
    return errors;
  };

  render() {
    const { data, errors } = this.state;

    return (
      <Form onSubmit={this.onSubmit} style={{ marginTop: '3em' }}>
        <Form.Group widths='equal'>
          <Form.Field error={!!errors.from}>
            <input
              type="text"
              id="from"
              name="from"
              placeholder="Откуда"
              value={data.from}
              onChange={this.onChange}
            />
            {errors.from && <InlineError text={errors.from} />}
          </Form.Field>
          <Form.Field error={!!errors.to}>
            <input
              type="text"
              id="to"
              name="to"
              placeholder="Куда"
              value={data.to}
              onChange={this.onChange}
            />
            {errors.to && <InlineError text={errors.to} />}
          </Form.Field>
          <Form.Field>
            <DatePicker
              selected={data.date}
              onChange={this.handleDateChange}
              dateFormat="dd-MM-yyyy"
            />
          </Form.Field>
          <Form.Field>
            <Button fluid primary>Search</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default SearchForm;
