import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';

const CreateLinkForm = ({ onClickCancel, onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <Field className="input" name="description" component="input" />
          </div>
        </div>
        <div className="field">
          <label className="label">URL</label>
          <div className="control">
            <Field className="input" name="url" component="input" />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link">Submit</button>
          </div>
          <div className="control">
            <button className="button" onClick={onClickCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    )}
  />
);

CreateLinkForm.propTypes = {
  onClickCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default CreateLinkForm;
