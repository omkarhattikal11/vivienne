const http = require('http');

const data = JSON.stringify({
  customer_name: "John Doe",
  item_name: "Test Sherwani",
  amount: 2500,
  seller_name: "Royal Rentals"
});

const options = {
  hostname: '127.0.0.1',
  port: 5500,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let resData = '';
  res.on('data', (chunk) => { resData += chunk; });
  res.on('end', () => {
    console.log("POST Response:", resData);

    // Now GET orders
    http.get('http://127.0.0.1:5500/api/orders?seller_name=Royal%20Rentals', (res2) => {
      let getRes = '';
      res2.on('data', (c) => { getRes += c; });
      res2.on('end', () => {
        console.log("GET Response:", getRes);
      });
    });
  });
});

req.write(data);
req.end();
