import React from 'react';
import PropTypes from 'prop-types';

class MatchList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: []};
        this.updateResults = this.updateResults.bind(this);
        this.mounted = false;
    }

    updateResults() {
        Promise.all([
            fetch(`https://api.jikan.moe/v3/user/${this.props.username}/animelist`),
            fetch(`https://api.jikan.moe/v3/person/${this.props.vaId}`)
        ])
        .then((responses) => {
            return Promise.all(responses.map((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            }));
        })
        .then(([user_data, va_data]) => {
            let users_anime = {};
            for (const show of user_data.anime) {
                // 2 is completed
                if (show.watching_status === 2) {
                    users_anime[show.mal_id] = true;
                }
            }
            let matches = va_data.voice_acting_roles.filter((role) => (role.anime.mal_id in users_anime));
            console.log(matches);
            this.setState({
                results: matches,
            });
        })
        .catch((error) => console.log(error));
    }

    componentDidMount() {
        this.updateResults();
        this.mounted = true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.vaId !== this.props.vaId) {
            this.updateResults();
        }
    }

    render() {
        if (!this.mounted) return <div/>;
        return (
            <div>
            {
                this.state.results.length ?
                <div>
                    {this.state.results.map((match, idx) => (
                        <div key={idx}>
                            {match.anime.name}
                        </div>
                    ))}
                </div> :
                <div>No Matches!</div>
            }
            </div>
        );
    }
}

MatchList.propTypes = {
    username: PropTypes.string.isRequired,
    vaId: PropTypes.number.isRequired,
};

export default MatchList;
