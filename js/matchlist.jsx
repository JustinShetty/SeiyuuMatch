import React from 'react';
import PropTypes from 'prop-types';

class MatchList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: null};
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults() {
        // TODO: Only 300 items are returned per page, if there are more remaining, fetch again
        Promise.all([
            fetch(`https://api.jikan.moe/v3/user/${this.props.username}/animelist`, {redirect: 'follow'}),
            fetch(`https://api.jikan.moe/v3/person/${this.props.va.mal_id}`, {redirect: 'follow'})
        ])
        .then((responses) => {
            return Promise.all(responses.map((response) => {
                // TODO: handle invalid usernames more gracefully
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            }));
        })
        .then(([user_data, va_data]) => {
            let users_anime = {};
            for (const show of user_data.anime) {
                if (show.watching_status == 6) continue;
                users_anime[show.mal_id] = true;
            }
            let matches = va_data.voice_acting_roles.filter((role) => (role.anime.mal_id in users_anime));
            this.setState({
                results: matches,
            });
        })
        .catch((error) => console.log(error));
    }

    componentDidMount() {
        this.updateResults();
    }

    componentDidUpdate(prevProps, prevState) {
        const propsChanged = prevProps.vaId !== this.props.vaId || prevProps.username !== this.props.username;
        if (!propsChanged) return;
        this.updateResults();
    }

    render() {
        return (
            <div>
            <div>
                {this.props.username} has heard <a href={`https://myanimelist.net/people/${this.props.va.mal_id}`} target='_blank'>{this.props.va.name}</a> in these anime:
            </div>
            { this.state.results === null ?
            <div>Loading...</div> :
            <table className='pure-table-striped'>
            <tbody>
            {
                this.state.results.map((match, idx) => (
                    <tr key={idx}>
                        <td><img src={match.character.image_url} width='100em'/></td>
                        <td>{match.character.name}</td>
                        <td><img src={match.anime.image_url} width='100em'/></td>
                        <td><a href={match.anime.url} target='_blank'>{match.anime.name}</a></td>
                    </tr>
                ))
            }
            </tbody>
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
