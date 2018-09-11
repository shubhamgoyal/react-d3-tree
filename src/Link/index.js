import React from 'react';
import PropTypes from 'prop-types';
import { svg, select } from 'd3';

import './style.css';
import LinkTextElement from './LinkTextElement';
import ForeignObjectElement from './ForeignObjectElement';

export default class Link extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialStyle: {
        opacity: 0,
      },
    };
  }

  componentDidMount() {
    this.applyOpacity(1, this.props.transitionDuration);
  }

  componentWillLeave(done) {
    this.applyOpacity(0, this.props.transitionDuration, done);
  }

  applyOpacity(opacity, transitionDuration, done = () => {}) {
    if (transitionDuration === 0) {
      select(this.link).style('opacity', opacity);
      done();
    } else {
      select(this.link)
        .transition()
        .duration(transitionDuration)
        .style('opacity', opacity)
        .each('end', done);
    }
  }

  diagonalPath(linkData, orientation) {
    const diagonal = svg
      .diagonal()
      .projection(d => (orientation === 'horizontal' ? [d.y, d.x] : [d.x, d.y]));
    return diagonal(linkData);
  }

  straightPath(linkData, orientation) {
    const straight = svg
      .line()
      .interpolate('basis')
      .x(d => d.x)
      .y(d => d.y);

    let data = [
      { x: linkData.source.x, y: linkData.source.y },
      { x: linkData.target.x, y: linkData.target.y },
    ];

    if (orientation === 'horizontal') {
      data = [
        { x: linkData.source.y, y: linkData.source.x },
        { x: linkData.target.y, y: linkData.target.x },
      ];
    }

    return straight(data);
  }

  elbowPath(d, orientation) {
    return orientation === 'horizontal'
      ? `M${d.source.y},${d.source.x}V${d.target.x}H${d.target.y}`
      : `M${d.source.x},${d.source.y}V${d.target.y}H${d.target.x}`;
  }

  drawPath() {
    const { linkData, orientation, pathFunc } = this.props;

    if (typeof pathFunc === 'function') {
      return pathFunc(linkData, orientation);
    }

    if (pathFunc === 'elbow') {
      return this.elbowPath(linkData, orientation);
    }

    if (pathFunc === 'straight') {
      return this.straightPath(linkData, orientation);
    }

    return this.diagonalPath(linkData, orientation);
  }

  getLineEndPoints(linkData, orientation) {
    let data = [
      { x: linkData.source.x, y: linkData.source.y },
      { x: linkData.target.x, y: linkData.target.y },
    ];
    if (orientation === 'horizontal') {
      data = [
        { x: linkData.source.y, y: linkData.source.x },
        { x: linkData.target.y, y: linkData.target.x },
      ];
    }
    return data;
  }

  render() {
    const { styles, linkData, orientation, linkLabelComponent } = this.props;
    const lineEndPoints = this.getLineEndPoints(linkData, orientation);
    const lineMidX = 0.6 * lineEndPoints[0].x + 0.4 * lineEndPoints[1].x;
    const lineMidY = 0.6 * lineEndPoints[0].y + 0.4 * lineEndPoints[1].y;
    let translateY;
    if (lineEndPoints[0].y > lineEndPoints[1].y) {
      translateY = lineMidY - 40;
    } else {
      translateY = lineMidY + 20;
    }
    return (
      <g>
        <path
          ref={l => {
            this.link = l;
          }}
          style={{ ...this.state.initialStyle, ...styles, opacity: 1 }}
          className="linkBase"
          d={this.drawPath()}
        />
        {linkLabelComponent ? (
          <ForeignObjectElement
            factString={linkData.target.linkText}
            {...linkLabelComponent}
            transform={`translate(${lineMidX},${translateY})`}
          />
        ) : (
          <LinkTextElement
            transform={`translate(${lineMidX},${lineMidY})`}
            text={linkData.target.linkText}
          />
        )}
      </g>
    );
  }
}

Link.defaultProps = {
  styles: {},
  linkLabelComponent: undefined,
};

Link.propTypes = {
  linkData: PropTypes.object.isRequired,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  pathFunc: PropTypes.oneOfType([
    PropTypes.oneOf(['diagonal', 'elbow', 'straight']),
    PropTypes.func,
  ]).isRequired,
  transitionDuration: PropTypes.number.isRequired,
  styles: PropTypes.object,
  linkLabelComponent: PropTypes.object,
};
