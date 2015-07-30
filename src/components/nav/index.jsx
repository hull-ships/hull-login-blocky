'use strict';

import React from 'react';
import assign from 'object-assign';

export default React.createClass({
  displayName: 'Nav',

  getStyles() {
    const ul = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      background: '#eee',
      listStyle: 'none'
    };

    const li = {
      display: 'block',
      'float': 'left',
      width: '50%'
    };

    const current = assign({
      background: '#fff'
    }, li);

    const a = {
      display: 'block',
      padding: 20,
      textAlign: 'center'
    };

    return {
      ul,
      li,
      current,
      a
    };
  },

  render() {
    let styles = this.getStyles();

    return <ul style={styles.ul}>
      <li style={styles.current}><a href="#" style={styles.a}>sign up</a></li>
      <li style={styles.li}><a href="#" style={styles.a}>log in</a></li>
    </ul>;
  }
});
