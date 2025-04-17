const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // <-- ESSA LINHA SOLUCIONA O ERRO
  });
  page = await browser.newPage();
}, 15000);

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

test('A página deve carregar corretamente', async () => {
  await page.goto('http://google.com'); // Ajuste a URL conforme necessário
  const title = await page.title();
  expect(title).toBeTruthy(); // Apenas verifica se a página carregou
});
