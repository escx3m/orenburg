import React from 'react';
import { connect } from 'react-redux';

import SearchForm from './components/SearchForm';
import ListTrips from './components/ListTrips';
import { getTrips } from './actions';
class SearchPage extends React.Component {
  submit = (data) => {
    this.props.getTrips();
  }

  render() {
    const { trips, loading } = this.props;
    const showTrips = !!trips.length;
    return (
      <div>
        <SearchForm submit={this.submit} />
        {loading && 'Loading...'}
        {showTrips && <ListTrips trips={trips} />}
      </div>
    );
  }
}

const mapStateToProps = ({ trips: { trips, loading, error } }) => ({ trips, loading, error });

export default connect(mapStateToProps, { getTrips })(SearchPage);
