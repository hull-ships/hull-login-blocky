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
  renderFooter(styles) {
    return (
      <div style={sectionFooter}>
        <p style={styles.sectionText}>
          <TranslatedMessage tag="a"
            href="#"
            onClick={this.props.activateLogInSection}
            message="reset password switch to log-in link" />
        </p>
      </div>
    );
  }
}


class showProfile extends Sections.showProfile {
  renderHeader() {}
  renderFooter(styles) {
    return (
      <div style={sectionFooter}>
        <p style={styles.sectionText}>
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
  renderFooter(styles) {
    let message;
    let handleClick;
    if (this.props.formIsSubmitted || !this.props.hasForm) {
      message = 'edit profile cancel button';
      handleClick = this.props.activateShowProfileSection;
    } else {
      message = 'edit profile cancel button when profile incomplete';
      handleClick = this.props.hideDialog;
    }
    return (
      <div style={sectionFooter}>
        <p style={styles.sectionText}>
          <a href="javascript: void 0;" onClick={handleClick}>
            <TranslatedMessage tag="p" style={styles.sectionText} message={message} />
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
