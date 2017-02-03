import ReactGA from 'react-ga'
import {config} from 'config'

ReactGA.initialize(config.googleAnalyticsId);
ReactGA.plugin.require('linkid');

exports.onRouteUpdate = (state, page, pages) => {
  ReactGA.pageview(state.pathname);
};
