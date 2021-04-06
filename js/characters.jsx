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
            let chs = [];
            for(let i = 0; i < data.characters.length && chs.length < 50; i++) {
                let jp_va = data.characters[i].voice_actors.find((va) => (va.language == 'Japanese'));
                if (!jp_va) continue;
                data.characters[i].voice_actor = jp_va;
                chs.push(data.characters[i]);
            }
            this.setState({
                results: chs,
            });
        })
        .catch((error) => console.log(error));
    }

    componentDidMount() {
        this.updateResults();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.showId === this.props.showId) return;
        this.updateResults();
    }

    render() {
        return (
            <table>
            <tbody>
            {
                this.state.results.length !== 0 ?
                this.state.results.map((result) => (
                    <tr key={result.mal_id}>
                        <td><img src={result.image_url} width='100em'/></td>
                        <td>{result.name}</td>
                        <td>
                            <button onClick={() => this.props.characterSelectCallback(result)}>
                                {result.voice_actor.name}
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
    characterSelectCallback: PropTypes.func.isRequired,
};

export default Characters;
