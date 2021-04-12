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
            <div className='pure-g'>
                <form className='pure-u-1 pure-form' onSubmit={this.handleSubmit}>
                    <input
                        type='text'
                        placeholder='Anime Name'/>
                    <button type='submit' className='pure-button pure-button-primary'>Search</button>
                </form>
                <div className='pure-u-1 pure-g'>
                    {this.state.results.map((result) => (
                        <div key={result.mal_id} className='pure-u-1'>
                            <div
                                onClick={() => this.props.showSelectCallback(result)}>
                                <a>{result.title} [{result.type}]</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

Search.propTypes = {
    showSelectCallback: PropTypes.func.isRequired,
};

export default Search;
