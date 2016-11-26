import React from 'react'
import moment from 'moment'
import { RouteHandler, Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import DocumentTitle from 'react-document-title'
import access from 'safe-access'
import { config } from 'config'
import SiteSidebar from '../SiteSidebar'
import './style.css';

class SitePage extends React.Component {
    render() {
        const {route} = this.props
        const post = route.page.data

        return (
            <div>
              <SiteSidebar {...this.props}/>
              <div className='content'>
                <div className='main'>
                  <div className='main-inner'>
                    <div className='blog-page'>
                      <div className='text'>
                        <h1>{ post.title }</h1>
                        <div dangerouslySetInnerHTML={ {    __html: post.body} } />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
    }
}

SitePage.propTypes = {
    post: React.PropTypes.object.isRequired,
    pages: React.PropTypes.array,
}

export default SitePage