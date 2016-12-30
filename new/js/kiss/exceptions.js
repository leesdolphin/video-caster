define([], () => {
  class FetchError extends Error {
    constructor(response, reqUrl) {
      super(response.statusText);
      this.response = response;
      this.reqUrl = reqUrl;
    }
  }

  class AutomationBlockedError extends FetchError {}

  class RequestBlockedError extends FetchError {}

  return {
    FetchError,
    AutomationBlockedError,
    RequestBlockedError,
  };
});
