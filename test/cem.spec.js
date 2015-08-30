import should from 'should';
import spy from 'spy';
import Manager from '../src/cem/manager';

describe('Manager', function() {
	describe('#component()', function() {

		it('should register a new component', function() {
			let m = new Manager();
			m.components.size.should.equal(0);
			m.component('thing', {
				foo: 'bar'
			});
			m.components.size.should.equal(1);
			m.components.get('thing').__name.should.equal('thing');
		});

		it('should not allow registering component with the same name twice', function () {
			let m = new Manager(),
				err;
			m.component('thing', {
				foo: 'bar'
			});

			try {
				m.component('thing', {
					bar: 'foo'
				});
			} catch (e) {
				err = e;
			}
			should.exist(err);

		});
	});

	describe('#entity()', function () {
		it('should assign generate new id to new entities', function () {
			let m = new Manager();
			m.c('foo');
			let foo = m.e('foo');
			should.exist(foo.id);
			let anotherFoo = m.e('foo');
			foo.id.should.not.equal(anotherFoo.id);
		});

		it('should assign existing id if passed as a value', function () {
			let m = new Manager();
			m.c('foo');
			let foo = m.e('foo', {id: 123});
			foo.id.should.equal(123);
		});

		it('should not allow creating entity with same id twice', function () {
			let m = new Manager();
			m.c('foo');
			m.e('foo', {id: 123});
			let err;
			try {
				m.e('foo', {id: 123});
			} catch (e) {
				err = e;
			}
			should.exist(err);
		});

		it('should call bootstrap() on create', function () {
			let m = new Manager(),
			 	bootstrap = spy();
			m.c('foo', {
				bootstrap
			});
			m.e('foo');
			bootstrap.callCount.should.equal(1);
		});
	});

	describe ("#clone()", function () {
		it('should crate a new instance of manager with same components, no entities', function () {
			let m = new Manager();
			m.c('foo');
			m.e('foo');
			m.components.size.should.equal(1);
			m.entities.size.should.equal(1);

			let m2 = m.clone();
			m2.components.size.should.equal(1);
			m2.entities.size.should.equal(0);
		});
	});
});