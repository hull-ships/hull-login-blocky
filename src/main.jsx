import React from 'react';
import assign from 'object-assign';
import { map, reduce } from 'underscore';
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup';
import { Core, Components } from 'hull-login';
import Sections from './sections';
import Overlay from './components/overlay';
import Styles from './components/styles';
import { getSettings } from './styles/settings';

let { Mixins, I18n, Utils } = Core;
let { TranslatedMessage } = Components;

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

  preloadImages() {
    map(SectionsPhotos, (i)=> {
      let imageUrl = this.state.shipSettings[i];
      if (imageUrl) {
        Utils.preloadImage(imageUrl);
      }
    });
  },

  _onChange() {
    this.setState(this.props.engine.getState());
  },

  getScope() {
    return `ship-${this.state.ship.id}`;
  },

  getResetStyles() {
    return this.state.shipSettings && this.state.shipSettings.reset_styles;
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
    const viewProfileNav = {
      name: 'View Profile',
      action: this.props.actions.activateShowProfileSection
    };
    const logOutNav = {
      name: 'Log out',
      action: this.props.actions.logOut
    };

    const navs = {
      logIn: [signUpNav, assign({ current: true }, logInNav)],
      signUp: [assign({ current: true }, signUpNav), logInNav],
      resetPassword: [signUpNav, assign({ current: true }, logInNav)],
      showProfile: [assign({ current: true }, viewProfileNav), logOutNav],
      editProfile: [assign({ current: true }, viewProfileNav, { name: 'Edit Profile' }), logOutNav],
      thanks: null
    };

    const Section = Sections[this.state.activeSection];
    const overlayTitle = I18n.translate(name[this.state.activeSection] + ' header', d);
    const nav = navs[this.state.activeSection];

    const photos = reduce(SectionsPhotos, (ps, v, k)=> {
      let img = this.state.shipSettings[v];
      if (img) ps[k] = img;
      return ps;
    }, {});

    return (
      <Overlay className={this.getScope()}
        onClose={this.props.actions.hideDialog}
        title={overlayTitle}
        nav={nav}
        visible={true}
        image={photos[this.state.activeSection]}>
        {this.renderLeftContent()}
        <Section {...this.state} {...this.props.actions} />
      </Overlay>
    );
  },

  renderLeftContent() {
    let settings = getSettings();

    const d = { organization: this.state.organization.name };

    let descriptionStyle = {
      textAlign: 'center',
      color: this.state.shipSettings.light_text_color
    };

    let titleStyle = {
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
      title = <TranslatedMessage tag='h1'
        className='hull-login__modal__description__title'
        style={titleStyle}
        message={name[this.state.activeSection] + ' photo header'}
        variables={d} />;
    }

    let description = <TranslatedMessage tag='p'
      className='hull-login__modal__description__paragraph'
      style={descriptionStyle}
      message={name[this.state.activeSection] + ' description'} />;

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
    const u = this.state.user;

    let buttons = [];
    if (u) {
      if (this.state.shipSettings.show_profile) {
        if (this.state.hasForm && !this.state.formIsSubmitted) {
          let b = <TranslatedMessage tag='a'
            href='#'
            key='complete-profile'
            className='hull-login__button hull-login__button--edit-profile'
            onClick={this.props.actions.activateEditProfileSection}
            message='nav complete profile link' />;
          buttons.push(b);
        } else {
          let b = <a href='#'
            key='show-profile'
            className='hull-login__button hull-login__button--show-profile'
            onClick={this.props.actions.activateShowProfileSection}>{u.name || u.username || u.email}</a>;
          buttons.push(b);
        }
      }

      if (this.state.shipSettings.custom_buttons.length) {
        for (let i = 0; i < this.state.shipSettings.custom_buttons.length; i++) {
          let { url, popup, text } = this.state.shipSettings.custom_buttons[i];
          let b = <a href={url}
            key={`custom-action-${i}`}
            target={popup ? '_blank' : ''}
            className='hull-login__button hull-login__button'>{text}</a>;
          buttons.push(b);
        }
      }

      if (this.state.shipSettings.show_logout) {
        let b = <TranslatedMessage tag='a'
          href='#'
          className='hull-login__button hull-login__button--log-out'
          onClick={this.props.actions.logOut}
          message='nav logout link' />;
        buttons.push(b);
      }
    } else {
      if (this.state.shipSettings.show_login) {
        let b = <TranslatedMessage tag='a'
          href='#'
          key='log-in'
          className='hull-login__button hull-login__button--log-in'
          onClick={this.props.actions.activateLogInSection}
          message='nav login link' />;
        buttons.push(b);
      }

      if (this.state.shipSettings.show_signup) {
        let b = <TranslatedMessage tag='a'
          href='#'
          key='sign-up'
          className='hull-login__button hull-login__button--sign-up'
          onClick={this.props.actions.activateSignUpSection}
          message='nav sign-up link' />;
        buttons.push(b);
      }
    }

    let s = this.getScope();
    let r = this.getResetStyles();
    return (
      <div className='hull-login'>
        <Styles scope={s} reset={r} />
        {buttons}
      </div>
    );
  }
});
