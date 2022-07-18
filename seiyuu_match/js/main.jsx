import React from 'react';
import ReactDOM from 'react-dom';
import Search from './search';
import Characters from './characters';
import MatchList from './matchlist';

const repoLink = 'https://github.com/JustinShetty/SeiyuuMatch';
const defaultUsername = '401_k';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      malUsername: defaultUsername,
      searchTerm: '',
      show: null,
      character: null,
    };
    this.usernameField = React.createRef();
    this.searchField = React.createRef();
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  componentDidMount() {
    this.searchField.current.focus();
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    const username = this.usernameField.current.value;
    if (username === '') {
      console.warn('Ignoring search while username is empty');
      return;
    }
    const searchTerm = this.searchField.current.value;
    if (searchTerm.length < 3) {
      console.warn('Ignoring search while anime name is <3 chars');
      return;
    }
    this.setState({
      malUsername: username,
      searchTerm: searchTerm,
    });
  }

  render() {
    const selectionInfo = (
      <div className='pure-g'>
        {this.state.show ?
                <div className='pure-u-1-2'>
                  <a href={this.state.show.url} target='_blank' rel="noreferrer">
                    <img className='pure-img' src={this.state.show.images.jpg.image_url}/>
                  </a>
                  <div>{this.state.show.title}</div>
                </div>:
                <div/>
        }
        {this.state.character ?
                <div className='pure-u-1-2'>
                  <img className='pure-img'
                    src={this.state.character.character.images.jpg.image_url}/>
                  <div>{this.state.character.character.name}</div>
                </div>:
                <div/>
        }
      </div>
    );
    return (
      <div>
        <div className='pure-g'>
          <div className='pure-u-1-1'>
            <a href={repoLink} target='_blank' rel="noreferrer">{repoLink}</a>
          </div>
          <div className='pure-u-1-2'>
            <form className="pure-form pure-form-aligned" onSubmit={this.handleSearchSubmit}>
              <fieldset>
                <div className="pure-control-group">
                  <label htmlFor="aligned-name">MyAnimeList Username</label>
                  <input
                    type='text'
                    ref={this.usernameField}
                    defaultValue={defaultUsername}/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="aligned-name">Anime Name</label>
                  <input
                    type='text'
                    ref={this.searchField}
                    placeholder='evangelion'/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="aligned-name"></label>
                  <button>Search</button>
                </div>
              </fieldset>
            </form>
            <Search searchTerm={this.state.searchTerm} animeSelectCallback={(anime) => {
              this.setState({
                anime: anime,
                character: null,
              });
            }}/>
          </div>
          <div className='pure-u-1-2'>
            {selectionInfo}
          </div>
        </div>
        {
                    this.state.anime && !this.state.character ?
                    <div>
                      <hr/>
                      <Characters
                        animeId={this.state.anime.id}
                        characterSelectCallback={(character) => {
                          this.setState({
                            character: character,
                          });
                        }}/>
                    </div> :
                    <div/>
        }
        {
                    this.state.character ?
                    <div>
                      <hr/>
                      <MatchList
                        username={this.state.malUsername}
                        va={this.state.character.voice_actor.person}/>
                    </div> :
                    <div/>
        }
      </div>
    );
  }
}

ReactDOM.render(
    <Main />,
    document.getElementById('reactMain'),
);
