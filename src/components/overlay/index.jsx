import React from 'react';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';
import { getSettings } from '../../styles/settings';
import Nav from '../nav';

let mediaQuery = window.matchMedia && window.matchMedia('(min-width: 900px)');

function getViewport() {
  return (mediaQuery == null || mediaQuery.matches) ? 'normal' : 'compact';
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
    if (mediaQuery != null) {
      mediaQuery.addListener(this.handleMediaQueryChange);
    }

    React.findDOMNode(this.refs.modal).focus();
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, true);
    if (mediaQuery != null) {
      mediaQuery.removeListener(this.handleMediaQueryChange);
    }
  },

  componentDidUpdate() {
    React.findDOMNode(this.refs.modal).focus();
  },

  componentWillEnter(done) {
    let b = React.findDOMNode(this.refs.background);
    b.style.opacity = '0';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '1';

    let overlay = React.findDOMNode(this.refs.modal);
    overlay.style.opacity = '1';

    done();
  },

  componentWillLeave(done) {
    let b = React.findDOMNode(this.refs.background);
    b.style.opacity = '1';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '0';

    let overlay = React.findDOMNode(this.refs.modal);
    overlay.style.opacity = '0';

    setTimeout(done, 300);
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
      let focusableElements = React.findDOMNode(this.refs.modal).querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);

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
    let settings = getSettings();

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
      position: 'absolute',
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
      userSelect: 'none'
    };

    let modal = {
      maxWidth: 900,
      background: settings.whiteColor,
      zIndex: 20001,
      outline: 'none',
      position: 'relative',
      display: 'block',
      overflow: 'hidden',
      margin: '0 auto',
      backgroundColor: settings.whiteColor,
      boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.05)',
      WebkitTransition: 'opacity 300ms ease-out',
      msTransition: 'opacity 300ms ease-out',
      MozTransition: 'opacity 300ms ease-out',
      transition: 'opacity 300ms ease-out'
    };

    let modalCloseButton = {
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

    let modalPane = {
      verticalAlign: 'middle',
      position: 'relative'
    };

    let modalImagePane = {
      ...modalPane,
      textAlign: 'center',
      padding: '30px 60px'
    };

    if (this.props.image && this.props.image.match(/^http/)) {
      modalImagePane = {
        ...modalImagePane,
        backgroundImage: 'url(' + this.props.image + ')',
        backgroundPosition: 'center top',
        backgroundSize: 'cover'
      };
    }

    let modalFormPane = {
      ...modalPane,
      background: settings.whiteColor,
      padding: '80px 60px'
    };

    if (this.state.viewport === 'normal') {
      overlayBackground = {
        ...overlayBackground,
        position: 'fixed',
        overflowX: 'hidden',
        overflowY: 'auto'
      };

      modal = {
        ...modal,
        display: 'table',
        tableLayout: 'fixed',
        boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.05)',
        width: 900,
        margin: '60px auto'
      };

      let modalPaneWide = {
        display: 'table-cell',
        width: '50%'
      };

      modalImagePane = {
        ...modalImagePane,
        ...modalPaneWide,
        height: 600
      };

      modalFormPane = {
        ...modalFormPane,
        ...modalPaneWide
      };
    }

    return {
      overlayContainer,
      overlayBackground,
      modal,
      modalCloseButton,
      modalImagePane,
      modalFormPane
    };
  },

  render() {
    if (React.Children.count(this.props.children) < 2) { throw new Error('Overlay expects two children.'); }

    let styles = this.getStyles();
    let className = this.props.className + ' hull-login__overlay-container';

    return (
      <div className={className} style={styles.overlayContainer}>
        <div className='hull-login__modal'
          aria-hidden={!this.props.visible}
          aria-label={this.props.title}
          role='dialog'
          style={styles.modal}
          tabIndex={0}
          ref='modal'>
          <div className='hull-login__modal__image-pane' style={styles.modalImagePane}>
            <a className='hull-login__modal_close-button'
              {...this.getBrowserStateEvents()}
              style={this.buildStyles(styles.modalCloseButton)}
              href='javascript: void 0;'
              aria-label='Close'
              title='Close this dialog'
              onClick={this.handleClose}>×</a>
            {this.props.children[0]}
          </div>
          <div className='hull-login__modal__form-pane' style={styles.modalFormPane}>
            <Nav items={this.props.nav} />
            {this.props.children[1]}
          </div>
        </div>
        <div ref='background' className='hull-login__modal__overlay-background' style={styles.overlayBackground} onClick={this.handleClose} />
      </div>
    );
  }
});
