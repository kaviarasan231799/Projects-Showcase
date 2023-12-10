import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ShowCase extends Component {
  state = {
    actId: categoriesList[0].id,
    data: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {actId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${actId}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({data: updatedData, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelect = event => {
    this.setState({actId: event.target.value}, this.getData)
  }

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <ul className="list-container">
        {data.map(eachData => (
          <li key={eachData.id} className="li-card">
            <img src={eachData.imageUrl} alt={eachData.name} />
            <p>{eachData.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader height={50} width={50} />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="img-failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  onRetry = () => {
    this.getData()
  }

  renderPageView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {actId} = this.state
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="img-logo"
          />
        </nav>
        <div className="selection-container">
          <select
            onChange={this.onChangeSelect}
            value={actId}
            className="select-container"
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderPageView()}
        </div>
      </div>
    )
  }
}

export default ShowCase
