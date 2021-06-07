const { Client } = require("pg");

let dbUrl = ''

exports.configuration = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Req body is empty!"
    });
    return;
  }

  const d = req.body;
  dbUrl = `postgres://${d.username}:${d.passwd}@${d.host}:${d.port}/${d.dbname}`;
}

exports.sync = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Req body is empty!"
    });
    return;
  }

  const data = req.body[0];
  const table = 'dac' + new Date().getTime();

  delete data._timestamp;
  delete data._url;

  const attr = Object.keys(data);
  let columns = '';
  let sentence = '';
  for (let i = 0; i < attr.length; i++) {
      columns = columns + `${attr[i]},`
      sentence = sentence + `${attr[i]} text,`
  }
  columns = columns.substr(0, columns.length - 1);
  sentence = sentence.substr(0, sentence.length - 1);

  const valLen = data[attr[0]].length;
    let values = '';
    for (let i = 0; i < valLen; i++) {
        let val = '(';
        for (let j = 0; j < attr.length; j++) {
            val = val + `'${data[attr[j]][i]}'` + ','
        }
        val = val.substr(0, val.length - 1) + ')';
        values = values + val + ','
    }
    values = values.substr(0, values.length - 1);


  const createTable = `CREATE TABLE ${table} (${sentence});`
  const insertTable = `INSERT INTO ${table}(${columns}) VALUES ${values};`

  const client = new Client({
      connectionString: dbUrl
  })

  await client.connect()

  await client.query(
      createTable,
      (err, result) => {
        if (err) {
          res.status(200).send('db create failed');
        }
        res.status(200).send('ok')
      }
  )

    await client.query(
        insertTable,
        (err, result) => {
            client.end();
            if (err) {
                res.status(200).send('db update failed');
            }
            res.status(200).send('ok')
        }
    )

};
