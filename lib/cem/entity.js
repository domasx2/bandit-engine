'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Entity = (function () {
	function Entity(manager, id) {
		_classCallCheck(this, Entity);

		this.id = id;
		this.__manager = manager;
		this.__components = new Set();
		this.__component_hash = new Map();
		this.__properties = new Map();
	}

	_createClass(Entity, [{
		key: 'bootstrap',
		value: function bootstrap() {
			//call bootstrap method on each component

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				for (var _iterator = this.__components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var component = _step.value;

					if (component.bootstrap) {
						component.bootstrap.apply(this, args);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: '__extend',
		value: function __extend(component) {
			var _this = this;

			if (typeof component === 'string') {
				if (this.__manager.components.has(component)) {
					component = this.__manager.components.get(component);
				} else {
					throw new ReferenceError('Trying to extend a component [' + component + '] that is not registered.');
				}
			}

			//extend a component only if it hasn't been previously extended
			if (component.__name) {
				if (!this.__component_hash.has(component.__name)) {
					this.__component_hash.set(component.__name, component);
				} else {
					return;
				}
			}

			this.__components.add(component);

			//extend any required components first
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = (component.requires || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var dependency = _step2.value;

					this.__extend(dependency);
				}

				//extend this entity with properties/functions from component
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2['return']) {
						_iterator2['return']();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				var _loop = function () {
					var key = _step3.value;

					var value = component[key];

					//don't add getter/setter to 'private' properties
					if (key[0] !== '_') {

						if (typeof value === 'object') {
							value = JSON.parse(JSON.stringify(value));
						}

						Object.defineProperty(_this, key, {
							set: function set(val) {
								_this.__properties.set(key, val);
							},

							get: function get() {
								return _this.__properties.get(key);
							}
						});
					} else {
						_this[key] = value;
					}
				};

				for (var _iterator3 = Object.keys(component)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					_loop();
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3['return']) {
						_iterator3['return']();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}
	}, {
		key: 'is',
		value: function is(component_name) {
			return this.__component_hash.has(component_name);
		}
	}]);

	return Entity;
})();

exports['default'] = Entity;
module.exports = exports['default'];