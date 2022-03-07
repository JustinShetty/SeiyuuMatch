import React from 'react';
import PropTypes from 'prop-types';

class Characters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: []};
    this.updateResults = this.updateResults.bind(this);
  }

  updateResults() {
    fetch(`https://api.jikan.moe/v4/anime/${this.props.showId}/characters`)
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
    if (prevProps.showId === this.props.showId) return;
    this.updateResults();
  }

  render() {
    if (this.state.results === null || this.state.results.length < 1) return <div/>;
    const indexedClassname = (index) => {
      return index % 2 === 1 ? 'pure-table-odd' : '';
    };
    return (
      <table className='pure-table'>
        {
                this.state.results.length > 0 ?
                this.state.results.map((item, index) => (
                  <tbody key={item.character.mal_id}>
                    <tr className={indexedClassname(index)}>
                      <td rowSpan='2'><img className='pure-img'
                        src={item.character.images.jpg.image_url}/></td>
                      <td>{item.character.name}</td>
                    </tr>
                    <tr className={indexedClassname(index)}>
                      <td>
                        <button onClick={() => this.props.characterSelectCallback(item)}>
                          {item.voice_actor.person.name}
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
