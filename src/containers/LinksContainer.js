import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import _get from 'lodash/get';
import _find from 'lodash/find';

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
const _updateCacheAfterVote = (store, createVote, linkId) => {
  const data = store.readQuery({ query: ALL_LINKS_QUERY });
  const votedLink = data.allLinks.find(link => link.id === linkId);
  votedLink.votes = createVote.link.votes;
  store.writeQuery({ query: ALL_LINKS_QUERY, data });
};

class LinksContainer extends Component {
  static propTypes = {
    allLinksData: PropTypes.object,
    history: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    userId: PropTypes.string.isRequired
  };

  static defaultProps = {
    allLinksData: {},
    isLoggedIn: false
  };

  state = { isVoting: false };

  handleClickAddLink = () => this.props.history.push('/create');

  handleVoteLink = async ({ id, votes }) => {
    const { createVoteData, userId } = this.props;
    const { isVoting } = this.state;
    const voterIds = votes.map(vote => vote.user.id);

    if (isVoting) {
      return null;
    }

    this.setState({ isVoting: true });

    // TODO: Make this a operationBefore hook in graph cool. Don't handle on client.
    if (voterIds.includes(userId)) {
      console.log(`User (${userId}) already voted for this link.`);
      this.setState({ isVoting: false });
      return null;
    }

    const linkId = id;
    // TODO: Handle error
    await createVoteData({
      variables: {
        userId,
        linkId
      },
      optimisticResponse: _optimisticCreateVoteResponse({ userId }),
      update: (store, { data: { createVote } }) => {
        _updateCacheAfterVote(store, createVote, linkId);
      }
    });
    this.setState({ isVoting: false });
  };

  hasUserVoted = ({ votes }) => {
    const { userId } = this.props;
    return Boolean(_find(votes, { user: { id: userId } }));
  };

  render() {
    const { allLinksData, isLoggedIn } = this.props;
    return (
      <div>
        {isLoggedIn && (
          <AddButton className="button" onClick={this.handleClickAddLink}>
            Add a link
          </AddButton>
        )}
        {allLinksData.loading && <div>Loading</div>}
        {allLinksData.error && <div>Error</div>}
        {!allLinksData.loading &&
          !allLinksData.error &&
          allLinksData.allLinks && (
            <LinkList
              links={allLinksData.allLinks}
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

export default connect(state => ({
  isLoggedIn: Boolean(_get(state, 'user.id')),
  userId: _get(state, 'user.id')
}))(
  compose(
    graphql(ALL_LINKS_QUERY, { name: 'allLinksData' }),
    graphql(CREATE_VOTE_MUTATION, { name: 'createVoteData' })
  )(LinksContainer)
);
