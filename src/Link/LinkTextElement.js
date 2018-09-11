import React from 'react';
import PropTypes from 'prop-types';

export default class LinkTextElement extends React.PureComponent {
  render() {
    const { text, transform } = this.props;
    return (
      <text
        className="linkNameBase"
        textAnchor="start"
        x={10}
        y={-10}
        dy=".35em"
        transform={transform}
      >
        {text}
      </text>
    );
  }
}

LinkTextElement.defaultProps = {};

LinkTextElement.propTypes = {
  text: PropTypes.string.isRequired,
  transform: PropTypes.string.isRequired,
};
