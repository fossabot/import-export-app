import { hot } from 'react-hot-loader'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { getInstance } from 'd2/lib/d2'
import i18n from '@dhis2/d2-i18n'
import { Loading } from 'components'
import { setUser, clearUser } from 'reducers'
import Template from 'pages/Template'

import * as pages from './pages'
import { Route, withRouter } from 'react-router-dom'

@withRouter
@connect(({ user }) => ({ user }), { setUser, clearUser })
class App extends React.Component {
  static childContextTypes = {
    d2: PropTypes.object
  }

  state = {
    d2: null,
    loaded: false
  }

  async componentDidMount() {
    try {
      const d2 = await getInstance()
      const lang = d2.currentUser.userSettings.settings.keyUiLocale
      moment.locale(lang)
      this.props.setUser(d2.currentUser)
      this.setState({
        d2,
        loaded: true
      })
    } catch (e) {
      console.log('/api/me error')
      console.log(e)
      this.props.clearUser()
      this.setState({
        loaded: true
      })
    }
  }

  getChildContext() {
    return {
      d2: this.state.d2 || null
    }
  }

  render() {
    if (!this.state.loaded) {
      return <Loading />
    }

    const { user } = this.props
    if (!user) {
      return <div>{i18n.t('user is not logged in')}</div>
    }

    return (
      <Template>
        {Object.keys(pages).map(k => {
          const page = pages[k]
          return (
            <Route
              key={`page-${k}`}
              path={page.path}
              exact={true}
              component={page}
            />
          )
        })}
      </Template>
    )
  }
}

export default hot(module)(App)
