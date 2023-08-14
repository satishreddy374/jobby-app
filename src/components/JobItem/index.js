import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    jobDescription,
    title,
    rating,
    location,
    companyLogoUrl,
    employmentType,
    packagePerAnnum,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="path">
      <li className="list-container">
        <div className="company-logo-and-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo-image"
          />
          <div className="title-and-rating-container">
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar color="yellow" size={26} />
              <p className="rating-text">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-job-type-and-package-container">
          <div className="location-and-job-type-container">
            <div className="location-container">
              <MdLocationOn color="#ffffff" size={28} />
              <p className="location">{location}</p>
            </div>
            <div className="job-type-container">
              <BsBagFill color="#ffffff" size={22} />
              <p className="job-type">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <h1 className="description-heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
