import React from 'react';
import PropTypes from 'prop-types';

export default class ForeignObjectElement extends React.PureComponent {
  render() {
    const { render, factString, transform } = this.props;
    return (
      <foreignObject transform={transform}>
        {React.cloneElement(render, { factString })}
      </foreignObject>
    );
  }
}

ForeignObjectElement.propTypes = {
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.node]).isRequired,
  factString: PropTypes.string.isRequired,
  transform: PropTypes.string.isRequired,
};
