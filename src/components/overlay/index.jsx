import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getSettings } from '../../styles/settings';
import Nav from '../nav';

const mediaQuery = window.matchMedia && window.matchMedia('(min-width: 900px)');

function getViewport() {
  return (!mediaQuery || mediaQuery.matches) ? 'normal' : 'compact';
}

const FOCUSABLE_ELEMENTS_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not([tabindex="-1"]), *[contenteditable]';

export default React.createClass({
  displayName: 'Overlay',

  propTypes: {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    image: PropTypes.string,
    children: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    nav: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      action: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string
      ]).isRequired,
      current: PropTypes.bool
    }))
  },

  getInitialState() {
    return { viewport: getViewport() };
  },

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, true);
    if (mediaQuery) {
      mediaQuery.addListener(this.handleMediaQueryChange);
    }

    ReactDOM.findDOMNode(this.refs.modal).focus();
  },

  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.modal).focus();
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, true);
    if (mediaQuery) {
      mediaQuery.removeListener(this.handleMediaQueryChange);
    }
  },

  getStyles() {

    const settings = getSettings();
    const { shipSettings } = this.props;

    const overlayContainer = {
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

    const modalCloseButton = {
      'position': 'absolute',
      'textAlign': 'left',
      'verticalAlign': 'top',
      'color': shipSettings.close_button_color,
      'opacity': 0.7,
      'width': 40,
      'height': 40,
      'fontSize': '40px',
      'fontWeight': 'bold',
      'lineHeight': 0.5,
      'textDecoration': 'none',
      'top': 15,
      'left': 15,
      ':hover': {
        'color': '#666'
      }
    };

    const modalPane = {
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

      const modalPaneWide = {
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

  componentWillEnter(done) {
    const b = ReactDOM.findDOMNode(this.refs.background);
    b.style.opacity = '0';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '1';

    const overlay = ReactDOM.findDOMNode(this.refs.modal);
    overlay.style.opacity = '1';

    done();
  },

  componentWillLeave(done) {
    const b = ReactDOM.findDOMNode(this.refs.background);
    b.style.opacity = '1';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '0';

    const overlay = ReactDOM.findDOMNode(this.refs.modal);
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
      const focussed = e.target;
      const focusableElements = ReactDOM.findDOMNode(this.refs.modal).querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);

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


  render() {
    const { children } = this.props;
    if (React.Children.count(children) < 2) { throw new Error('Overlay expects two children.'); }

    const styles = this.getStyles();
    const className = this.props.className + ' hull-login__overlay-container';

    const nav = this.props.nav ? <Nav items={this.props.nav} /> : null;

    return (
      <div className={className} style={styles.overlayContainer}>
        <div className="hull-login__modal"
          aria-hidden={!this.props.visible}
          aria-label={this.props.title}
          role="dialog"
          style={styles.modal}
          tabIndex={0}
          ref="modal">
          <div className="hull-login__modal__image-pane" style={styles.modalImagePane}>
            <a className="hull-login__modal_close-button"
              style={styles.modalCloseButton}
              href="javascript: void 0;"
              aria-label="Close"
              title="Close this dialog"
              onClick={this.handleClose}>×</a>
            {this.props.children[0]}
          </div>
          <div className="hull-login__modal__form-pane" style={styles.modalFormPane}>
            { nav }
            { this.props.children[1] }
          </div>
        </div>
        <div ref="background" className="hull-login__modal__overlay-background" style={styles.overlayBackground} onClick={this.handleClose} />
      </div>
    );
  }
});
