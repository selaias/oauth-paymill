Package.describe({
  name: 'selaias:oauth-paymill',
  version: '0.2.0',
  summary: 'An implementation of the Paymill OAuth flow.',
  git: 'https://github.com/selaias/oauth-paymill.git',
  documentation: 'README.md'
});

Npm.depends({'request': "2.53.0"});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  
  api.export('Paymill');
  
  api.addFiles(['paymill_configure.html', 'paymill_configure.js'], 'client');
  api.addFiles('paymill_server.js', 'server');
  api.addFiles('paymill_client.js', 'client');

});

