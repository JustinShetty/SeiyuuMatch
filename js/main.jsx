import React from 'react';
import Search from './search';
import Characters from './characters';
import MatchList from './matchlist';

const defaultUsername = '401_k';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {malUsername: defaultUsername, showId: null, vaId: null, vaName: null};
        this.searchSelectCallback = this.searchSelectCallback.bind(this);
        this.vaSelectCallback = this.vaSelectCallback.bind(this);
        this.usernameFieldChangeHandler = this.usernameFieldChangeHandler.bind(this);

        this.usernameField = React.createRef();
    }

    componentDidMount(){
        this.usernameField.current.focus();
    }

    usernameFieldChangeHandler(e) {
        this.setState({
            malUsername: e.target.value,
            showId: null,
            vaId: null,
            vaName: null,
        });
    }

    searchSelectCallback(id) {
        this.setState({
            showId: id,
            vaId: null,
            vaName: null,
        });
    }

    vaSelectCallback(id, name) {
        this.setState({
            vaId: id,
            vaName: name,
        });
    }

    render() {
        return (
            <div>
                <input
                    type='text'
                    ref={this.usernameField}
                    onChange={this.usernameFieldChangeHandler}
                    placeholder='MyAnimeList Username'
                    defaultValue={defaultUsername}/>
                {
                    this.state.malUsername !== null && this.state.malUsername !== '' ?
                    <Search showSelectCallback={this.searchSelectCallback}/> :
                    <div/>
                }
                {
                    this.state.showId && !this.state.vaId ?
                    <div>
                        <hr/>
                        <Characters
                            showId={this.state.showId}
                            vaSelectCallback={this.vaSelectCallback}/>
                    </div> :
                    <div/>
                }
                {
                    this.state.vaId ?
                    <div>
                        <hr/>
                        <MatchList
                            username={this.state.malUsername}
                            vaId={this.state.vaId}
                            vaName={this.state.vaName}/>
                    </div> :
                    <div/>
                }
            </div>
        );
    }
}

export default Main;
