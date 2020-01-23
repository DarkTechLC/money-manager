const fs = require('fs');
const rl = require('readline-sync');

const filePath = './money.json';
let data;

try {
  data = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  let content = [];
  content = JSON.stringify(content)
  fs.writeFileSync(filePath, content);
  data = fs.readFileSync(filePath, 'utf8');
}

const money = JSON.parse(data);

let red, blue, yellow, green, reset;

red = '\u001b[31m';
blue = '\u001b[34m';
yellow = '\u001b[33m';
green = '\u001b[32m';
reset = '\u001b[0m';

let i, year, month, amount, origin;

function lineSeparetor() {
  console.log(`${blue}\n+----------------------------------------------------------------+\n${reset}`);
};

function printReceived() {
  let infos = `${green}  Recebimento ${Number(i) + 1}:${reset}
    Data: ${money[i].month}/${money[i].year}
    Valor: R$ ${money[i].amount}
    Origem: ${money[i].origin}.\n`

  console.log(infos);
};

function add() {
  year = rl.question(' > Digite o ano do recebimento: ')
  month = rl.question(' > Digite o mês do recebimento: ')
  amount = rl.question(' > Digite o valor do recebimento: ')
  origin = rl.question(' > Digite a origem do recebimento: ')

  money.push(
    {
      "year": Number(year),
      "month": month,
      "amount": Number(amount),
      "origin": origin
    }
  );

  lineSeparetor();

  i = money.length - 1;
  printReceived();

  lineSeparetor();
  console.log(`${green} >> Adicionado com sucesso. Salvo em '${filePath}'.`);
  lineSeparetor();
};

function deleteR() {
  for (i in money) {
    printReceived();
  };

  let indexReceived = Number(rl.question(' > Digite o recebimento a ser apagado: ')) - 1;
  money.splice(indexReceived, 1);

  lineSeparetor();
  console.log(`${green} >> Deletado com sucesso. Salvo em '${filePath}'.`);
  lineSeparetor();
};

function save() {
  const moneyNew = JSON.stringify(money);
  try {
    fs.writeFileSync(filePath, moneyNew);
  } catch (err) {
    console.log(err);
  }
};

function printInfo() {
  for (i in money) {
    printReceived();
  };

  printTotal();
  lineSeparetor();
};

function printTotal() {
  let total = 0;

  for (let i in money) {
    total += money[i].amount;
  }

  console.log(`${green} >> Total recebido: R$ ${total}`);
}

function menu() {
  lineSeparetor();
  console.log(`\t\t\t${blue}MoneyManager${reset}`);
  lineSeparetor();

  const options = [
    'Adicionar um registro de recebimento',
    'Deletar um registro de recebimento',
    'Visualizar registro de recebimentos',
    'Ver total recebido'
  ];

  let index = rl.keyInSelect(options, 'Selecione uma opção:');

  lineSeparetor();

  if (index === 0) {
    add();
    save();
  } else if (index === 1) {
    deleteR();
    save();
  } else if (index === 2) {
    printInfo();
  } else if (index === 3) {
    printTotal();
    lineSeparetor();
  }
};

menu();