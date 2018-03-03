'use strict';

var abee = abee || {};
var l = function(){
  for (var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}

abee.documentation = abee.documentation || {};
abee.documentation.url = 'https://trippublic.dcsplus.net/dynapack-documentation';

abee.endpoints = abee.endpoints || {};
abee.endpoints.staticdata = abee.endpoints.staticdata || {};
abee.endpoints.auth = abee.endpoints.auth || {};

abee.endpoints.__toArray = function(){
  var endpoints = [];
  endpoints.push(["staticdata.countries" , this.staticdata.countries]);
  endpoints.push(["staticdata.cities" , this.staticdata.cities]);
  endpoints.push(["auth.login" , this.auth.login]);
  endpoints.push(["auth.logout" , this.auth.logout]);
  endpoints.push(["auth.users" , this.auth.users]);
  return endpoints;
}
// base
abee.endpoints.base = 'https://trippublic.dcsplus.net/dynapack/clients/csb/public/api.php';
// static data
abee.endpoints.staticdata.countries = abee.endpoints.base + '/static-data/countries';
abee.endpoints.staticdata.cities = abee.endpoints.base + '/static-data/cities';
// auth
abee.endpoints.auth.login = abee.endpoints.base + '/auth/login';
abee.endpoints.auth.logout = abee.endpoints.base + '/auth/logout';
abee.endpoints.auth.users = abee.endpoints.base + '/auth/users';

// l(abee.endpoints.__toArray());
