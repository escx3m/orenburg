import React from 'react';
import PersonInfoForm from './components/PersonInfoForm';

class PersonInfoPage extends React.Component {
  submit = (data) => {
    console.log(this.props);
    console.log(data);
    this.props.history.push("/trips");
  }

  render() {
    return (
      <div>
        <PersonInfoForm submit={this.submit} />
      </div>
    );
  }
}

export default PersonInfoPage;
