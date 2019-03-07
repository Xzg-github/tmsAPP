import {Action} from '../action-reducer/action';

const dispatch = (context, params, route, resolve) => {
  const newContext = Object.assign({}, context, {route});
  if (!context.route.children.length) {
    // 动态加载后，替换成真正的route
    context.route.children = route.children;
    context.route.action = route.action;
  }
  route.action(newContext, params).then(route => {
    resolve(route);
  });
};

const createAction = (load) => (context, params) => {
  return new Promise(resolve => {
    if (!global.isServer) {
      const action = new Action(['layout']);
      global.store.dispatch(action.assign({loading: context.path.slice(1)}));
      global.store.getState().layout.loading = '';
    }
    load(resolve, context, params);
  });
};

const createRoute = (path, load) => {
  return {path, children: [], action: createAction(load)};
};

const loadShortcut = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./shortcut').default;
    dispatch(context, params, route, resolve);
  }, 'shortcut');
};

const loadOrder = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./order').default;
    dispatch(context, params, route, resolve);
  }, 'order');
};

const loadDispatch = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./dispatch').default;
    dispatch(context, params, route, resolve);
  }, 'dispatch');
};

const loadSupervisor = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./supervisor').default;
    dispatch(context, params, route, resolve);
  }, 'supervisor');
};

const loadTrack = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./track').default;
    dispatch(context, params, route, resolve);
  }, 'track');
};

const loadBill = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./bill').default;
    dispatch(context, params, route, resolve);
  }, 'bill');
};

const loadConfig = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./config').default;
    dispatch(context, params, route, resolve);
  }, 'config');
};

const loadBasic = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./basic').default;
    dispatch(context, params, route, resolve);
  }, 'basic');
};

const loadPlatform = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./platform').default;
    dispatch(context, params, route, resolve);
  }, 'platform');
};

const loadMessage = (resolve, context, params) => {
  require.ensure([], (require) => {
    const route = require('./message').default;
    dispatch(context, params, route, resolve);
  }, 'message');
};

// The top-level (parent) route
export default {

  path: '/',

  children: [
    require('./login').default,
    require('./home').default,
    createRoute('/shortcut', loadShortcut),
    createRoute('/order', loadOrder),
    createRoute('/dispatch', loadDispatch),
    createRoute('/supervisor', loadSupervisor),
    createRoute('/track', loadTrack),
    createRoute('/bill', loadBill),
    createRoute('/config', loadConfig),
    createRoute('/basic', loadBasic),
    createRoute('/platform', loadPlatform),
    createRoute('/message', loadMessage),
    require('./password/modify').default,
    require('./password/find').default,
    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    require('./notFound').default
  ],

  async action({ next }) {
    const route = await next();
    route.title = route.title ? `${route.title} - TMS` : 'TMS';
    route.description = route.description || '';
    return route;
  }

};
