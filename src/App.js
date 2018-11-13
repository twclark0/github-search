import React, { Component } from 'react'
import logo from './logo.svg'
import css from './App.module.css'
import { debounce } from 'lodash'
import Item from './item'

class App extends Component {
  state = {
    input: '',
    users: [],
    totalCount: 0,
    currentPage: 1,
    loading: false,
    totalPages: 0
  }
  handleChange = ({ target: { value } }) => {
    this.setState({
      input: value
    })
    this.fetchGithub()
  }

  fetchGithub = debounce(async () => {
    if (!this.state.input) {
      this.setState({
        users: [],
        totalCount: 0
      })
      return
    }
    this.setState({ loading: true })
    const json = await fetch(
      `https://api.github.com/search/users?q=${
        this.state.input
      }&per_page=8&page=${this.state.currentPage}`
    )
    const { items, total_count } = await json.json()
    const allFetchDataForUsers = await this.formatData(items)

    this.setState({
      users: allFetchDataForUsers,
      loading: false,
      totalCount: total_count,
      totalPages: total_count / 10
    })
  }, 800)

  formatData = async items => {
    return items.reduce(async (acc, cur) => {
      const bioJson = await fetch(cur.url)
      const bio = await bioJson.json()
      const newAcc = await acc
      return [
        ...newAcc,
        {
          bio,
          login: cur.login,
          avatar_url: cur.avatar_url,
          type: cur.type,
          url: cur.html_url
        }
      ]
    }, [])
  }

  paginateItems = dir => async () => {
    this.setState({ loading: true })
    const newItemsJson = await fetch(
      `https://api.github.com/search/users?q=${
        this.state.input
      }&per_page=10&page=${this.state.currentPage + dir}`
    )
    const { items } = await newItemsJson.json()
    const allFetchDataForUsers = await this.formatData(items)
    this.setState(prevState => ({
      loading: false,
      currentPage: prevState.currentPage + dir,
      users: allFetchDataForUsers
    }))
  }
  render() {
    return (
      <div className={css.App}>
        <div className={css.inputContainer}>
          <input
            className={css.input}
            type="text"
            value={this.state.input}
            onChange={this.handleChange}
            placeholder="search.."
          />
          {this.state.loading ? (
            <i className="fas fa-spinner" />
          ) : (
            <i className="fas fa-search" />
          )}
        </div>
        <div className={css.ulContainer}>
          {this.state.users.map(u => (
            <Item
              key={u.login}
              avatar={u.avatar_url}
              url={u.url}
              login={u.login}
              type={u.type}
              bio={u.bio}
            />
          ))}
        </div>
        <div className={`${this.state.users.length ? css.arrows : css.hide}`}>
          <i
            className={`fas fa-arrow-left ${
              this.state.currentPage === 1 ? css.hide : css.left
            }`}
            onClick={this.paginateItems(-1)}
          />
          <i
            className={`fas fa-arrow-right ${
              this.state.currentPage <= this.state.totalPages
                ? css.right
                : css.hide
            }`}
            onClick={this.paginateItems(1)}
          />
        </div>
        <p className={`${this.state.totalCount ? css.count : css.hide}`}>
          Total count: {this.state.totalCount}
        </p>
      </div>
    )
  }
}

export default App
