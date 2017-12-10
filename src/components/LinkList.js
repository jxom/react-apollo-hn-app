import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import Link from './Link';

class LinkList extends Component {
  static propTypes = {
    links: PropTypes.array,
    hasUserVoted: PropTypes.func.isRequired,
    onClickVote: PropTypes.func.isRequired
  };

  static defaultProps = {
    links: []
  };

  render() {
    const { links, hasUserVoted, onClickVote } = this.props;
    return (
      <div>
        {links.map(link => (
          <Link
            key={link.id}
            createdAt={link.createdAt}
            description={link.description}
            disableVotes={hasUserVoted({ votes: link.votes })}
            id={link.id}
            votes={link.votes}
            url={link.url}
            username={_get(link, 'postedBy.username', 'Unknown')}
            onClickVote={onClickVote}
          />
        ))}
      </div>
    );
  }
}

export default LinkList;
