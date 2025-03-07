const puppeteer = require('puppeteer');

describe('Teste de carregamento da página', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('A página deve carregar corretamente', async () => {
    await page.goto('http://127.0.0.1:5000/'); // Altere para a URL correta
    const title = await page.title();
    expect(title).not.toBeNull(); // Garante que a página carregou
  });
});
