import React from 'react';
import PropTypes from 'prop-types';

class Characters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: []};
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults() {
        fetch(`https://api.jikan.moe/v3/anime/${this.props.showId}/characters_staff`)
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            let characters = data.characters
            characters = characters.filter((ch) => (ch.voice_actors.length > 0))
            for(let i = 0; i < characters.length; i++) {
                characters[i].voice_actors = characters[i].voice_actors.filter((va) => (va.language === 'Japanese'))
            }
            this.setState({
                results: characters
            });
        })
        .catch((error) => console.log(error));
    }

    componentDidMount() {
        this.updateResults();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.showId !== this.props.showId) {
            this.updateResults();
        }
    }

    render() {
        return (
            <table>
            <tbody>
            {
                this.state.results.length !== 0 ?
                this.state.results.map((result) => (
                    <tr key={result.mal_id}>
                        <td>{result.name}</td>
                        <td>
                            <button onClick={() => this.props.vaSelectCallback(result.voice_actors[0].mal_id)}>
                                {result.voice_actors[0].name}
                            </button>
                        </td>
                    </tr>
                )) :
                <tr><td>No Characters Found!</td></tr>
            }
            </tbody>
            </table>
        );
    }
}

Characters.propTypes = {
    showId: PropTypes.number.isRequired,
    vaSelectCallback: PropTypes.func.isRequired,
};

export default Characters;
