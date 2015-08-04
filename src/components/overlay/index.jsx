'use strict';

import Bounce from 'bounce';
import React from 'react';
import assign from 'object-assign';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';
import { getSettings } from '../../styles/settings';
import Nav from '../nav';

let mediaQuery = window.matchMedia('(min-width: 460px)');

function getViewport() {
  return mediaQuery.matches ? 'normal' : 'compact';
}

const FOCUSABLE_ELEMENTS_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not([tabindex="-1"]), *[contenteditable]';

export default React.createClass({
  displayName: 'Overlay',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  propTypes: {
    className: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool.isRequired,
    image: React.PropTypes.string.isRequired,

    onClose: React.PropTypes.func.isRequired,
    nav: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      action: React.PropTypes.oneOfType([
          React.PropTypes.func,
          React.PropTypes.string
        ]).isRequired,
      current: React.PropTypes.bool
    }))
  },

  getInitialState() {
    return { viewport: getViewport() };
  },

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, true);
    mediaQuery.addListener(this.handleMediaQueryChange);

    React.findDOMNode(this.refs.overlay).focus();
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, true);
    mediaQuery.removeListener(this.handleMediaQueryChange);
  },

  componentDidUpdate() {
    React.findDOMNode(this.refs.overlay).focus();
  },

  componentWillEnter(done) {
    let b = React.findDOMNode(this.refs.background);
    b.style.opacity = '0';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '1';

    let overlay = React.findDOMNode(this.refs.overlay);

    let enterTransition = new Bounce();
    enterTransition.scale({
      from: { x: 0.9, y: 0.9 },
      to: { x: 1, y: 1 },
      bounces: 1,
      duration: 400
    });

    enterTransition.applyTo(overlay, {
      onComplete: function() {
        enterTransition.remove();
        done();
      }
    });
  },

  componentWillLeave(done) {
    let b = React.findDOMNode(this.refs.background);
    b.style.opacity = '1';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '0';

    let overlay = React.findDOMNode(this.refs.overlay);
    overlay.style.opacity = '0';

    let exitTransition = new Bounce();
    exitTransition.scale({
      from: { x: 1, y: 1 },
      to: { x: 0.9, y: 0.9 },
      bounces: 1,
      duration: 400
    });

    exitTransition.applyTo(overlay, {
      onComplete: function() {
        exitTransition.remove();
        done();
      }
    });
  },

  handleMediaQueryChange() {
    this.setState({ viewport: getViewport() });
  },

  handleClose(e) {
    e.preventDefault();

    this.props.onClose();
  },

  handleKeydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) { this.props.onClose(); }

    if (e.key === 'Tab' || e.keyCode === 9) {
      let focussed = e.target;
      let focusableElements = React.findDOMNode(this.refs.overlay).querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);

      let focussedIndex = -1;
      for (let i = 0, l = focusableElements.length; i < l; i++) {
        if (focusableElements[i] === focussed) {
          focussedIndex = i;
          break;
        }
      }

      if (e.shiftKey) {
        if (focussedIndex === 0) {
          e.preventDefault();
          focusableElements[focusableElements.length - 1].focus();
        }
      } else {
        if (focussedIndex === focusableElements.length - 1) {
          e.preventDefault();
          focusableElements[0].focus();
        }
      }
    }
  },

  getStyles() {
    const settings = getSettings();

    let overlayContainer = {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: (this.props.visible) ? 'block' : 'none',
      // Ensure that the overlay goes above the shopify admin bar
      zIndex: 3000000000,
      overflow: 'auto'
    };

    let overlayBackground = {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: 20000,
      backgroundColor: 'rgba(0,0,0,.5)',
      opacity: 0,
      WebkitTransition: 'opacity 150ms ease-out',
      MsTransition: 'opacity 150ms ease-out',
      MozTransition: 'opacity 150ms ease-out',
      transition: 'opacity 150ms ease-out',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none',
      overflowX: 'hidden',
      overflowY: 'auto'
    };

    let overlay = {
      backgroundColor: settings.whiteColor,
      zIndex: 20001,
      outline: 'none',
      position: 'relative',
      WebkitTransition: 'opacity 300ms ease-out',
      msTransition: 'opacity 300ms ease-out',
      MozTransition: 'opacity 300ms ease-out',
      transition: 'opacity 300ms ease-out',
      minHeight: 600,
      overflow: 'scroll',
      boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.05)',
      maxWidth: 900,
      width: '100%',
      display: 'table',
      margin: '0 auto',
      top: '50%',
      MozTransform: 'translateY(-50%)',
      MsTransform: 'translateY(-50%)',
      Webkittransform: 'translateY(-50%)',
      transform: 'translateY(-50%)'
    };

    const overlayDescription = {
      position: 'relative',
      width: '100%',
      padding: '0 60px',
      verticalAlign: 'middle',
      textAlign: 'center',
      backgroundImage: 'url(' + this.props.image + ')',
      backgroundPosition: 'center top',
      backgroundSize: 'cover'
    };

    const overlayContent = {
      position: 'relative',
      verticalAlign: 'middle',
      padding: '30px 60px'
    };

    const overlayCloseButton = {
      position: 'absolute',
      textAlign: 'left',
      verticalAlign: 'top',
      color: '#fff',
      width: 40,
      height: 40,
      fontSize: '40px',
      fontWeight: 'bold',
      lineHeight: 0.5,
      textDecoration: 'none',
      top: 15,
      left: 15,

      states: [
        {
          hover: {
            color: '#666'
          }
        }
      ]
    };

    assign(overlayDescription, {
      width: 450,
      minWidth: 450,
      maxWidth: 450,
      display: 'table-cell'
    });

    assign(overlayContent, {
      width: 450,
      minWidth: 450,
      maxWidth: 450,
      display: 'table-cell'
    });

    const overlayParagraph = {
      color: '#fff',
      textAlign: 'center'
    };

    return {
      overlayContainer,
      overlayBackground,
      overlay,
      overlayCloseButton,
      overlayDescription,
      overlayContent,
      overlayParagraph
    };
  },

  render() {
    let styles = this.getStyles();
    let className = this.props.className + ' hull-login__modal';

    let left = null;
    let right = null;
    if (React.Children.count(this.props.children) === 2) {
      left = this.props.children[0];
      right = this.props.children[1];
    } else {
      throw new Error('Overlay expects two children.');
    }

    return (
      <div className={className} style={styles.overlayContainer}>
        <div
          className='hull-login__modal__dialog'
          aria-hidden={!this.props.visible}
          aria-label={this.props.title}
          role='dialog'
          style={styles.overlay}
          tabIndex={0}
          ref='overlay'>

          <div className='hull-login__modal__description'
            style={styles.overlayDescription}>
            <a className='hull-login__modal_close-button'
              {...this.getBrowserStateEvents()}
              style={this.buildStyles(styles.overlayCloseButton)}
              href='javascript: void 0;'
              aria-label='Close'
              title='Close this dialog'
              onClick={this.handleClose}>×</a>

            {left}
          </div>
          <div className='hull-login__modal__content'
            style={styles.overlayContent}>
            <Nav items={this.props.nav} />

            {right}
          </div>
        </div>
        <div ref='background' className='hull-login__modal__overlay' style={styles.overlayBackground} onClick={this.handleClose} />
      </div>
    );
  }
});
