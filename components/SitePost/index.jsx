import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import DisqusThread from 'react-disqus-thread'
import ReadNext from '../ReadNext'
import profilePic from '../../pages/photo.jpg'
import './style.css'
import '../../static/css/highlight.css'

const url = path => `${config.siteUrl}${path}`

class SitePost extends React.Component {
    render() {
        const {route} = this.props
        const post = route.page.data
        const home = (
        <div>
          <Link className='gohome' to={ prefixLink('/') }> All Articles
          </Link>
        </div>
        )

        return (
            <div>
              { home }
              <div className='blog-single'>
                <div className='text'>
                  <h1>{ post.title }</h1>
                  <div className='date-published'>
                    <em>{ moment(post.date).format('D MMM YYYY') }</em>
                  </div>
                  <div dangerouslySetInnerHTML={ {    __html: post.body} } />
                </div>
                <div className='footer'>
                  <Share post={post} {...this.props} />
                  <hr/>
                    <a href={ config.siteTwitterUrl }>
                    <img src={profilePic} width='175' height='175' />
                    <p>
                      <small>Author</small>
                    </p>
                    <p>
                      <b>{ config.siteAuthor }</b>
                    </p>
                    <em>{ config.siteDescr }</em>
                  </a>
                  <hr/>
                  <DisqusThread
                    shortname="tadeuzagallo"
                    title={post.title}
                    url={`${url(this.props.location.pathname)}`}
                  />
                </div>
              </div>
            </div>
            );
    }
}

const Share = ({ post, location }) => {
  const category = Array.isArray(post.category) ? post.category.join(',') : (post.category || '');

  const twitterUrl = `https://twitter.com/intent/tweet?text="${post.twitter_text}" ${url(location.pathname)} via @${config.twitterUsername}&hashtags=${category}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url(location.pathname)}`;
  const gplusUrl = `https://plus.google.com/share?url=${url(location.pathname)}`;

  return (
    <section className="share">
      <b>Share:</b>
      <a
        aria-label="Share on Twitter"
        href={twitterUrl}
        onClick={e => { e.preventDefault(); window.open(twitterUrl, 'twitter-share', 'width=550,height=235');}}
        title="Share on Twitter"
      >
        <i className="fa fa-lg fa-twitter" />
      </a>
      <a
        aria-label="Share on Facebook"
        href={facebookUrl}
        onClick={e => { e.preventDefault(); window.open(facebookUrl, 'facebook-share','width=580,height=296');}}
        title="Share on Facebook"
      >
        <i className="fa fa-lg fa-facebook" />
      </a>
      <a
        aria-label="Share on Google Plus"
        href={gplusUrl}
        onClick={e => { e.preventDefault(); window.open(gplusUrl, 'google-plus-share', 'width=490,height=530');}}
        title="Share on Google+"
      >
        <i className="fa fa-lg fa-google-plus" />
      </a>
    </section>
  );
}

SitePost.propTypes = {
    post: React.PropTypes.object.isRequired,
    pages: React.PropTypes.array,
}

export default SitePost
