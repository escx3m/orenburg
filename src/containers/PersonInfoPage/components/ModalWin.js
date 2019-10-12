import { Modal, Button, Checkbox } from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import offer from './offero';
import confidential from './confidential';
  
class ModalWin extends React.Component {
  state = { 
    confidentialVisible: false,
    offerVisible: false 
  };

  showConfidentialModal = () => {
    this.setState((state) => ({
      ...state,
      confidentialVisible: true
    }));
    
  };

  showOfferModal = () => {
    this.setState((state) => ({
      ...state,
      offerVisible: true
    }));
    
  };

  handleOfferOk = e => {
    this.setState((state) => ({
      ...state,
      offerVisible: false
    }));
  };

  handleOfferCancel = e => {
    this.setState((state) => ({
      ...state,
      offerVisible: false
    }));
  };

  handleConfidentialOk = e => {
    this.setState((state) => ({
      ...state,
      confidentialVisible: false
    }));
  };

  handleConfidentialCancel = e => {
    this.setState((state) => ({
      ...state,
      confidentialVisible: false
    }));
  };

  render() {
    return (
        <div style={{margin: '10px auto'}} className="div-policy">
          <Checkbox 
            onChange={this.props.toggleBtnFindTickets}
          ></Checkbox> Я соглашаюсь с <span className="link-to-doc" onClick={this.showOfferModal}> условиями </span>
            и <span className="link-to-doc" onClick={this.showConfidentialModal}> политикой конфиденциальности </span>         
          <Modal
            width="100%"
            title="Условия предоставления услуг"
            visible={this.state.offerVisible}
            onCancel={this.handleOfferCancel}
            className="policy"
            footer={
              <Button type="primary" style={{color: 'blue', cursor: 'pointer'}} onClick={this.handleOfferOk}>
                Ok
              </Button>
            }
          >
            {offer}
          </Modal>
          <Modal
            width="100%"
            title="Политика в отношении обработки персональных данных"
            visible={this.state.confidentialVisible}
            onCancel={this.handleConfidentialCancel}
            className="policy"
            footer={
              <Button type="primary" style={{color: 'blue'}} onClick={this.handleConfidentialOk}>
                Ok
              </Button>
            }
          >
            {confidential}
          </Modal>
          <br/>
        </div>
    );
  }
}

export default ModalWin;
