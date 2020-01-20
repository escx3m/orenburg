import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 450,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #3f51b5",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "5px"
  }
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const { open, setOpen } = props;

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
          <h2 id="simple-modal-title">
            Правила провоза багажа в такси MezhGorod
          </h2>
          <p id="simple-modal-description"></p>
          <p>
            В такси <strong>MezhGorod</strong> бесплатно разрешается перевозить
            до одной единиц багажа, вес не должен превышать 10 кг размером
            30*30*50 см.
          </p>
          <p>
            <strong>
              Оплачивается отдельно по 200 рублей за каждый последующий багаж:
            </strong>
          </p>
          <p>- вторая сумка;</p>
          <p>- чемодан;</p>
          <p>- дорожная сумка на колесиках;</p>
          <p>- солдатские мешки не более 30*30*50;</p>
          <p>- рюкзак не более 30*30*50;</p>
          <p>
            Негабаритный груз по стоимости посадочного места в зависимости от
            веса и размера (может занимать до нескольки мест)
          </p>
          <p>
            <strong>
              Все вопросы через диспетчера: +7 (922) 880 - 03 - 33 (работаем
              круглосуточно)
            </strong>
          </p>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            type="button"
            onClick={handleClose}
            style={{ float: "right" }}
          >
            Ok
          </Button>
        </div>
      </Modal>
    </div>
  );
}
