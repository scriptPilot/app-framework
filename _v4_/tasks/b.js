module.exports = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('B')
      resolve()
    }, 1000)
  })
}
