const dns = require('dns'),
  _ = require('lodash'),
  domainExpression = /https?:\/\/(?:www\.)?([^\/]+)/,
  domainRegex = new RegExp(domainExpression)

async function isUrlValid(url) {
  const domain = getDomainFromUrl(url);
  if (_.isNil(domain) || domain === '' || !domainRegex.test(url)) return false
  try {
    return await isValidDns(domain)
  } catch (error) {
    return false
  }
}

function getDomainFromUrl(url) {
  const found = url.match(domainExpression)
  if (!_.isNil(found) || !_.isEmpty(found)) {
    return found[1]
  }
  return ''
}

function isValidDns(domain) {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, (err, addr) => {
      if (addr && !err) {
        resolve(true)
      } else {
        reject(false)
      }
    });
  });
}

module.exports = isUrlValid;