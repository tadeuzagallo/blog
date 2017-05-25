import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import DisqusThread from 'react-disqus-thread'
import ReadNext from '../ReadNext'
import profilePic from '../../static/img/logo-small.jpg'
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
                <div className="header">
                  <h1>{ post.title }</h1>
                  <p className="desc">{ post.description }</p>
                  <div className='date-published'>
                    <em>{ moment(post.date).format('D MMM YYYY') }</em>
                  </div>
                </div>
                <div className='text'>
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
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z"/></svg>
      </a>
      <a
        aria-label="Share on Facebook"
        href={facebookUrl}
        onClick={e => { e.preventDefault(); window.open(facebookUrl, 'facebook-share','width=580,height=296');}}
        title="Share on Facebook"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 486.037 1007" ><path d="M124 1005V536H0V367h124V223C124 110 197 5 366 5c68 0 119 7 119 7l-4 158s-52-1-108-1c-61 0-71 28-71 75v123h183l-8 169H302v469H123"></path></svg>
      </a>
      <a
        aria-label="Share on Google Plus"
        href={gplusUrl}
        onClick={e => { e.preventDefault(); window.open(gplusUrl, 'google-plus-share', 'width=490,height=530');}}
        title="Share on Google+"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1664 1750.0833" class="icon icons8-Google-Plus" ><path d="M735 796q0 36 32 70.5t77.5 68T935 1008t77 104 32 142q0 90-48 173-72 122-211 179.5T487 1664q-132 0-246.5-41.5T69 1485q-37-60-37-131 0-81 44.5-150T195 1089q131-82 404-100-32-42-47.5-74T536 842q0-36 21-85-46 4-68 4-148 0-249.5-96.5T138 420q0-82 36-159t99-131q77-66 182.5-98T673 0h418L953 88H822q74 63 112 133t38 160q0 72-24.5 129.5t-59 93-69.5 65-59.5 61.5-24.5 66zm-146-96q38 0 78-16.5t66-43.5q53-57 53-159 0-58-17-125t-48.5-129.5T636 123 519 82q-42 0-82.5 19.5T371 154q-47 59-47 160 0 46 10 97.5t31.5 103 52 92.5 75 67 96.5 26zm2 873q58 0 111.5-13t99-39 73-73 27.5-109q0-25-7-49t-14.5-42-27-41.5-29.5-35-38.5-34.5-36.5-29-41.5-30-36.5-26q-16-2-48-2-53 0-105 7t-107.5 25-97 46-68.5 74.5-27 105.5q0 70 35 123.5t91.5 83 119 44T591 1573zm810-876h213v108h-213v219h-105V805h-212V697h212V480h105v217z"></path></svg>
      </a>
    </section>
  );
}

SitePost.propTypes = {
    post: React.PropTypes.object.isRequired,
    pages: React.PropTypes.array,
}

export default SitePost
