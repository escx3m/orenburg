import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #3f51b5',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius:'5px',
    
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const { open, setOpen } = props;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Правила провоза багажа</h2>
          <p id="simple-modal-description"></p>
          <p>Бесплатно одно место багажа на одного человека размером 80 x 50 x 30 см. и весом не более 23 кг.</p>
          <p>Стоимость дополнительного багажа 100 рублей.</p>
          <p>Дополнительный багаж оплачивается водителю.</p>
          <p>Животные перевозятся только в клетках и с согласования всех остальных пассажиров.</p>
          <p>В случае габаритного багажа (длина одного измерения более 100 см или вес более 23 кг), уточните у оператора возможность его провоза.</p>
           <Button variant="contained" color="primary" className={classes.button} type="button"  onClick={handleClose} style={{float:'right'}}>Ok</Button>
        </div>
      </Modal>
    </div>
  );
}
