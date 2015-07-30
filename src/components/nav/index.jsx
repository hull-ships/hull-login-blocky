'use strict';

import React from 'react';
import assign from 'object-assign';

export default React.createClass({
  displayName: 'Nav',

  propTypes: {
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      action: React.PropTypes.oneOfType([
          React.PropTypes.func,
          React.PropTypes.string
        ]).isRequired,
      current: React.PropTypes.bool
    }))
  },

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
      width: '' + (100 / this.props.items.length) + '%'
    };

    const current = assign({
      background: '#fff'
    }, li);

    const a = {
      display: 'block',
      padding: 20,
      textAlign: 'center',
      textDecoration: 'none'
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

    let items = [];
    this.props.items.forEach((value) => {
      let href = (typeof value.action === 'string') ? value.action : '#';
      let onClick = (typeof value.action === 'string') ? null : value.action;

      let item = <li style={(value.current) ? styles.current : styles.li}>
        <a href={href} style={styles.a} onClick={onClick}>{value.name}</a>
      </li>;
      items.push(item);
    });

    return <ul style={styles.ul}>
      {items}
    </ul>;
  }
});
