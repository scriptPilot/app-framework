module.exports = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('A')
      resolve()
    }, 1000)
  })
}
