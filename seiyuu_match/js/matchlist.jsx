import React from 'react';
import PropTypes from 'prop-types';
import {malRouteToUrl} from './proxy';

class MatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: null};
    this.updateResults = this.updateResults.bind(this);
  }

  updateResults() {
    // TODO: pagination
    const baseUserQuery = malRouteToUrl(`users/${this.props.username}/animelist?limit=1000`);
    Promise.all([
      fetch(baseUserQuery + '&status=watching'),
      fetch(baseUserQuery + '&status=completed'),
      // TODO: replace with official API someday
      fetch(`https://api.jikan.moe/v4/people/${this.props.va.mal_id}/voices`),
    ])
        .then((responses) => {
          return Promise.all(responses.map((response) => {
            // TODO: handle invalid usernames more gracefully
            if (!response.ok) throw Error(response.statusText);
            return response.json();
          }));
        })
        .then(([watchingData, completedData, vaData]) => {
          let animeList = watchingData.data.map((item) => item.node);
          animeList = animeList.concat(completedData.data.map((item) => item.node));
          const seenIds = new Set();
          for (const anime of animeList) {
            seenIds.add(anime.id);
          }
          const matches =
              vaData.data.filter((role) => ( seenIds.has(role.anime.mal_id)));
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
        {
          this.state.results === null ?
          <div>Loading...</div> :
          <div className='tile-container'> {
            this.state.results.map((item, index) => (
              <table key={index} className='tile'>
                <tbody>
                  <tr>
                    <td>
                      <img src={item.character.images.jpg.image_url} width='100em'/>
                    </td>
                    <td>
                      <img src={item.anime.images.jpg.image_url} width='100em'/>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan='2'>
                      {item.character.name}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan='2'>
                      <a href={item.anime.url} target='_blank' rel="noreferrer">
                        {item.anime.title}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            ))
          } </div>
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
