const fs = require('fs');
const rl = require('readline-sync');

const filePath = '/home/clicio/Projetos/Money-Manager/money.json';
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

let i, year, month, amount, origin, status, client, contact, additional;

function lineSeparetor() {
  console.log(`${blue}\n+----------------------------------------------------------------+\n${reset}`);
};

function printReceived() {
  let infos = `${green}  Recebimento ${Number(i) + 1}:${reset}
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

  year = rl.questionInt(` > Digite o ano do recebimento(Padrão: ${y}): `, { defaultInput: y });
  month = rl.question(` > Digite o mês do recebimento(Padrão: ${m}): `, { defaultInput: m });
  amount = rl.questionInt(' > Digite o valor do recebimento: ');
  origin = rl.question(' > Digite a origem do recebimento: ');
  status = rl.question(' > Status do pagamento(Padrão: Pago): ', { defaultInput: 'Pago' })
  client = rl.question(' > Digite o nome do cliente: ', { defaultInput: '' });
  contact = rl.question(' > Digite algum contato do cliente: ', { defaultInput: '' });
  additional = rl.question(' > Informações adicionais: ', { defaultInput: '' });

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
    ` > Digite o ano do recebimento(Atual: ${year}): `,
    { defaultInput: year }
  );
  money[indexReceived].month = rl.question(
    ` > Digite o mês do recebimento(Atual: ${month}): `,
    { defaultInput: month }
  );
  money[indexReceived].amount = rl.questionInt(
    ` > Digite o valor do recebimento(Atual: ${amount}): `,
    { defaultInput: amount }
  );
  money[indexReceived].origin = rl.question(
    ` > Digite a origem do recebimento(Atual: ${origin}): `,
    { defaultInput: origin }
  );
  money[indexReceived].status = rl.question(
    ` > Status do pagamento(Atual: ${status}): `,
    { defaultInput: status }
  );
  money[indexReceived].client = rl.question(
    ` > Digite o nome do cliente(Atual: ${client}): `,
    { defaultInput: client }
  );
  money[indexReceived].contact = rl.question(
    ` > Digite algum contato do cliente(Atual: ${contact}): `,
    { defaultInput: contact }
  );
  money[indexReceived].additional = rl.question(
    ` > Digite algum contato do cliente(Atual: ${additional}): `,
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
  console.log(`\t\t\t${blue}MoneyManager${reset}`);
  lineSeparetor();

  const options = [
    'Adicionar um registro',
    'Deletar um registro',
    'Atualizar um registro',
    'Visualizar registros',
    'Ver totais'
  ];

  let index = rl.keyInSelect(options, 'Selecione uma opção:', { cancel: 'Sair' });

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