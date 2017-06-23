/* global describe, beforeEach, sinon, afterEach, it, expect request, app */
import * as dns from '../../../src/lib/dns'

describe('GET /v1/dns/monitor', () => {
	const testData = [{
		domain: "google.com",
		match: false
	}];
	let sandbox
	const requestGet = () => request(app)
		.get('/v1/dns/monitor')
		.set('Accept', 'application/json')
	beforeEach(() => {
		sandbox = sinon.sandbox.create()
		sandbox.stub(dns, 'list').returns(Promise.resolve(testData))
	})
	afterEach(() => {
		sandbox.restore()
	})
	it('should list dns entries', (done) => {
		requestGet()
			.end((err, res) => {
				if (err) {
					throw err
				}
				expect(res.body).deep.equal({
					status: 'success',
					data: testData,
				})
				done()
			})
	})
})

describe('GET /v1/dns/check/:hostname', () => {
	let sandbox
	const testData = {
		domain: "google.com",
		match: false,
	}
	const requestGet = () => request(app)
		.get('/v1/dns/check/google.com')
		.set('Accept', 'application/json')
	beforeEach(() => {
		sandbox = sinon.sandbox.create()
		sandbox.stub(dns, 'check').returns(Promise.resolve(testData))
	})
	afterEach(() => {
		sandbox.restore()
	})
	it('should check domain', (done) => {
		requestGet()
			.end((err, res) => {
				if (err) {
					throw err
				}
				expect(res.body).deep.equal({
					status: 'success',
					data: testData,
				})
				done()
			})
	})
})