import React from 'react';
import 'antd/dist/antd.css';
// import '../../src/styles/App.css';
import offer from './offero';
import confidential from './confidential';
import { Modal, Checkbox, Button } from 'antd';

class MOD extends React.Component {
  state = {
    visibleConditions: false,
    visibleCondif: false
  };

  showModalConditions = () => {
    this.setState({
      visibleConditions: true,
    });
  };

  handleOkConditions = e => {
    console.log(e);
    this.setState({
      visibleConditions: false,
    });
  };
  handleCancelConditions = e => {
    console.log(e);
    this.setState({
      visibleConditions: false,
    });
  };

  showModalCondif = () => {
    this.setState({
      visibleCondif: true,
    });
  };

  handleOkCondif = e => {
    console.log(e);
    this.setState({
      visibleCondif: false,
    });
  };
  handleCancelCondif = e => {
    console.log(e);
    this.setState({
      visibleCondif: false,
    });
  };

  render() {
    return (
      <div>
        <Checkbox onChange={this.props.toggleBtnFindTickets}>Я соглашаюсь с</Checkbox><span className="Cond" onClick={this.showModalConditions}>условиями</span> и <span className="Cond" onClick={this.showModalCondif}>политикой конфиденциальности</span>
        <Modal
          width="100%"
          title="Условия предоставления услуг"
          visible={this.state.visibleConditions}
          onOk={this.handleOkConditions}
          onCancel={this.handleCancelConditions}
          footer={[
            <Button className="BtnModal" key="submit" type="primary" onClick={this.handleOkConditions}> Ок </Button>
          ]}
        >
          {offer}
        </Modal>

        <Modal
          width="100%"
          title="Политика конфиденциальности"
          visible={this.state.visibleCondif}
          onOk={this.handleOkCondif}
          onCancel={this.handleCancelCondif}
          footer={[
            <Button className="BtnModal" key="submit" type="primary" onClick={this.handleOkCondif}> Ок </Button>
          ]}
        >
          {confidential}
        </Modal>
      </div>
    );
  }
}
export default MOD;