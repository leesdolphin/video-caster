
class FetchError extends Error

  constructor: (@response, @reqUrl) ->
    super(@response.statusText)

class AutomationBlockedError extends FetchError

class RequestBlockedError extends FetchError


console.log(new FetchError({statusText: 'hello'}))
