import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _get from 'lodash/get';

import CreateLinkForm from 'components/CreateLinkForm';

const ALL_LINKS_QUERY = gql`
  query AllLinksQuery {
    allLinks(orderBy: createdAt_DESC) {
      id
      createdAt
      url
      description
    }
  }
`;

class CreateLinkContainer extends Component {
  static propTypes = {
    createLinkMutation: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  handleClickCancel = () => this.props.history.push('/');

  handleSubmit = async ({ description, url }) => {
    const { createLinkMutation, history, userId } = this.props;
    if (!userId) {
      console.error('No user logged in');
      return null;
    }
    // TODO: Handle error
    await createLinkMutation({
      variables: {
        description,
        url,
        postedById: userId
      },
      update: (store, { data: { createLink } }) => {
        const data = store.readQuery({ query: ALL_LINKS_QUERY });
        data.allLinks = [createLink, ...data.allLinks];
        store.writeQuery({
          query: ALL_LINKS_QUERY,
          data
        });
      }
    });
    history.push('/');
  };

  render() {
    return <CreateLinkForm onClickCancel={this.handleClickCancel} onSubmit={this.handleSubmit} />;
  }
}

const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation($description: String!, $url: String!, $postedById: ID!) {
    createLink(description: $description, url: $url, postedById: $postedById) {
      id
      createdAt
      url
      description
      postedBy {
        id
        email
      }
    }
  }
`;

export default connect(state => ({
  userId: _get(state, 'user.id')
}))(graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLinkContainer));
