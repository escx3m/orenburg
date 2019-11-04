import React from 'react';
import 'antd/dist/antd.css';
import '../../src/styles/App.css';
import { Modal, Checkbox, Button } from 'antd';

class ModBag extends React.Component {
    state = {
        visibleBaggage: false,
        addBaggage: false,
    };
    onChange = () => {
        this.setState({
            addBaggage: !this.state.addBaggage,
            visibleBaggage: !this.state.addBaggage,
        });

    };
    showModalBaggage = () => {
        this.setState({
            visibleBaggage: true,
        });
    };

    handleOkBaggage = e => {
        console.log(e);
        this.setState({
            visibleBaggage: false,
        });
    };
    handleCancelBaggage = e => {
        console.log(e);
        this.setState({
            visibleBaggage: false,
        });
    };
    render() {
        return (
            <div>
                <Checkbox onChange={this.onChange} checked={this.state.addBaggage}>Дополнительный багаж</Checkbox>
                <Modal
                    title="Правила провоза багажа1"
                    visible={this.state.visibleBaggage}
                    onOk={this.handleOkBaggage}
                    onCancel={this.handleCancelBaggage}
                    footer={[
                        <Button className="BtnModal" key="submit" type="primary" onClick={this.handleOkBaggage}> Ок </Button>
                    ]}
                >
                    <p>Бесплатно одно место багажа на одного человека размером 80 x 50 x 30 см. и весом не более 23 кг.</p>
                    <p>Стоимость дополнительного багажа 100 рублей.</p>
                    <p>Дополнительный багаж оплачивается водителю.</p>
                    <p>Животные перевозятся только в клетках и с согласования всех остальных пассажиров.</p>
                    <p>В случае габаритного багажа (длина одного измерения более 100 см или вес более 23 кг), уточните у оператора возможность его провоза.</p>
                </Modal>
            </div>
        );
    }
}
function MB() {
    return (
        <ModBag />
    );
}
export default MB;