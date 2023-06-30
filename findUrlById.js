function findUrlById(id, urls) {
  for (let [k, v] of urls.entries()) {
      if (String(v) === id) return k
  }
  return ''
}
  
module.exports = findUrlById;