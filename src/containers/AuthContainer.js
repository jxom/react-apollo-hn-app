import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { setUserData } from 'actions/users';
import LoginForm from 'components/LoginForm';
import RegisterForm from 'components/RegisterForm';

class AuthContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLogin: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
  };

  handleClickLogin = () => this.props.history.push('/login');

  handleClickSignUp = () => this.props.history.push('/sign-up');

  handleSubmit = async ({ username, email, password }) => {
    const { isLogin, authenticateUserMutation, signupUserMutation, history } = this.props;
    if (isLogin) {
      // TODO: Handle error
      const result = await authenticateUserMutation({
        variables: {
          email,
          password
        }
      });
      const { id, token } = result.data.authenticateUser;
      this.saveUserData({ id, token });
    } else {
      // TODO: Handle error
      const result = await signupUserMutation({
        variables: {
          username,
          email,
          password
        }
      });
      const { id, token } = result.data.signupUser;
      this.saveUserData({ id, token });
    }
    history.push(`/`);
  };

  saveUserData = data => {
    const { dispatch } = this.props;
    dispatch(setUserData(data));
  };

  render() {
    const { isLogin } = this.props;
    if (isLogin) {
      return <LoginForm onClickSignUp={this.handleClickSignUp} onSubmit={this.handleSubmit} />;
    }
    return <RegisterForm onClickLogin={this.handleClickLogin} onSubmit={this.handleSubmit} />;
  }
}

const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation($email: String!, $password: String!, $username: String!) {
    signupUser(email: $email, password: $password, username: $username) {
      id
      token
    }
  }
`;

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      id
      token
    }
  }
`;

export default connect()(
  compose(
    graphql(SIGNUP_USER_MUTATION, { name: 'signupUserMutation' }),
    graphql(AUTHENTICATE_USER_MUTATION, { name: 'authenticateUserMutation' })
  )(AuthContainer)
);
