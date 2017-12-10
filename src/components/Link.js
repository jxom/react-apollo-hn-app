import React, { Component } from 'react';
import PropTypes from 'prop-types';
import distanceInWords from 'date-fns/distance_in_words';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;
const CardContent = styled.a`
  flex-grow: 1;
  padding: 1rem;

  &:hover {
    background-color: whitesmoke;
  }
`;
const LikeWrapper = styled.a`
  padding: 1rem;
  display: flex;
  align-items: center;
  border-right: 1px solid #dddddd;
  color: gray;

  &:hover {
    color: #209cee;
  }

  ${({ isDisabled }) =>
    isDisabled &&
    `
    color: #209cee;
    &:hover {
      color: #209cee;
    }
  `};
`;
const ContentWrapper = styled.div`
  color: #363636;
`;
const StrongWithMarginRight = styled.strong`
  margin-right: 0.5rem;
`;

class Link extends Component {
  static propTypes = {
    createdAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    disableVotes: PropTypes.bool,
    id: PropTypes.string.isRequired,
    onClickVote: PropTypes.func.isRequired,
    votes: PropTypes.array,
    url: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  };

  static defaultProps = {
    disableVotes: false,
    votes: []
  };

  render() {
    const { createdAt, description, disableVotes, id, onClickVote, votes, url, username } = this.props;
    return (
      <Card className="card">
        <LikeWrapper className="card-content" isDisabled={disableVotes} onClick={() => onClickVote({ id, votes })}>
          <i className="fa fa-thumbs-up" />
        </LikeWrapper>
        <CardContent className="card-content" href={url}>
          <ContentWrapper>
            <div>
              <StrongWithMarginRight>{description}</StrongWithMarginRight>
              <small>
                <i className="fa fa-link" /> {url}
              </small>
            </div>
            <div>
              <small>
                <span className="has-text-weight-semibold">{votes.length}</span> likes | Posted by{' '}
                <span className="has-text-weight-semibold">{username}</span> {distanceInWords(createdAt, new Date())}{' '}
                ago
              </small>
            </div>
          </ContentWrapper>
        </CardContent>
      </Card>
    );
  }
}

export default Link;
