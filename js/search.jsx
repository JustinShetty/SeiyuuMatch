import React from 'react';
import PropTypes from 'prop-types';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: []};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const search_term = e.target[0].value;
        fetch(`https://api.jikan.moe/v3/search/anime?limit=10&q=${search_term}`)
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

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type='text'
                        placeholder='Anime Name'/>
                </form>
                {this.state.results.map((result) => (
                    <div
                        key={result.mal_id}
                        onClick={() => this.props.showSelectCallback(result.mal_id)}>
                        <button>{result.title} [{result.type}]</button>
                    </div>
                ))}
            </div>
        );
    }
}

Search.propTypes = {
    showSelectCallback: PropTypes.func.isRequired,
};

export default Search;
