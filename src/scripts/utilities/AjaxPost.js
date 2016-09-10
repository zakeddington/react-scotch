/**
 * AjaxPost
 * @description
 * Returns an Ajax  response using deferred, url & data are required,
 * contentType, dataType, and crossDomain are optional.
 *
 * @return: json, html, text
 *
 * @global
 * @author       zake <zak.eddington@popagency.com>
 * @copyright    Copyright (c) 2015 Xbox
 */
const AjaxPost = function(url, data, dataType, crossDomain) {
	return $.ajax({
		type: 'POST',
		url: url,
		data: data,
		//contentType: 'application/json; charset=utf-8',
		dataType: dataType || 'json',
		crossDomain: crossDomain || true
	});
};

export default AjaxPost;