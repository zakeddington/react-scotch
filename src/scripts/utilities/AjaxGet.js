/**
 * AjaxGet
 * @description
 * Returns an Ajax GET request using deferred, url is required,
 * dataType and crossDomain are optional.
 *
 * @return: json, html, text
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */

const AjaxGet = function(url, dataType, crossDomain) {
	return $.ajax({
		type: 'GET',
		url: url,
		dataType: dataType || 'json',
		crossDomain: crossDomain || false
	});
};

export default AjaxGet;