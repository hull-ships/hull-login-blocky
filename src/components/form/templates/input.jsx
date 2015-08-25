'use strict';

import React from 'react';
import { getStyles } from '../styles';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';
import assign from 'object-assign';

export default React.createClass({
  displayName: 'Input',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  componentDidMount() {
    if (this.props.autoFocus) {
      setTimeout(()=> {
        if (this.isMounted()) {
          let input = this.refs.input;
          if (input) {
            let node = input.getDOMNode();
            node.focus();
          }
        }
      }, 300);
    }
  },

  render() {
    let style = this.buildStyles(getStyles().formInput);
    let props = assign({}, this.getBrowserStateEvents(), this.props);
    return <input ref='input' style={style} {...props} onChange={this.handleChange} />;
  }
});

