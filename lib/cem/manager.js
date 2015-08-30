'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _entity = require('./entity');

var _entity2 = _interopRequireDefault(_entity);

var _utilGuid = require('../util/guid');

var _utilGuid2 = _interopRequireDefault(_utilGuid);

var RESERVED_COMPONENT_PROPERTIES = new Set(['is', 'id']);

var Manager = (function () {
	function Manager() {
		var components = arguments.length <= 0 || arguments[0] === undefined ? new Map() : arguments[0];

		_classCallCheck(this, Manager);

		this.components = components;
		this.entities = new Map();
	}

	//return a copy, no entitities, only components.

	_createClass(Manager, [{
		key: 'clone',
		value: function clone() {
			return new Manager(this.components);
		}
	}, {
		key: 'validate_component',
		value: function validate_component(component) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Object.keys(component)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;

					if (key.slice(0, 2) === '__') {
						throw new Error('Properties starting with "__" are reserved.');
					}

					if (RESERVED_COMPONENT_PROPERTIES.has(key)) {
						throw new Error('Property "' + key + '" is reserved.');
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

		//register a component
	}, {
		key: 'component',
		value: function component(name) {
			var _component = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			this.validate_component(_component);
			_component.__name = name;
			if (this.components.has(name)) {
				throw new Error('Component [' + name + '] already defined');
			}
			this.components.set(name, _component);
		}

		//shorthand alias for component
	}, {
		key: 'c',
		value: function c() {
			this.component.apply(this, arguments);
		}

		//spawn entity
	}, {
		key: 'entity',
		value: function entity(name) {
			var values = arguments.length <= 1 || arguments[1] === undefined ? new Map() : arguments[1];

			var id = undefined;

			if (values.has('id')) {
				id = values.get('id');
				values['delete']('id');
			} else {
				id = (0, _utilGuid2['default'])();
			}

			var entity = new _entity2['default'](this, id);
			entity.__extend(name);
			entity.__extend(values);
			entity.bootstrap();
			this.entities.set(entity.id, entity);
			return entity;
		}

		//shorthand for entity
	}, {
		key: 'e',
		value: function e() {
			return this.entity.apply(this, arguments);
		}
	}]);

	return Manager;
})();

exports['default'] = Manager;
module.exports = exports['default'];