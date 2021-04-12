import React from 'react';
import PropTypes from 'prop-types';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: []};
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults() {
        if (this.props.searchTerm === '') return;
        fetch(`https://api.jikan.moe/v3/search/anime?limit=10&q=${this.props.searchTerm}`, {redirect: 'follow'})
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({
                results: data.results
            });
        })
        .catch((error) => console.log(error));
    }

    componentDidMount() {
        this.updateResults();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.searchTerm === this.props.searchTerm) return;
        this.updateResults();
    }

    render() {
        return (
            <table className='pure-table'>
            <tbody>
                {this.state.results.map((result) => (
                    <tr key={result.mal_id} className='pure-u-1'>
                        <td>
                            <button className='pure-button' onClick={() => this.props.showSelectCallback(result)}>
                                {result.title} [{result.type}]
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
