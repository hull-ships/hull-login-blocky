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
    const settings = getSettings();

    const items = this.props.items || [];

    const ul = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      background: '#eee',
      listStyle: 'none'
    };

    const itemWidth = items.length ? (100 / items.length) : 100;

    const navItem = {
      display: 'block',
      float: 'left',
      width: `${itemWidth}%`
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
    const styles = this.getStyles();

    const items = [];

    if (this.props.items && this.props.items.length) {
      this.props.items.forEach((value, k) => {
        let href;
        let handleClick;

        if (typeof value.action === 'string') {
          href = value.action;
        } else {
          href = '#';
          handleClick = function(e) {
            e.preventDefault();
            value.action();
          };
        }


        const key = `item-${k}`;
        const item = (
          <li key={key} style={(value.current) ? styles.navItemActive : styles.navItem}>
            <a href={href} style={styles.navItemTitle} onClick={handleClick}>{value.name}</a>
          </li>
        );

        items.push(item);
      });
    }

    if (!items || items.length === 0) {
      return null;
    }

    return (
      <ul style={styles.ul}>
        {items}
      </ul>
    );
  }
});
