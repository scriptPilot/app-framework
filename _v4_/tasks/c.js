module.exports = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('NOT C')
      reject()
    }, 1000)
  })
}
