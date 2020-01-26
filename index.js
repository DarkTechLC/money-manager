const fs = require('fs');
const os = require('os');
const rl = require('readline-sync');

const homedir = os.homedir();
const path = `${homedir}/.MoneyMg/`
const file = 'money.json';
const filePath = `${path}${file}`;

let data;

try {
  data = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  fs.mkdirSync(path);
  let content = [];
  content = JSON.stringify(content)
  fs.writeFileSync(filePath, content);
  data = fs.readFileSync(filePath, 'utf8');
}

const money = JSON.parse(data);

let red, blue, yellow, green, white, reset;

red = '\u001b[1;31m';
blue = '\u001b[1;34m';
yellow = '\u001b[1;33m';
green = '\u001b[1;32m';
white = '\u001b[1;30m';
reset = '\u001b[0m';

let i, year, month, amount, origin, status, client, contact, additional;

function lineSeparetor() {
  console.log(
    `${blue}\n+----------------------------------------------------------------+\n${white}`
  );
};

function printReceived() {
  let infos = `${green}  Registro ${Number(i) + 1}:${white}
    Data: ${money[i].month}/${money[i].year}
    Valor: R$ ${money[i].amount}
    Origem: ${money[i].origin}.
    Status: ${money[i].status}
    Cliente: ${money[i].client}
    Contato: ${money[i].contact}
    Informações adicionais: ${money[i].additional}\n`

  console.log(infos);
};

function add() {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const y = new Date().getFullYear();
  const m = months[new Date().getMonth()];

  year = rl.questionInt(` > Digite o ano do registro(Padrão: ${y}): `,
    { defaultInput: y });
  month = rl.question(` > Digite o mês do registro(Padrão: ${m}): `,
    { defaultInput: m });
  amount = rl.questionFloat(' > Digite o valor do registro: ');
  origin = rl.question(' > Digite a origem do registro: ',
    { defaultInput: '' });
  status = rl.question(' > Status de pagamento(Padrão: Pago): ',
    { defaultInput: 'Pago' })
  client = rl.question(' > Digite o nome do cliente: ',
    { defaultInput: '' });
  contact = rl.question(' > Digite algum contato do cliente: ',
    { defaultInput: '' });
  additional = rl.question(' > Informações adicionais: ',
    { defaultInput: '' });

  money.push(
    {
      "year": year,
      "month": month,
      "amount": amount,
      "origin": origin,
      "status": status,
      "client": client,
      "contact": contact,
      "additional": additional
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

  let indexReceived = rl.questionInt(' > Digite o registro a ser deletado: ') - 1;
  money.splice(indexReceived, 1);

  lineSeparetor();
  console.log(`${green} >> Deletado com sucesso. Salvo em '${filePath}'.`);
  lineSeparetor();
};

function updateR() {
  for (i in money) {
    printReceived();
  };

  let indexReceived = rl.questionInt(' > Digite o registro a ser atualizado: ') - 1;

  lineSeparetor();

  year = money[indexReceived].year;
  month = money[indexReceived].month;
  amount = money[indexReceived].amount;
  origin = money[indexReceived].origin;
  status = money[indexReceived].status;
  client = money[indexReceived].client;
  contact = money[indexReceived].contact;
  additional = money[indexReceived].additional;

  money[indexReceived].year = rl.questionInt(
    ` > Digite o ano do registro(Atual: ${yellow}${year}${white}): `,
    { defaultInput: year }
  );
  money[indexReceived].month = rl.question(
    ` > Digite o mês do registro(Atual: ${yellow}${month}${white}): `,
    { defaultInput: month }
  );
  money[indexReceived].amount = rl.questionFloat(
    ` > Digite o valor do registro(Atual: ${yellow}${amount}${white}): `,
    { defaultInput: amount }
  );
  money[indexReceived].origin = rl.question(
    ` > Digite a origem do registro(Atual: ${yellow}${origin}${white}): `,
    { defaultInput: origin }
  );
  money[indexReceived].status = rl.question(
    ` > Status de pagamento(Atual: ${yellow}${status}${white}): `,
    { defaultInput: status }
  );
  money[indexReceived].client = rl.question(
    ` > Digite o nome do cliente(Atual: ${yellow}${client}${white}): `,
    { defaultInput: client }
  );
  money[indexReceived].contact = rl.question(
    ` > Digite algum contato do cliente(Atual: ${yellow}${contact}${white}): `,
    { defaultInput: contact }
  );
  money[indexReceived].additional = rl.question(
    ` > Informações adicionais(Atual: ${yellow}${additional}${white}): `,
    { defaultInput: additional }
  );

  lineSeparetor();

  i = money.length - 1;
  printReceived();

  lineSeparetor();
  console.log(`${green} >> Atualizado com sucesso. Salvo em '${filePath}'.`);
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
  let totalReceived = 0;
  let totalPending = 0;

  for (let i in money) {
    let status = money[i].status;

    if (status === 'Pago') {
      totalReceived += money[i].amount;
    } else {
      totalPending += money[i].amount;
    }
  }

  console.log(`${green} >> Total recebido: R$ ${totalReceived}`);
  console.log(`${red} >> Total pendente: R$ ${totalPending}`);
}

function menu() {
  lineSeparetor();
  console.log(`\t\t\t${blue}MoneyManager${white}`);
  lineSeparetor();

  const options = [
    'Adicionar um registro',
    'Deletar um registro',
    'Atualizar um registro',
    'Visualizar registros',
    'Ver totais'
  ];

  let index = rl.keyInSelect(options, 'Selecione uma opção:',
    { cancel: `${red}Sair${white}` });

  lineSeparetor();

  if (index === 0) {
    add();
    save();
  } else if (index === 1) {
    deleteR();
    save();
  } else if (index === 2) {
    updateR();
    save();
  } else if (index === 3) {
    printInfo();
  } else if (index === 4) {
    printTotal();
    lineSeparetor();
  }
};

menu();