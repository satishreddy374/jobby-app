import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiJobItemStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    skillList: [],
    lifeAtCompany: {},
    similarJobsList: [],
    apiJobItemStatus: apiJobItemStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiJobItemStatus: apiJobItemStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        id: data.job_details.id,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        lifeAtTheCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        jobSkills: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),

        similarJobs: data.similar_jobs.map(similarJob => ({
          companyLogoUrl: similarJob.company_logo_url,
          employmentType: similarJob.employment_type,
          id: similarJob.id,
          jobDescription: similarJob.job_description,
          location: similarJob.location,
          rating: similarJob.rating,
          title: similarJob.title,
        })),
      }

      this.setState({
        jobData: updatedData,
        skillList: updatedData.jobSkills,
        lifeAtCompany: updatedData.lifeAtTheCompany,
        similarJobsList: updatedData.similarJobs,
        apiJobItemStatus: apiJobItemStatusConstants.success,
      })
    } else {
      this.setState({apiJobItemStatus: apiJobItemStatusConstants.failure})
    }
  }

  renderJobItemSuccessView = () => {
    const {jobData, skillList, lifeAtCompany, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      location,
      packagePerAnnum,
      rating,
      title,
      employmentType,
      jobDescription,
    } = jobData

    return (
      <div className="job-items-details-app-container">
        <div className="job-item-container">
          <div className="company-logo-and-rating-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-image"
            />
            <div className="title-and-rating-container">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar color="yellow" size={24} />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-job-type-and-package-container">
            <div className="location-and-job-type-container">
              <div className="location-container">
                <MdLocationOn color="#ffffff" size={34} />
                <p className="location">{location}</p>
              </div>
              <div className="job-type-container">
                <BsBagFill color="#ffffff" size={26} />
                <p className="job-type">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="description-container">
            <h1 className="description-heading">Description</h1>
            <div className="anchor-container">
              <a href={companyWebsiteUrl} className="anchor-text">
                Visit
              </a>
            </div>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-container">
            {skillList.map(skillDetails => (
              <li className="skill-item" key={skillDetails.name}>
                <img
                  src={skillDetails.imageUrl}
                  alt={skillDetails.name}
                  className="skill-image"
                />
                <p className="skill">{skillDetails.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image "
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobsList.map(similar => (
            <SimilarJobs similarJobDetails={similar} key={similar.id} />
          ))}
        </ul>
      </div>
    )
  }

  onClickRetryButton = () => {
    this.getJobDetails()
  }

  renderJobItemFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-view-container-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="failure-view-container-text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.onClickRetryButton}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemAllPossibleViews = () => {
    const {apiJobItemStatus} = this.state
    switch (apiJobItemStatus) {
      case apiJobItemStatusConstants.success:
        return this.renderJobItemSuccessView()
      case apiJobItemStatusConstants.failure:
        return this.renderJobItemFailureView()
      case apiJobItemStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-items-details-responsive-container">
        <Header />
        {this.renderJobItemAllPossibleViews()}
      </div>
    )
  }
}

export default JobItemDetails
