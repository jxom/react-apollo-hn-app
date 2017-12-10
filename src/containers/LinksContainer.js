import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _remove from 'lodash/remove';

import LinkList from 'components/LinkList';

const AddButton = styled.button`
  margin-bottom: 1rem;
`;

const _optimisticCreateVoteResponse = ({ userId }) => ({
  __typename: 'Mutation',
  createVote: {
    __typename: 'Vote',
    id: '_new',
    link: {
      votes: [{ id: '_new', user: { id: userId, __typename: 'User' }, __typename: 'Vote' }],
      __typename: 'Link'
    },
    user: { id: userId, __typename: 'User' }
  }
});
const _optimisticDeleteVoteResponse = ({ id }) => ({
  _typename: 'Mutation',
  deleteVote: {
    _typename: 'Vote',
    id
  }
});
const _updateCacheAfterVoteMutation = ({ store, vote, linkId, isDelete }) => {
  const data = store.readQuery({ query: ALL_LINKS_QUERY });
  const votedLink = data.allLinks.find(link => link.id === linkId);
  if (isDelete) {
    _remove(votedLink.votes, { id: vote.id });
  } else {
    votedLink.votes = vote.link.votes;
  }
  store.writeQuery({ query: ALL_LINKS_QUERY, data });
};

class LinksContainer extends Component {
  static propTypes = {
    allLinksQuery: PropTypes.object,
    history: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    userId: PropTypes.string.isRequired
  };

  static defaultProps = {
    allLinksQuery: {},
    isLoggedIn: false
  };

  state = { isVoting: false };

  handleClickAddLink = () => this.props.history.push('/create');

  handleVoteLink = async ({ id, votes }) => {
    const { createVoteMutation, removeVoteMutation, userId } = this.props;
    const { isVoting } = this.state;
    const userVote = _find(votes, { user: { id: userId } });

    if (isVoting) {
      return null;
    }

    this.setState({ isVoting: true });
    const linkId = id;
    // TODO: Make this a operationBefore hook in graph cool. Don't handle on client.
    if (userVote) {
      // TODO: Handle error
      await removeVoteMutation({
        variables: {
          id: userVote.id
        },
        optimisticResponse: _optimisticDeleteVoteResponse({ id: userVote.id }),
        update: (store, { data: { deleteVote } }) => {
          _updateCacheAfterVoteMutation({ store, vote: deleteVote, linkId, isDelete: true });
        }
      });
    } else {
      // TODO: Handle error
      await createVoteMutation({
        variables: {
          userId,
          linkId
        },
        optimisticResponse: _optimisticCreateVoteResponse({ userId }),
        update: (store, { data: { createVote } }) => {
          _updateCacheAfterVoteMutation({ store, vote: createVote, linkId });
        }
      });
    }
    this.setState({ isVoting: false });
  };

  hasUserVoted = ({ votes }) => {
    const { userId } = this.props;
    return Boolean(_find(votes, { user: { id: userId } }));
  };

  render() {
    const { allLinksQuery, isLoggedIn } = this.props;
    return (
      <div>
        {isLoggedIn && (
          <AddButton className="button" onClick={this.handleClickAddLink}>
            Add a link
          </AddButton>
        )}
        {allLinksQuery.loading && <div>Loading</div>}
        {allLinksQuery.error && <div>Error</div>}
        {!allLinksQuery.loading &&
          !allLinksQuery.error &&
          allLinksQuery.allLinks && (
            <LinkList
              links={allLinksQuery.allLinks}
              hasUserVoted={this.hasUserVoted}
              onClickVote={this.handleVoteLink}
            />
          )}
      </div>
    );
  }
}

const ALL_LINKS_QUERY = gql`
  query AllLinksQuery {
    allLinks(orderBy: createdAt_DESC) {
      id
      createdAt
      url
      description
      postedBy {
        id
        username
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;
const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
    createVote(userId: $userId, linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;
const DELETE_VOTE_MUTATION = gql`
  mutation DeleteVoteMutation($id: ID!) {
    deleteVote(id: $id) {
      id
    }
  }
`;

export default connect(state => ({
  isLoggedIn: Boolean(_get(state, 'user.id')),
  userId: _get(state, 'user.id')
}))(
  compose(
    graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' }),
    graphql(CREATE_VOTE_MUTATION, { name: 'createVoteMutation' }),
    graphql(DELETE_VOTE_MUTATION, { name: 'removeVoteMutation' })
  )(LinksContainer)
);
