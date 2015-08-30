import Entity from './entity';
import generateUUID from '../util/guid';

const RESERVED_COMPONENT_PROPERTIES = new Set(['is', 'id']);

export default class Manager {
	
	constructor(components=new Map()) {
		this.components = components;
		this.entities = new Map();
	}

	//return a copy, no entitities, only components.
	clone() {
		return new Manager(this.components);
	}

	validate_component(component) {
		for(let key of Object.keys(component)) {
			if (key.slice(0, 2) === '__') {
				throw new Error('Properties starting with "__" are reserved.');
			}

			if (RESERVED_COMPONENT_PROPERTIES.has(key)) {
				throw new Error(`Property "${key}" is reserved.`);
			}
		}
	}

	//register a component
	component(name, component={}) {
		this.validate_component(component);
		component.__name = name;
		if (this.components.has(name)) {
			throw new Error('Component [' + name +'] already defined');
		}
		this.components.set(name, component);
	}

	//shorthand alias for component
	c(...args) {
		this.component(...args);
	}

	//spawn entity
	entity(name, values = {}) {
		let id;

		if (values.id) {
			id = values.id;
			delete values['id'];
		} else {
			id = generateUUID();
		}

		if (this.entities.has(id)) {
			throw new Error(`Entity with id [${id}] already exists!`);
		}

		let entity = new Entity(this, id);
		entity.__extend(name);
		entity.__extend(values);
		this.entities.set(entity.id, entity);
		entity.bootstrap();
		return entity;
	}

	//shorthand for entity
	e(...args) {
		return this.entity(...args);
	}
}