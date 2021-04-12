import React from 'react';
import ReactDOM from 'react-dom';
import Search from './search';
import Characters from './characters';
import MatchList from './matchlist';

const defaultUsername = '401_k';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {malUsername: defaultUsername, show: null, character: null};
        this.usernameFieldChangeHandler = this.usernameFieldChangeHandler.bind(this);
        this.usernameField = React.createRef();
    }

    componentDidMount(){
        this.usernameField.current.focus();
    }

    usernameFieldChangeHandler(e) {
        this.setState({
            malUsername: e.target.value,
            show: null,
            character: null,
        });
    }

    render() {
        let selectionInfo = (
            <div className='pure-g'>
                {this.state.show ?
                <div className='pure-u-1-2'>
                    <img className='pure-img' src={this.state.show.image_url}/>
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
                <form className='pure-form'>
                <input
                    type='text'
                    ref={this.usernameField}
                    onChange={this.usernameFieldChangeHandler}
                    placeholder='MyAnimeList Username'
                    defaultValue={defaultUsername}/>
                </form>
                {
                    this.state.malUsername !== null && this.state.malUsername !== '' ?
                    <div className='pure-g'>
                        <div className='pure-u-1-2'>
                            <Search showSelectCallback={(show) => {
                                    this.setState({
                                        show: show,
                                        character: null,
                                    });
                                }}/>
                        </div>
                        <div className='pure-u-1-2'>
                            {selectionInfo}
                        </div>
                    </div> :
                    <div/>
                }
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
