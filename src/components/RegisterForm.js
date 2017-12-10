import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';

const RegisterForm = ({ onClickLogin, onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <Field className="input" name="username" component="input" />
          </div>
        </div>
        <div className="field">
          <label className="label">Email address</label>
          <div className="control">
            <Field className="input" name="email" component="input" type="email" />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <Field className="input" name="password" component="input" type="password" />
          </div>
        </div>
        <div className="field">
          <label className="label">Repeat password</label>
          <div className="control">
            <Field className="input" name="repeatPassword" component="input" type="password" />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link">Sign up</button>
          </div>
        </div>
        <a onClick={onClickLogin}>Already have an account? Click here to login</a>
      </form>
    )}
  />
);

RegisterForm.propTypes = {
  onClickLogin: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default RegisterForm;
