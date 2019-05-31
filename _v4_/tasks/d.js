module.exports = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('D')
      resolve()
    }, 1000)
  })
}
