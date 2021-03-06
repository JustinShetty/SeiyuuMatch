import React from 'react';
import PropTypes from 'prop-types';

class Characters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: []};
    this.updateResults = this.updateResults.bind(this);
  }

  updateResults() {
    // TODO replace this with the official API some day
    fetch(`https://api.jikan.moe/v4/anime/${this.props.animeId}/characters`)
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((json) => {
          const characters = json.data;
          const chs = [];
          for (let i = 0; i < characters.length && chs.length < 50; i++) {
            const jpVa = characters[i].voice_actors.find((va) => (va.language == 'Japanese'));
            if (!jpVa) continue;
            characters[i].voice_actor = jpVa;
            chs.push(characters[i]);
          }
          this.setState({
            results: chs,
          });
        })
        .catch((error) => console.warn(error));
  }

  componentDidMount() {
    this.updateResults();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.animeId === this.props.animeId) return;
    this.updateResults();
  }

  render() {
    if (this.state.results === null || this.state.results.length < 1) return <div/>;
    return (
      <div className='tile-container'>
        {
          this.state.results.map((item) => (
            <div key={item.character.mal_id} className='tile'>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <img className='pure-img'
                        src={item.character.images.jpg.image_url}/>
                    </td>
                  </tr>
                  <tr><td>{item.character.name}</td></tr>
                  <tr>
                    <td>
                      <button onClick={() => this.props.characterSelectCallback(item)}>
                        {item.voice_actor.person.name}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        }
      </div>
    );
  }
}

Characters.propTypes = {
  animeId: PropTypes.number.isRequired,
  characterSelectCallback: PropTypes.func.isRequired,
};

export default Characters;
