//default config
const PORT = 5000;
const FILE = 'db';

//generate log text color for terminal
// alternative [ npm i colors or chalk or cli-color ]
const getColor = (percentage) => `\x1b[${percentage}m`;
const TERMINAL_COLOR_GREEN = getColor(32);
const TERMINAL_COLOR_BLUE = getColor(34);
const TERMINAL_COLOR_RESET = '\x1b[0m';
const TERMINAL_BLINK = '\x1b[5m';

//imports
const jsonServer = require('json-server');
const portfinder = require('portfinder');
const readline = require('readline');

const server = jsonServer.create();
server.use(jsonServer.defaults());

const rl = readline.createInterface(process.stdin, process.stdout);

function question(theQuestion) {
  return new Promise((resolve) =>
    rl.question(theQuestion, (ans) => resolve(ans))
  );
}

async function askQuestions() {
  let dbFileName = await question('Please enter database file name (JSON):\n');

  const router = jsonServer.router(
    `database/${String(dbFileName) !== '' ? dbFileName : FILE}.json`
  );

  server.use(router);

  let userEnteredPort = await question('Enter localhost port:\n');

  while (userEnteredPort <= 0 || userEnteredPort >= 65535) {
    if (String(userEnteredPort) === '') userEnteredPort = PORT;
    else userEnteredPort = await question('ββ Enter valid localhost port:\n');
  }

  portfinder
    .getPortPromise({
      host: 'localhost',
      startPort: 0,
      port: userEnteredPort,
      stopPort: 65535,
    })
    .then((res) => {
      if (Number(res) === Number(userEnteredPort))
        console.log(
          `Port`,
          `${TERMINAL_COLOR_GREEN}`,
          `${res}`,
          `${TERMINAL_COLOR_RESET}`,
          `is available π¨`
        );
      else
        console.log(
          `β³Port ${userEnteredPort} is busy. ππΌ Switching to available port ${res}`
        );
      server.listen(userEnteredPort, () => {
        console.log(
          `Running on port `,
          `${TERMINAL_BLINK}`,
          `${TERMINAL_COLOR_BLUE}`,
          `http://localhost:${res}`,
          `${TERMINAL_COLOR_RESET}`
        );
      });
    })
    .catch((err) => {
      console.log(
        'Something went wrong!βΉ Port is not available or it is out of range'
      );
      process.exit(1);
    });

  rl.close();
}
askQuestions();
