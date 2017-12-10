import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import 'bulma/css/bulma.css';
import './App.css';

import Header from 'components/Header';
import CreateLinkContainer from 'containers/CreateLinkContainer';
import AuthContainer from 'containers/AuthContainer';
import LinksContainer from 'containers/LinksContainer';

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  render() {
    return (
      <Fragment>
        <Header onClickLogout={this.handleClickLogout} />
        <div className="container is-fluid">
          <Switch>
            <Route exact path="/" component={LinksContainer} />
            <Route exact path="/create" component={CreateLinkContainer} />
            <Route exact path="/login" component={props => <AuthContainer isLogin {...props} />} />
            <Route exact path="/sign-up" component={AuthContainer} />
          </Switch>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(App);
