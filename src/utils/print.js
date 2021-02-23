export default {
  openPrint(route, newWindow = true) {
    if(newWindow) {
      let routeData = this.$router.resolve(route);
      window.open(routeData.href, '_blank');
    } else {
      this.$router.push(route);
    }
  }
}