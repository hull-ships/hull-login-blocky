import React, { PropTypes } from 'react';
import assign from 'object-assign';
import { map, reduce } from 'lodash';
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup';
import { Core, Components } from 'hull-login';
import Sections from './sections';
import Overlay from './components/overlay';
import Styles from './components/styles';
import { getSettings } from './styles/settings';

const { Mixins, I18n, Utils } = Core;
const { TranslatedMessage } = Components;

const name = {
  logIn: 'log-in',
  signUp: 'sign-up',
  resetPassword: 'reset password',
  showProfile: 'view profile',
  editProfile: 'edit profile',
  thanks: 'thanks'
};

const SectionsPhotos = {
  logIn: 'login_image',
  signUp: 'signup_image',
  resetPassword: 'reset_image',
  showProfile: 'view_profile_image',
  editProfile: 'edit_profile_image',
  thanks: 'thanks_image'
};

export default React.createClass({

  displayName: 'HullLoginShip',

  propTypes: {
    engine: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  },

  mixins: [
    Mixins.LayeredComponent
  ],

  getInitialState() {
    return this.props.engine.getState();
  },

  componentWillMount() {
    this.preloadImages();
    this.props.engine.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    this.props.engine.removeChangeListener(this._onChange);
  },

  getScope() {
    return `ship-${this.state.ship.id}`;
  },

  preloadImages() {
    map(SectionsPhotos, (i)=> {
      const imageUrl = this.state.shipSettings[i];
      if (imageUrl) {
        Utils.preloadImage(imageUrl);
      }
    });
  },

  _onChange() {
    this.setState(this.props.engine.getState());
  },


  renderOverlay() {
    if (!this.state.dialogIsVisible) { return null; }

    const d = { organization: this.state.organization.name };

    const signUpNav = {
      name: 'Sign up',
      action: this.props.actions.activateSignUpSection
    };
    const logInNav = {
      name: 'Log in',
      action: this.props.actions.activateLogInSection
    };

    const navs = {
      logIn: [signUpNav, assign({ current: true }, logInNav)],
      signUp: [assign({ current: true }, signUpNav), logInNav],
      resetPassword: [signUpNav, assign({ current: true }, logInNav)],
      thanks: null
    };

    const Section = Sections[this.state.activeSection];
    const overlayTitle = I18n.translate(name[this.state.activeSection] + ' header', d);
    const nav = navs[this.state.activeSection];

    const photos = reduce(SectionsPhotos, (ps, v, k)=> {
      const img = this.state.shipSettings[v];
      if (img) ps[k] = img;
      return ps;
    }, {});

    const visible = true;

    return (
      <Overlay className={this.getScope()}
        onClose={this.props.actions.hideDialog}
        title={overlayTitle}
        nav={nav}
        visible={visible}
        image={photos[this.state.activeSection]}>
        {this.renderLeftContent()}
        <Section {...this.state} {...this.props.actions} />
      </Overlay>
    );
  },

  renderLeftContent() {
    const settings = getSettings();

    const d = { organization: this.state.organization.name };

    const descriptionStyle = {
      textAlign: 'center',
      color: this.state.shipSettings.light_text_color
    };

    const titleStyle = {
      ...descriptionStyle,
      fontFamily: settings.secondaryFontFamily,
      fontSize: 36,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1
    };

    let title;
    if (this.state.shipSettings.logo_image && (this.state.activeSection === 'logIn' || this.state.activeSection === 'signUp')) {
      title = <img style={{ maxWidth: '80%', marginBottom: 10 }} src={this.state.shipSettings.logo_image} />;
    } else {
      title = (
        <TranslatedMessage tag="h1"
          className="hull-login__modal__description__title"
          style={titleStyle}
          message={`${name[this.state.activeSection]} photo header`}
          variables={d} />
      );
    }

    const description = (
      <TranslatedMessage tag="p"
        className="hull-login__modal__description__paragraph"
        style={descriptionStyle}
        message={`${name[this.state.activeSection]} description`} />
    );

    return (
      <div style={{ textAlign: 'center' }}>
        {title}
        {description}
      </div>
    );
  },

  renderLayer() {
    return (
      <ReactTransitionGroup>{this.renderOverlay()}</ReactTransitionGroup>
    );
  },

  render() {
    return (
      <div className="hull-login">
        <Styles scope={this.getScope()} />
      </div>
    );
  }
});
