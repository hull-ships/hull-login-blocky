'use strict';

import React from 'react';

const styles = {
  display: 'block',
  textAlign: 'center',
  fontSize: 12,
  marginTop: 5,
  opacity: 0.5
};

export default React.createClass({
  displayName: 'Help',

  render() {
    return (
      <span style={styles}>{this.props.children}</span>
    );
  }
});
