export default class Entity {

	constructor(manager, id) {
		this.id = id;
		this.__manager = manager;
		this.__components = new Set();
		this.__component_hash = new Map();
		this.__properties = new Map();
	}

	bootstrap(...args) {
		//call bootstrap method on each component 

		for (let component of this.__components) {
			if (component.bootstrap) {
				component.bootstrap.apply(this, args);
			}
		}
	}

	__extend(component) {
		if (typeof component === 'string') {
			if (this.__manager.components.has(component)) {
				component = this.__manager.components.get(component);
			} else {
				throw new ReferenceError(`Trying to extend a component [${component}] that is not registered.`);
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
		for (let dependency of component.requires || []) {
			this.__extend(dependency);
		}

		//extend this entity with properties/functions from component
		for (let key of Object.keys(component)) {

			let value = component[key];

			//don't add getter/setter to 'private' properties
			if (key[0] !== '_' && typeof value !== 'function') {
				
				if (typeof value === 'object') {
					value = JSON.parse(JSON.stringify(value));					
				}

				Object.defineProperty(this, key, {
					set: val => {
						this.__properties.set(key, val);
					},

					get: () => {
						return this.__properties.get(key);
					}
				});

			} else {
				if (key !== 'bootstrap') {
					this[key] = value;
				}
			}
		}
	}

	is(component_name) {
		return this.__component_hash.has(component_name);
	}
}