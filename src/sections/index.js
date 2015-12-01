import React from 'react';
import { Sections, Components } from 'hull-login';

const { TranslatedMessage } = Components;

const sectionFooter = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  textAlign: 'center',
  padding: 30
};

class logIn extends Sections.logIn {
  renderHeader() {}
  getStyles() {
    return {
      ...super.getStyles(),
      sectionFooter
    };
  }
}


class signUp extends Sections.signUp {
  renderHeader() {}
  getStyles() {
    return {
      ...super.getStyles(),
      sectionFooter
    };
  }
}


class resetPassword extends Sections.resetPassword {
  renderHeader() {}
  renderFooter() {
    return (
      <div style={sectionFooter}>
        <p>
          <TranslatedMessage tag="a"
            href="#"
            onClick={this.props.activateLogInSection.bind(this)}
            message="reset password switch to log-in link" />
        </p>
      </div>
    );
  }
}


class showProfile extends Sections.showProfile {
  renderHeader() {}
  renderFooter() {
    return (
      <div style={sectionFooter}>
        <p>
          <TranslatedMessage tag="a"
            href="#"
            onClick={this.props.activateEditProfileSection}
            message="view profile switch to edit profile link" />
        </p>
      </div>
    );
  }
}


class editProfile extends Sections.editProfile {

  renderHeader() {}

  handleClick(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (this.props.formIsSubmitted || !this.props.hasForm) {
      this.props.activateShowProfileSection();
    } else {
      this.props.hideDialog();
    }
  }

  renderFooter() {
    let message;
    if (this.props.formIsSubmitted || !this.props.hasForm) {
      message = 'edit profile cancel button';
    } else {
      message = 'edit profile cancel button when profile incomplete';
    }
    return (
      <div style={sectionFooter}>
        <p>
          <a href="#" onClick={this.handleClick.bind(this)}>
            <TranslatedMessage tag="span" message={message} />
          </a>
        </p>
      </div>
    );
  }
}


class thanks extends Sections.thanks {
  renderHeader() {}
}

export default {
  logIn,
  signUp,
  resetPassword,
  showProfile,
  editProfile,
  thanks
};
