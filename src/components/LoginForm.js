import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';

const LoginForm = ({ onClickSignUp, onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Email address</label>
          <div className="control">
            <Field className="input" name="email" component="input" />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <Field className="input" name="password" component="input" type="password" />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link">Login</button>
          </div>
        </div>
        <a onClick={onClickSignUp}>Don{"'"}t have an account? Click here to sign up</a>
      </form>
    )}
  />
);

LoginForm.propTypes = {
  onClickSignUp: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default LoginForm;
