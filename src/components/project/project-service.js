(function () {
  'use strict';

  angular.module('exceptionless.project', ['restangular'])
    .factory('projectService', ['$cacheFactory', '$rootScope', 'Restangular', function ($cacheFactory, $rootScope, Restangular) {
      var _cache = $cacheFactory('http:project');
      $rootScope.$on('cache:clear', _cache.removeAll);
      $rootScope.$on('cache:clear-project', _cache.removeAll);
      $rootScope.$on('auth:logout', _cache.removeAll);
      $rootScope.$on('OrganizationChanged', _cache.removeAll);
      $rootScope.$on('ProjectChanged', _cache.removeAll);

      $rootScope.$on('StackChanged', function($event, data) {
        if (data.added) {
          _cache.removeAll();
        }
      });

      var _cachedRestangular = Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setDefaultHttpFields({ cache: _cache });
      });

      function create(organizationId, name) {
        return Restangular.all('projects').post({'organization_id': organizationId, 'name': name, delete_bot_data_enabled: true  });
      }

      function demoteTab(id, name) {
        return Restangular.one('projects', id).one('promotedtabs').remove({ name: name });
      }

      function getAll(options, useCache) {
        if (useCache === undefined || useCache) {
          return _cachedRestangular.all('projects').getList(angular.extend({}, { limit: 100 }, options));
        }

        return Restangular.all('projects').getList(angular.extend({}, { limit: 100 }, options));
      }

      function getById(id, useCache) {
        if (useCache === undefined || useCache) {
          return _cachedRestangular.one('projects', id).get();
        }

        return Restangular.one('projects', id).get();
      }

      function getByOrganizationId(id, options, useCache) {
        if (useCache === undefined || useCache) {
          return _cachedRestangular.one('organizations', id).all('projects').getList(options || {});
        }

        return Restangular.one('organizations', id).all('projects').getList(options || {});
      }

      function getConfig(id) {
        return _cachedRestangular.one('projects', id).one('config').get();
      }

      function getNotificationSettings(id, userId) {
        return _cachedRestangular.one('users', userId).one('projects', id).one('notifications').get();
      }

      function isNameAvailable(name) {
        return Restangular.one('projects', 'check-name').get({ name: encodeURIComponent(name) });
      }

      function promoteTab(id, name) {
        return Restangular.one('projects', id).post('promotedtabs', null, { name: name });
      }

      function remove(id) {
        return Restangular.one('projects', id).remove();
      }

      function removeConfig(id, key) {
        return Restangular.one('projects', id).one('config').remove({ key: key });
      }

      function removeData(id, key) {
        return Restangular.one('projects', id).one('data').remove({ key: key });
      }

      function removeNotificationSettings(id, userId) {
        return Restangular.one('users', userId).one('projects', id).one('notifications').remove();
      }

      function resetData(id) {
        return Restangular.one('projects', id).one('reset-data').get();
      }

      function update(id, project) {
        return Restangular.one('projects', id).patch(project);
      }

      function setConfig(id, key, value) {
        return Restangular.one('projects', id).post('config', value, { key: key });
      }

      function setData(id, key, value) {
        return Restangular.one('projects', id).post('data', value, { key: key });
      }

      function setNotificationSettings(id, userId, settings) {
        return Restangular.one('users', userId).one('projects', id).post('notifications', settings);
      }

      var service = {
        create: create,
        demoteTab: demoteTab,
        getAll: getAll,
        getById: getById,
        getByOrganizationId: getByOrganizationId,
        getConfig: getConfig,
        getNotificationSettings: getNotificationSettings,
        isNameAvailable: isNameAvailable,
        promoteTab: promoteTab,
        remove: remove,
        removeConfig: removeConfig,
        removeData: removeData,
        removeNotificationSettings: removeNotificationSettings,
        resetData: resetData,
        setConfig: setConfig,
        setData: setData,
        setNotificationSettings: setNotificationSettings,
        update: update
      };
      return service;
    }
    ]);
}());
