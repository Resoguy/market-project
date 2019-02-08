export const authHeaders = function (token) {
  let options = {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }
  return options
}
