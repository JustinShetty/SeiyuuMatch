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
                    <button type='submit'>Search</button>
                </form>
                <table>
                <tbody>
                    {this.state.results.map((result) => (
                        <tr key={result.mal_id}>
                            {/* <td><img src={result.image_url} width='100em'/></td> */}
                            <td>
                            <div
                                onClick={() => this.props.showSelectCallback(result.mal_id)}>
                                <a>{result.title} [{result.type}]</a>
                            </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        );
    }
}

Search.propTypes = {
    showSelectCallback: PropTypes.func.isRequired,
};

export default Search;
