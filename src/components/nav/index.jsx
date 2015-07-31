'use strict';

import React from 'react';
import { getSettings } from '../../styles/settings';

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
    let settings = getSettings();

    const ul = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      background: '#eee',
      listStyle: 'none'
    };

    const navItem = {
      display: 'block',
      'float': 'left',
      width: '' + (100 / this.props.items.length) + '%'
    };

    const navItemActive = {
      ...navItem,
      background: '#fff'
    };

    const navItemTitle = {
      display: 'block',
      textAlign: 'center',
      textDecoration: 'none',
      fontFamily: settings.secondaryFontFamily,
      fontSize: 26,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      lineHeight: 1,
      letterSpacing: 1,
      padding: '12px 0',
      position: 'relative',
      top: 2
    };

    return {
      ul,
      navItem,
      navItemActive,
      navItemTitle
    };
  },

  render() {
    let styles = this.getStyles();

    let items = [];
    this.props.items.forEach((value) => {
      let href = (typeof value.action === 'string') ? value.action : '#';
      let onClick = (typeof value.action === 'string') ? null : value.action;

      let item = (
        <li style={(value.current) ? styles.navItemActive : styles.navItem}>
          <a href={href} style={styles.navItemTitle} onClick={onClick}>{value.name}</a>
        </li>
      );

      items.push(item);
    });

    if (items.length === 0) {
      return null;
    }

    return <ul style={styles.ul}>
      {items}
    </ul>;
  }
});
