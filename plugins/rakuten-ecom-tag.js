export default (rm_trans) => {
  window.trg = window.trg || {}
  window.trg.rakuten = rm_trans;
  
  // if (process.env.NODE_ENV !== 'production') {
  //   console.log('R:false');
	// 	return;
  // }
  
			
  /* eslint-disable */
window.trg.rakuten = rm_trans;
  /*Do not edit any information beneath this line*/
  window.DataLayer ? (DataLayer.events = DataLayer.events || {}, DataLayer.Sale = DataLayer.Sale || {Basket: rm_trans}, DataLayer.Sale.Basket = DataLayer.Sale.Basket || rm_trans) : window.DataLayer = {Sale: {Basket: rm_trans}, events: {}}, DataLayer.events.SPIVersion = '3.0', DataLayer.Sale.Basket.Ready = !0; function __readRMCookie(e) {
    for (var a = e + '=', r = document.cookie.split(';'), t = 0; t < r.length; t++) {
      for (var n = r[t]; n.charAt(0) == ' ';)n = n.substring(1, n.length); if (n.indexOf(a) == 0) return n.substring(a.length, n.length);
    } return '';
  } function __readRMCookiev2(e, a) {
    for (var r = __readRMCookie(a = a || 'rmStore'); r !== decodeURIComponent(r);)r = decodeURIComponent(r); for (var t = r.split('|'), n = 0; n < t.length; n++) {
      var i = t[n].split(':')[0], o = t[n].split(':')[1]; if (i === e) return o;
    } return '';
  } function __readParam(e, a, r, t) {
    var n = e || '', i = a || '', o = r || '', s = t || {}, d = __readRMCookiev2(n), u = s[i], m = (d = s.ignoreCookie || !1 ? 0 : d) || u || o; return m = (typeof m !== 'string' || m.toLowerCase() !== 'false') && m;
  } function sRAN() {
    var e = DataLayer && DataLayer.Sale && DataLayer.Sale.Basket ? DataLayer.Sale.Basket : {}, a = e.affiliateConfig || {}, r = __readParam('atm', 'tagType', 'pixel', a), t = __readParam('adr', 'discountType', 'order', a), n = __readParam('acs', 'includeStatus', 'false', a), i = __readParam('arto', 'removeOrderTax', 'false', a), o = __readParam('artp', 'removeTaxFromProducts', 'false', a), s = __readParam('artd', 'removeTaxFromDiscount', 'false', a), d = __readParam('atr', 'taxRate', 0, a); d = Number(d); var u = __readParam('ald', 'land', !1, {}) || (a.land && !0 === a.land ? __readRMCookie('ranLandDateTime') : a.land) || !1, m = __readParam('atrv', 'tr', !1, {}) || (a.tr && !0 === a.tr ? __readRMCookie('ranSiteID') : a.tr) || !1, l = !1, c = __readParam('amid', 'ranMID', '', a) || e.ranMID; if (!c) return !1; if (!(void 0 === a.allowCommission || a.allowCommission !== 'false')) return !1; var p = e.orderid || 'OrderNumberNotAvailable', f = '', y = '', _ = '', v = '', N = e.currency || ''; N = N.toUpperCase(); var h = e.taxAmount ? Math.abs(Math.round(100 * Number(e.taxAmount))) : 0, g = e.discountAmount ? Math.abs(Math.round(100 * Number(e.discountAmount))) : 0; if (s && d) var C = (100 + Number(d)) / 100, g = Math.round(g / C); var b = r === 'pixel' ? 'ep' : r === 'mop' ? 'eventnvppixel' : 'ep', S = e.customerStatus || '', D = document.location.protocol + '//track.linksynergy.com/' + b + '?', w = ''; S != null && S != '' && (n && S.toUpperCase() == 'EXISTING' || n && S.toUpperCase() == 'RETURNING') && (w = 'R_'); for (var P = [], x = 0, T = 0; T < (e.lineitems ? e.lineitems.length : 0); T++) {
      for (var R = !1, k = window.JSON ? JSON.parse(JSON.stringify(e.lineitems[T])) : e.lineitems[T], L = 0; L < P.length; L++)P[L].SKU === k.SKU && (R = !0, P[L].quantity = Number(P[L].quantity) + Number(k.quantity)); R || P.push(k), x += Number(k.quantity) * Number(k.unitPriceLessTax || k.unitPrice) * 100;
    } for (T = 0; T < P.length; T++) {
      var k = P[T], I = encodeURIComponent(k.SKU), M = k.unitPriceLessTax || k.unitPrice, U = k.quantity, A = encodeURIComponent(k.productName) || '', O = Math.round(Number(M) * Number(U) * 100); !o || !d || k.unitPriceLessTax && k.unitPriceLessTax !== k.unitPrice || (O /= C = (100 + d) / 100), t.toLowerCase() === 'item' && g && (O -= g * O / x), f += w + I + '|', y += U + '|', _ += Math.round(O) + '|', v += w + A + '|';
    }f = f.slice(0, -1), y = y.slice(0, -1), _ = _.slice(0, -1), v = v.slice(0, -1), g && t.toLowerCase() === 'order' ? (f += '|' + w + 'DISCOUNT', v += '|' + w + 'DISCOUNT', y += '|0', _ += '|-' + g) : g && t.toLowerCase() === 'item' && (l = !0), i && h && (f += '|' + w + 'ORDERTAX', y += '|0', _ += '|-' + h, v += '|' + w + 'ORDERTAX'), D += 'mid=' + c + '&ord=' + p + '&skulist=' + f + '&qlist=' + y + '&amtlist=' + _ + '&cur=' + N + '&namelist=' + v + '&img=1&', u && (D += 'land=' + u + '&'), m && (D += 'tr=' + m + '&'), l && (D += 'discount=' + g + '&'), D[D.length - 1] === '&' && (D = D.slice(0, -1)); var E, B = document.createElement('img'); B.setAttribute('src', D), B.setAttribute('height', '1px'), B.setAttribute('width', '1px'), (E = document.getElementsByTagName('script')[0]).parentNode.insertBefore(B, E);
  } function sDisplay() {
    var e = null, a = null, r = null, t = null, n = window.DataLayer && window.DataLayer.Sale && window.DataLayer.Sale.Basket ? window.DataLayer.Sale.Basket : {}, i = n.displayConfig || {}, o = n.customerStatus || '', s = n.discountAmount ? Math.abs(Number(n.discountAmount)) : 0, d = null, u = __readParam('dmid', 'rdMID', '', i); if (!u) return !1; var m = __readParam('dtm', 'tagType', 'js', i), l = (m = m === 'js' || m === 'if' || m === 'img' ? m : 'js') === 'if' ? 'iframe' : m === 'img' ? m : 'script', c = '//' + __readParam('ddn', 'domain', 'tags.rd.linksynergy.com', i) + '/' + m + '/' + u, p = __readParam('dis', 'includeStatus', 'false', i), f = ''; if (o != null && o != '' && (p && o.toUpperCase() == 'EXISTING' || p && o.toUpperCase() == 'RETURNING') && (f = 'R_'), !n.orderid || !n.conversionType) return !1; r = 0, a = f + n.orderid, e = '', t = 'conv', d = n.currency; for (var y = 0; y < (n.lineitems ? n.lineitems.length : 0); y++)r += Number(n.lineitems[y].unitPriceLessTax) * Number(n.lineitems[y].quantity) || Number(n.lineitems[y].unitPrice) * Number(n.lineitems[y].quantity), e += encodeURIComponent(n.lineitems[y].SKU) + ','; r = Math.round(100 * (r - s)) / 100, (e = e.slice(0, -1)) && (c = c.indexOf('?') > -1 ? c + '&prodID=' + e : c + '/?prodID=' + e), a && (c = c.indexOf('?') > -1 ? c + '&orderNumber=' + a : c + '/?orderNumber=' + a), r && (c = c.indexOf('?') > -1 ? c + '&price=' + r : c + '/?price=' + r), d && (c = c.indexOf('?') > -1 ? c + '&cur=' + d : c + '/?cur=' + d), t && (c = c.indexOf('?') > -1 ? c + '&pt=' + t : c + '/?pt=' + t); var _ = document.createElement(l); _.src = c, l === 'script' ? _.type = 'text/javascript' : l === 'iframe' && _.setAttribute('style', 'display: none;'), document.getElementsByTagName('body')[0].appendChild(_);
  } function sSearch() {
    var e = window.DataLayer && window.DataLayer.Sale && window.DataLayer.Sale.Basket ? window.DataLayer.Sale.Basket : {}, a = e.searchConfig || {}, r = __readParam('smid', 'rsMID', '', a); if (!r) return !1; var t = function() {
        var t = e.discountAmount ? Math.abs(Number(e.discountAmount)) : 0, n = __readParam('sct', 'conversionType', 'conv', a), i = 0, o = ''; if (!e.orderid) return !1; i = 0, o = e.orderid; for (var s = 0; s < (e.lineitems ? e.lineitems.length : 0); s++)i += Number(e.lineitems[s].unitPrice) * Number(e.lineitems[s].quantity); i = Math.round(100 * (i - t)) / 100; window.DataLayer.Sale.Basket; var d = []; d[0] = 'id=' + r, d[1] = 'type=' + n, d[2] = 'val=' + i, d[3] = 'orderId=' + o, d[4] = 'promoCode=' + e.discountCode || '', d[5] = 'valueCurrency=' + e.currency || 'USD', d[6] = 'GCID=', d[7] = 'kw=', d[8] = 'product=', k_trackevent(d, '113');
      }, n = document.location.protocol.indexOf('s') > -1 ? 'https://' : 'http://'; n += '113.xg4ken.com/media/getpx.php?cid=' + r; var i = document.createElement('script'); i.type = 'text/javascript', i.src = n, i.onload = t, i.onreadystatechange = function() {
      this.readyState != 'complete' && this.readyState != 'loaded' || t();
    }, document.getElementsByTagName('head')[0].appendChild(i);
  }sRAN(), sDisplay(), sSearch();


}