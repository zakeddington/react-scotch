/**
 * IsDescendant
 * @description
 * Checks if an element is a child node of another element.
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */

const IsDescendant = function(parent, child) {
	var node = child.parentNode;
	while (node !== null) {
		if (node === parent) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
};

export default IsDescendant;
