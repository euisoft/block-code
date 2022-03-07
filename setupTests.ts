Object.defineProperty(navigator, 'clipboard', {
  value: {
    readText: () => '123456'
  }
})
