var Future = Npm.require('fibers/future');
var request = Npm.require('request')


Paymill = {};

OAuth.registerService('paymill', 2, null, function(query, callback) {

  var response = getTokenResponse(query);
  
  var accessToken = response.access_token;
  var refreshToken = response.refresh_token;

  var serviceData = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    id: response.merchant_id,
    email: response.email
  };
  
  var whitelisted = ['methods', 'currencies', 'payment_methods', 'is_active', 'livemode', 'access_keys'];

  var fields = _.pick(response, whitelisted);
  _.extend(serviceData, fields);
  
  return {
    serviceData: serviceData,
    options: {profile: {merchant_id: response.merchant_id}}
  };
});

var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;


// returns an object containing:
// - accessToken
// - merchant data
var getTokenResponse = function (query) {

  var config = ServiceConfiguration.configurations.findOne({service: 'paymill'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var request_params = {
    grant_type: "authorization_code",
    code: query.code,
    client_id: config.client_id,
    client_secret: OAuth.openSecret(config.secret),
    redirect_uri: OAuth._redirectUri('paymill', config)
  };
  var paramlist = [];
  for (var pk in request_params) {
    paramlist.push(pk + "=" + request_params[pk]);
  }
  
  var body_string = paramlist.join("&");

  var request_details = {
    method: "POST",
    headers: {'User-Agent': userAgent, 'content-type' : 'application/x-www-form-urlencoded'},
    uri: 'https://connect.paymill.com/token',
    body: body_string
  };

  var fut = new Future();
  request(request_details, function(error, response, body) {
     var responseContent;
    try {
      responseContent = JSON.parse(body);
    } catch(e) {
      error = new Meteor.Error(204, 'Response is not a valid JSON string.');
      fut.throw(error);
    } finally {
      fut.return(responseContent);
    }
  });
  var res = fut.wait();
  return res;
};

Paymill.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
