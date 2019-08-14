import React from 'react';
import { Route } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SearchPage from './containers/SearchPage';
import PersonInfoPage from './containers/PersonInfoPage';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Альфа-Тур '}
      {new Date().getFullYear()}
    </Typography>
  );
}

function App() {
  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
    main: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(2),
    },
    footer: {
      padding: theme.spacing(4),
      marginTop: 'auto',
    },
  }));

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="sm" >
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Альфа-Тур
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="sm" >
        <Route path="/" exact component={SearchPage} />
        <Route path="/personInfo" component={PersonInfoPage} />
      </Container>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </div>
  );
}

export default App;
