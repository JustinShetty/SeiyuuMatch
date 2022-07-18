import React from 'react';
import PropTypes from 'prop-types';
import {malRouteToUrl} from './proxy';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: []};
    this.updateResults = this.updateResults.bind(this);
  }

  updateResults() {
    if (this.props.searchTerm === '') return;
    this.setState({
      results: null,
    }, () => {
      fetch(malRouteToUrl(`anime?limit=10&q=${this.props.searchTerm}`),
          {redirect: 'follow'})
          .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
          })
          .then((json) => {
            this.setState({
              results: json.data,
            });
          })
          .catch((error) => console.warn(error));
    });
  }

  componentDidMount() {
    this.updateResults();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchTerm === this.props.searchTerm) return;
    this.updateResults();
  }

  render() {
    if (this.props.searchTerm === '') return <div/>;
    if (this.state.results === null) return <div>Loading...</div>;
    if (this.state.results.length < 1) return <div>0 Results</div>;
    return (
      <table className='pure-table'>
        <tbody>
          {this.state.results.map((result) => (
            <tr key={result.node.id} className='pure-u-1'>
              <td>
                <button
                  className='pure-button'
                  onClick={() => this.props.showSelectCallback(result)}>
                  {result.node.title}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Search.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  showSelectCallback: PropTypes.func.isRequired,
};

export default Search;
