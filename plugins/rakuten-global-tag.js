export default ({ }) => {

  (function(url) {
    if (!window.DataLayer) {
      window.DataLayer = {};
    }
    if (!window.DataLayer.events) {
      window.DataLayer.events = {};
    }
  
    window.DataLayer.events.SPIVersion = window.DataLayer.events.SPIVersion || '3.0';
    window.DataLayer.events.SiteSection = '1';
    // eslint-disable-next-line
    var loc, ct = document.createElement('script');
    ct.type = 'text/javascript';
    ct.async = true;
    ct.src = url;
    loc = document.getElementsByTagName('script')[0];
    loc.parentNode.insertBefore(ct, loc);
  }(document.location.protocol + '//intljs.rmtag.com/115836.ct.js'));

}