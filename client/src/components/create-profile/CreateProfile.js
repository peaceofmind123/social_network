import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TextAreaGroup from "../common/TextAreaGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectGroup from "../common/SelectGroup";
import SocialInputGroup from "../common/SocialInputGroup";

import { addProfile } from "../../actions/profileActions";
class CreateProfile extends Component {
  state = {
    displaySocialInputs: false,
    handle: "",
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
    errors: {}
  };
  onSubmit = e => {
    e.preventDefault();
    const {
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram
    } = this.state;

    const profileData = {
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram
    };
    this.props.addProfile(profileData, this.props.history);
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ ...this.state, errors: newProps.errors });
    }
  }
  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialLinks;

    if (displaySocialInputs) {
      socialLinks = (
        <>
          <SocialInputGroup
            name="twitter"
            placeholder="Add your Twitter URL"
            value={this.state.twitter}
            icon="fab fa-twitter"
            onChange={this.onChange}
          />
          <SocialInputGroup
            name="facebook"
            placeholder="Add your Facebook URL"
            value={this.state.facebook}
            icon="fab fa-facebook"
            onChange={this.onChange}
          />
          <SocialInputGroup
            name="youtube"
            placeholder="Add your Youtube Channel URL"
            value={this.state.youtube}
            icon="fab fa-youtube"
            onChange={this.onChange}
          />
          <SocialInputGroup
            name="linkedin"
            placeholder="Add your Linkedin URL"
            value={this.state.linkedin}
            icon="fab fa-linkedin"
            onChange={this.onChange}
          />
          <SocialInputGroup
            name="instagram"
            placeholder="Add your Instagram URL"
            value={this.state.instagram}
            icon="fab fa-instagram"
            onChange={this.onChange}
          />
        </>
      );
    }
    const professionOptions = [
      { label: "* Select Professional Status", value: 0 },
      { label: "Developer", value: "Developer" },
      { label: "Junior Developer", value: "Junior Developer" },
      { label: "Senior Developer", value: "Senior Developer" },
      { label: "Manager", value: "Manager" },
      { label: "Student or Learning", value: "Student or Learning" },
      { label: "Instructor or Teacher", value: "Instructor or Teacher" },
      { label: "Intern", value: "Intern" },
      { label: "Other", value: "Other" }
    ];
    return (
      <div className="create-profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Let's get some information to make your profile stand out
              </p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Profile Handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="A unique handle for your profile URL. Your full name, company name, nickname, etc."
                />
                <SelectGroup
                  options={professionOptions}
                  value={this.state.status}
                  name="status"
                  onChange={this.onChange}
                  error={errors.status}
                  info="Give us an idea of where you are at in your career"
                />
                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info="Could be your own company or one you work for"
                />
                <TextFieldGroup
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info="Could be your own website or a company one"
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="City or city & state suggested (eg. Boston, MA)"
                />
                <TextFieldGroup
                  placeholder="* Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Please use comma separated values (eg.
                    HTML,CSS,JavaScript,PHP"
                />
                <TextFieldGroup
                  placeholder="Github Username"
                  name="githubusername"
                  value={this.state.githubusername}
                  onChange={this.onChange}
                  error={errors.githubusername}
                  info="If you want your latest repos and a Github link, include your username"
                />
                <TextAreaGroup
                  placeholder="Short Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Tell us a little about yourself"
                />
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        ...prevState,
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-secondary"
                  >
                    {!displaySocialInputs
                      ? "Add Social Network Links"
                      : "Cancel"}
                  </button>
                  <span style={{ marginLeft: "1rem" }} className="text-muted">
                    Optional
                  </span>
                  <div style={{ marginTop: "1rem" }}>{socialLinks}</div>
                </div>
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-primary"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addProfile: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addProfile }
)(withRouter(CreateProfile));
