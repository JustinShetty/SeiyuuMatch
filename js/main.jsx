import React from 'react';
import Search from './search';
import Characters from './characters';
import MatchList from './matchlist';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {malUsername: '', showId: null, vaId: null};
        this.searchSelectCallback = this.searchSelectCallback.bind(this);
        this.vaSelectCallback = this.vaSelectCallback.bind(this);
        this.usernameFieldChangeHandler = this.usernameFieldChangeHandler.bind(this);

        this.searchField = React.createRef();
    }

    componentDidMount(){
        if (this.searchField !== null) {
            this.searchField.current.focus();
        }
    }

    usernameFieldChangeHandler(e) {
        this.setState({
            malUsername: e.target.value,
            showId: null,
            vaId: null,
        });
    }

    searchSelectCallback(id) {
        this.setState({
            showId: id,
            vaId: null,
        });
    }

    vaSelectCallback(id) {
        this.setState({
            vaId: id,
        })
    }

    render() {
        return (
            <div>
                <input
                    type='text'
                    ref={this.searchField}
                    onChange={this.usernameFieldChangeHandler}
                    placeholder='MyAnimeList Username'/>
                {
                    this.state.malUsername !== '' ?
                    <Search showSelectCallback={this.searchSelectCallback}/> :
                    <div/>
                }
                {
                    this.state.showId ?
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
                            vaId={this.state.vaId}
                            username={this.state.malUsername}/>
                    </div> :
                    <div/>
                }
            </div>
        );
    }
}

export default Main;
