/* eslint-disable no-script-url */

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

export default function ListTrips({ trips, cityFrom, cityTo }) {
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {cityFrom} - {cityTo}
      </Typography>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Seats</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map(({ fromTime, availableSeats }, index) => (
            <TableRow key={index}>
              <TableCell>{fromTime.hours} : {fromTime.minutes}</TableCell>
              <TableCell>{availableSeats}</TableCell>
              <TableCell align="right">Купить</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
