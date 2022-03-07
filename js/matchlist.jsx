import React from 'react';
import PropTypes from 'prop-types';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com';

class MatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: null};
    this.updateResults = this.updateResults.bind(this);
  }

  updateResults() {
    // TODO: pagination (with &offset={offset}). only 300 results are returned at a time
    Promise.all([
      fetch(`${CORS_PROXY}/https://myanimelist.net/animelist/` +
            `${this.props.username}/load.json?status=7` /* status=7 means all anime */),
      fetch(`https://api.jikan.moe/v4/people/${this.props.va.mal_id}/voices`,
          {redirect: 'follow'}),
    ])
        .then((responses) => {
          return Promise.all(responses.map((response) => {
            // TODO: handle invalid usernames more gracefully
            if (!response.ok) throw Error(response.statusText);
            return response.json();
          }));
        })
        .then(([userData, vaData]) => {
          const usersAnime = {};
          for (const item of userData) {
            if (item.status == 6 /* plan to watch */) continue;
            usersAnime[item.anime_id] = true;
          }
          const matches =
              vaData.data.filter((role) => (role.anime.mal_id in usersAnime));
          this.setState({
            results: matches,
          });
        })
        .catch((error) => console.warn(error));
  }

  componentDidMount() {
    this.updateResults();
  }

  componentDidUpdate(prevProps, prevState) {
    const propsChanged = JSON.stringify(prevProps) !== JSON.stringify(this.props);
    if (!propsChanged) return;
    this.updateResults();
  }

  render() {
    const vaLink = (
      <a
        href={`https://myanimelist.net/people/${this.props.va.mal_id}`}
        target='_blank'
        rel="noreferrer">
        {this.props.va.name}
      </a>
    );
    return (
      <div>
        <div>
          {this.props.username} has heard {vaLink} in these anime:
        </div>
        { this.state.results === null ?
            <div>Loading...</div> :
            <table className='pure-table-striped'>
              {
                this.state.results.map((match, idx) => (
                  <tr key={idx}>
                    <td><img src={match.character.images.jpg.image_url} width='100em'/></td>
                    <td>{match.character.name}</td>
                    <td><img src={match.anime.images.jpg.image_url} width='100em'/></td>
                    <td><a href={match.anime.url} target='_blank' rel="noreferrer">
                      {match.anime.title}
                    </a></td>
                  </tr>
                ))
              }
            </table>
        }
      </div>
    );
  }
}

MatchList.propTypes = {
  username: PropTypes.string.isRequired,
  va: PropTypes.object.isRequired,
};

export default MatchList;
