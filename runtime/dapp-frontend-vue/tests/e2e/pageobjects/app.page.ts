class App {
  /**
   * elements
   */
  get heading() {
    return $("h1");
  }

  /**
   * methods
   */
  async open(path = "/") {
    await browser.url(path);
  }
}

export default new App();
