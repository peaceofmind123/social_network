import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import ProfileActions from "./ProfileActions";
import { deleteAccount } from "../../actions/profileActions";
import Experience from "./Experience";
import Education from "./Education";

class Dashboard extends Component {
  componentWillMount() {
    this.props.getCurrentProfile();
  }
  onDeleteClick = e => {
    e.preventDefault();
    this.props.deleteAccount();
  };
  render() {
    let dashboardContent;
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        // the user has a profile
        dashboardContent = (
          <>
            <p
              className="lead text-muted"
              style={{ textTransform: "capitalize" }}
            >
              Welcome
              <Link to={`/profile/${profile.handle}`}> {user.name}</Link>
            </p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div style={{ marginBottom: 60 }} />
            <button class="btn btn-danger" onClick={this.onDeleteClick}>
              Delete My Account
            </button>
          </>
        );
      } else {
        // user doesn't have a profile yet
        dashboardContent = (
          <div>
            <p
              className="lead text-muted"
              style={{ textTransform: "capitalize" }}
            >
              Welcome {user.name}
            </p>
            <p>You have not created a profile yet, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
