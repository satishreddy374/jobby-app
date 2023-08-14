import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

const apiJobStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

const types = []

class Jobs extends Component {
  state = {
    profileData: {},
    jobsListData: [],
    searchInput: '',
    jobType: '',
    salaryRange: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsListDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedProfile = {
        profileDetails: data.profile_details,
      }
      const updatedProfileData = {
        name: updatedProfile.profileDetails.name,
        profileImageUrl: updatedProfile.profileDetails.profile_image_url,
        shortBio: updatedProfile.profileDetails.short_bio,
      }

      this.setState({
        profileData: updatedProfileData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsListDetails = async () => {
    this.setState({apiJobStatus: apiJobStatusConstants.inProgress})
    const {searchInput, jobType, salaryRange} = this.state

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${jobType}&minimum_package=${salaryRange}&search=${searchInput}`
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const totalList = data.jobs

      const jobsTotalList = totalList.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsListData: jobsTotalList,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterKeyDown = event => {
    if (event.key === 'Enter') {
      this.getJobsListDetails()
    }
  }

  onClickSearchIcon = () => {
    this.getJobsListDetails()
  }

  onChangeCheckbox = event => {
    const abc = types.push(event.target.id)
    const string = types.join(',')
    console.log(types)
    console.log(string)
    this.setState({jobType: string}, this.getJobsListDetails)
  }

  onChangeRadioButton = event => {
    console.log(event.target.id)
    this.setState({salaryRange: event.target.id}, this.getJobsListDetails)
  }

  renderJobsListSuccessView = () => {
    const {jobsListData} = this.state
    const noJobsList = jobsListData.length === 0

    return noJobsList ? (
      <div className="no-jobs-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1 className="no-jobs-found-heading">No Jobs Found</h1>
        <p className="no-jobs-found-text">
          We could not find any jobs. Try other filters
        </p>
      </div>
    ) : (
      <ul className="jobs-container">
        {jobsListData.map(eachJob => (
          <JobItem jobDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  onClickJobsListRetryButton = () => {
    this.getJobsListDetails()
  }

  renderJobsListFailureView = () => (
    <div className="jobs-list-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="jobs-list-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-list-failure-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        onClick={this.onClickJobsListRetryButton}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    return (
      <div className="profile-container">
        <img
          src={profileData.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="profile-bio">{profileData.shortBio}</p>
      </div>
    )
  }

  onClickProfileRetryButton = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        onClick={this.onClickProfileRetryButton}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileAllPossibleViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  renderJobsListAllPossibleViews = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.renderJobsListSuccessView()
      case apiJobStatusConstants.failure:
        return this.renderJobsListFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-app-container">
          <div className="profile-and-jobs-filters-container">
            {this.renderProfileAllPossibleViews()}
            <hr className="line" />
            <div className="types-of-employment-container">
              <h1 className="jobs-filters-heading">Type of Employment</h1>
              <ul className="employment-types-container">
                {employmentTypesList.map(eachType => (
                  <li className="list-item" key={eachType.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={eachType.employmentTypeId}
                      onChange={this.onChangeCheckbox}
                    />
                    <label
                      htmlFor={eachType.employmentTypeId}
                      className="applied-filters"
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="line" />
            <div className="types-of-salary-range-container">
              <h1 className="jobs-filters-heading">Salary Range</h1>
              <ul className="salary-range-container">
                {salaryRangesList.map(eachRange => (
                  <li className="list-item" key={eachRange.salaryRangeId}>
                    <input
                      type="radio"
                      id={eachRange.salaryRangeId}
                      onChange={this.onChangeRadioButton}
                    />
                    <label
                      htmlFor={eachRange.salaryRangeId}
                      className="applied-filters"
                    >
                      {eachRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-list-container">
            <div className="search-input-container">
              <input
                type="search"
                value={searchInput}
                placeholder="Search"
                className="search-input"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterKeyDown}
              />
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch
                  fontSize={15}
                  color="#ffffff"
                  className="search-icon"
                />
              </button>
            </div>
            {this.renderJobsListAllPossibleViews()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
