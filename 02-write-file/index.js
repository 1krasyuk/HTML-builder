const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello! Please enter some text. Type "exit" to quit.');

function promptUser() {
  rl.question('Your text: ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Goodbye! Have a great day!');
      rl.close();
      writeStream.end(); 
      return;
    }

    writeStream.write(input + '\n', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Your input has been written to the file.');
      }
      promptUser();
    });
  });
}

promptUser();