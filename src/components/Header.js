import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import _get from 'lodash/get';

import { removeUserData } from 'actions/users';

const H1Strong = styled.h1`
  font-weight: bold;
  color: white;
`;

class Header extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool
  };

  static defaultProps = {
    isLoggedIn: false
  };

  handleClickLogout = () => {
    const { dispatch, history } = this.props;
    dispatch(removeUserData());
    history.push(`/`);
  };

  render = () => {
    const { isLoggedIn } = this.props;
    return (
      <nav className="navbar is-info" style={{ marginBottom: '1rem' }}>
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <H1Strong>Shitty Hackernews</H1Strong>
          </Link>
          <div className="navbar-burger burger">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            {isLoggedIn ? (
              <div className="navbar-item">
                <a className="button is-info is-inverted is-outlined" onClick={this.handleClickLogout}>
                  Logout
                </a>
              </div>
            ) : (
              <div className="navbar-item">
                <Link className="button is-info is-inverted is-outlined" to="/login">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  };
}

export default withRouter(
  connect(state => ({
    isLoggedIn: Boolean(_get(state, 'user.token'))
  }))(Header)
);
