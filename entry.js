var url = require('url')
  , inject
  , targetUrl = 'http://localhost:1337/foobar.txt'
  , query = url.parse(document.location.href, true).query

var mods = ['ng']
if (query.mock) mods.push('ngMock')
if (query.mockE2E) mods.push('ngMockE2E')

inject = angular.injector(mods).invoke

function makeCall ($http, errorMsg) {
  $http.get(targetUrl)
    .then(function (result) {
      throw new Error(errorMsg)
    })
    .then(null, function (err) {
      console.log(errorMsg + ' turned into recovery');
      return errorMsg + ' turned into recovery'
    })
}

if (!query.mock && !query.mockE2E) {

  inject(function ($http) {
    makeCall($http, 'Rejection from real $http')
  })

} else {

  inject(function ($http, $httpBackend) {
    if (query.expect) {
      $httpBackend.expectGET(targetUrl).respond('baz')
      makeCall($http, 'Rejection from $httpBackend.expectGET via ' + mods.toString())
    } else {
      $httpBackend.whenGET(targetUrl).respond('baz')
      makeCall($http, 'Rejection from $httpBackend.whenGET via ' + mods.toString())
    }
    if (query.mock || query.expect) $httpBackend.flush()
  })

}

