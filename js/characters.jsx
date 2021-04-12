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
        const indexed_classname = (index) => {
            return index % 2 === 1 ? 'pure-table-odd' : ''
        };
        return (
            <table className='pure-table'>
            {
                this.state.results.length > 0 ?
                this.state.results.map((character, index) => (
                    <tbody key={character.mal_id}>
                        <tr className={indexed_classname(index)}>
                            <td rowSpan='2'><img className='pure-img' src={character.image_url}/></td>
                            <td>{character.name}</td>
                        </tr>
                        <tr className={indexed_classname(index)}>
                            <td>
                            <button onClick={() => this.props.characterSelectCallback(character)}>
                                {character.voice_actor.name}
                            </button>
                            </td>
                        </tr>
                    </tbody>
                )) :
                <tbody><tr><td>No Characters Found!</td></tr></tbody>
            }
            </table>
        );
    }
}

Characters.propTypes = {
    showId: PropTypes.number.isRequired,
    characterSelectCallback: PropTypes.func.isRequired,
};

export default Characters;
