
var test      = require('tap').test
  , seneca    = require('seneca')
  , importer  = require('./')

test('importing csv lines as entities', function(t) {
  var s         = seneca()
    , pear      = s.make('pear')
    , instance  = importer(s, { entity: 'pear' })

  instance.end('name,price\nhello,200\n')

  instance.on('importCompleted', function() {
    pear.list$({}, function(err, res) {
      t.notOk(err, 'no error')
      t.equal(res.length, 1, 'one result')
      t.equal(res[0].name, 'hello', 'same name')
      t.equal(res[0].price, '200', 'same price')

      t.end()
    })
  })
})

test('acting on every csv line', function(t) {
  t.plan(1)

  var s         = seneca()
    , pear      = s.make('pear')
    , pattern   = { sample: 'call' }
    , instance  = importer(s, { act: pattern })
    , message   = { sample: 'call', name: 'hello', price: '200' }

  function check(arrived, done) {
    delete arrived.actid$
    t.deepEqual(arrived, message)
    done(null)
  }

  s.add(pattern, check);

  instance.end('name,price\nhello,200\n')
})
