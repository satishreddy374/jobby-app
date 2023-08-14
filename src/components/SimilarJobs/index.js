import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'

import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    title,
    rating,
  } = similarJobDetails

  return (
    <li className="similar-jobs-item-container">
      <div className="company-logo-title-and-rating-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="title-rating-container">
          <h1 className="title">{title}</h1>
          <div className="rating-container">
            <AiFillStar color="yellow" size={24} />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="description-head">Description</h1>
      <p className="description-text">{jobDescription}</p>
      <div className="location-and-job-type-container">
        <div className="location-container">
          <MdLocationOn color="#ffffff" size={30} />
          <p className="location-text">{location}</p>
        </div>
        <div className="job-type-container">
          <BsBagFill color="#ffffff" size={20} />
          <p className="job-type-text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
