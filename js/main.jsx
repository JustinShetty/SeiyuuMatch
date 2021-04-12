import React from 'react';
import ReactDOM from 'react-dom';
import Search from './search';
import Characters from './characters';
import MatchList from './matchlist';

const defaultUsername = '401_k';

const debounce = function(func, wait) {
  let timeout;
  return function() {
    /* eslint-disable */
    const context = this; const args = arguments;
    /* eslint-enable */
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      malUsername: defaultUsername,
      searchTerm: '',
      show: null,
      character: null,
    };
    this.usernameFieldChangeHandler = this.usernameFieldChangeHandler.bind(this);
    this.usernameField = React.createRef();
    this.searchTermChangeHandler = this.searchTermChangeHandler.bind(this);
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.usernameField.current.focus();
  }

  usernameFieldChangeHandler(e) {
    if (e.target.value !== '') {
      this.setState({
        malUsername: e.target.value,
      });
    }
  }

  searchTermChangeHandler(e) {
    if (e.target.value.length < 3) return;
    this.setState({
      searchTerm: e.target.value,
    });
  }

  render() {
    const selectionInfo = (
      <div className='pure-g'>
        {this.state.show ?
                <div className='pure-u-1-2'>
                  <a href={this.state.show.url} target='_blank' rel="noreferrer">
                    <img className='pure-img' src={this.state.show.image_url}/>
                  </a>
                  <div>{this.state.show.title}</div>
                </div>:
                <div/>
        }
        {this.state.character ?
                <div className='pure-u-1-2'>
                  <img className='pure-img' src={this.state.character.image_url}/>
                  <div>{this.state.character.name}</div>
                </div>:
                <div/>
        }
      </div>
    );
    return (
      <div>
        <div className='pure-g'>
          <div className='pure-u-1-2'>
            <form className="pure-form pure-form-aligned" onSubmit={this.handleSearchSubmit}>
              <fieldset>
                <div className="pure-control-group">
                  <label htmlFor="aligned-name">MyAnimeList Username</label>
                  <input
                    type='text'
                    ref={this.usernameField}
                    onChange={debounce(this.usernameFieldChangeHandler, 500)}
                    defaultValue={defaultUsername}/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="aligned-name">Anime Name</label>
                  <input
                    type='text'
                    ref={this.searchField}
                    onChange={debounce(this.searchTermChangeHandler, 500)}
                    placeholder='JoJo'/>
                </div>
              </fieldset>
            </form>
            <Search searchTerm={this.state.searchTerm} showSelectCallback={(show) => {
              this.setState({
                show: show,
                character: null,
              });
            }}/>
          </div>
          <div className='pure-u-1-2'>
            {selectionInfo}
          </div>
        </div>
        {
                    this.state.show && !this.state.character ?
                    <div>
                      <hr/>
                      <Characters
                        showId={this.state.show.mal_id}
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
                        va={this.state.character.voice_actor}/>
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
