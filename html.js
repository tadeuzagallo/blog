import React from 'react'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import logo from './static/img/logo.jpg'
import favico from './static/img/favico.ico'

const BUILD_TIME = Date.now()

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


        let css = '';
        let image = root + logo;
        if (process.env.NODE_ENV === 'production') {
            css = <style dangerouslySetInnerHTML={ {    __html: require('!raw!./public/styles.css')} } />
            if (data.image) {
              var req = require.context('./static/img', true, /.*\.(png|jpg)$/);
              image = root + req('./' + data.image);
            }
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

              <link rel="manifest" href="/blog/manifest.json" />

              {/* Favicon */}
              <link rel="shortcut icon" href={ favico } type="image/png" />
              {/* Android Lolipop Theme Color */}
              <meta name="theme-color" content="#3e3c3c" />

              { css }

            </head>
            <body>
              <div id="react-mount" dangerouslySetInnerHTML={ {    __html: this.props.body} } />
              <script async="true" src={ prefixLink(`/bundle.js?t=${BUILD_TIME}`) } />
              <script dangerouslySetInnerHTML={{__html:`
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('${prefixLink('/service-worker.js')}');
                }
              `}}></script>
            </body>
            </html>
        )
    },
})
