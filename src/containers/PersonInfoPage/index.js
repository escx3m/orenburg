import React from 'react';
import PersonInfoForm from './components/PersonInfoForm';

class PersonInfoPage extends React.Component {
  submit = (data) => {
    console.log(data);
  }

  render() {
    return (
      <div>
        <PersonInfoForm onSubmit={this.submit} />
      </div>
    );
  }
}

export default PersonInfoPage;
