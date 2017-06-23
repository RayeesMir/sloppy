/* global describe, beforeEach, sinon, afterEach, it, expect request, app */
import * as profiles from '../../../src/lib/profiles';

const testData = [{
  email: 'a@b.de'
}, {
  email: 'c@d.co'
}, ]

describe('GET /v1/profile', () => {
  let sandbox

  const requestGet = () => request(app)
    .get('/v1/profiles')
    .set('Accept', 'application/json')

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(profiles, 'list').returns(Promise.resolve(testData))
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should list profiles', (done) => {
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