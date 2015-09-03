import React from 'react';

const style = {
  top: '50%',
  position: 'absolute',
  transform: 'translateY(-50%)',
  width: '100%'
};

export default React.createClass({
  displayName: 'Centerer',

  render() {
    let s = {
      ...style,
      ...this.props.style
    };

    return (
      <div {...this.props} style={s}>
        {this.props.children}
      </div>
    );
  }
});
