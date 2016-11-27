import React from 'react'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import logo from './static/img/logo.jpg'
import favico from './static/img/favico.png'

const BUILD_TIME = new Date().getTime()

module.exports = React.createClass({
    displayName: 'HTML',
    propTypes: {
        body: React.PropTypes.string,
    },
    render() {
        const {body, routes, location } = this.props
        const route = routes && routes[routes.length - 1];
        const data = routes ? route.page.data : {};

        const root = config.siteUrl;
        const title = data.title || config.siteTitle;
        const description = data.description || config.siteDescr;
        const url = root + (location ? location.pathname : prefixLink('/'));
        const image = root + (data.image ? require(data.image) : logo);

        const font = <link href='https://fonts.googleapis.com/css?family=Roboto:400,400italic,500,700&subset=latin' rel='stylesheet' type='text/css' />

        let css = '';
        if (process.env.NODE_ENV === 'production') {
            css = <style dangerouslySetInnerHTML={ {    __html: require('!raw!./public/styles.css')} } />
        }

        return (
            <html lang="en">
            <head>
              <meta charSet="utf-8" />
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>
                { title }
              </title>
              <meta name="description" content={ description }/>

              {/* Google Authorship Markup */}
              <link rel="author" href={`https://plus.google.com/+${config.gplusUsername}?rel=author`}/>

              {/* Social: Twitter */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content={ `@${config.twitterUsername}` } />
              <meta name="twitter:title" content={ title } />
              <meta name="twitter:description" content={ description } />
              <meta property="twitter:image:src" content={ image } />

              {/* Social: Facebook / Open Graph */}
              <meta property="og:url" content={ url } />
              <meta property="og:title" content={ title } />
              <meta property="og:image" content={ image } />
              <meta property="og:description" content={ description } />
              <meta property="og:site_name" content={ config.siteTitle } />

              {/* Social: Google+ / Schema.org  */}
              <meta itemprop="name" content={ title } />
              <meta itemprop="description" content={ description } />
              <meta itemprop="image" content={ image } />

              {/* Favicon */}
              <link rel="shortcut icon" href={ favico } type="image/png" />
              {/* Android Lolipop Theme Color */}
              <meta name="theme-color" content="#3e3c3c" />

              { font }
              { css }

            </head>
            <body>
              <div id="react-mount" dangerouslySetInnerHTML={ {    __html: this.props.body} } />
              <script src={ prefixLink(`/bundle.js?t=${BUILD_TIME}`) } />
            </body>
            </html>
        )
    },
})
