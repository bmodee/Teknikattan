import puppeteer from 'puppeteer'
import { CLIENT_URL, DEVTOOLS_ENABLED, HEADLESS_ENABLED, SLOW_DOWN_FACTOR } from './TestingConstants'

describe('Login page', () => {
  const buttonSelector = '[data-testid="submit"]'
  const emailSelector = '[data-testid="email"]'
  const passwordSelector = '[data-testid="password"]'
  let browser: puppeteer.Browser
  let page: puppeteer.Page
  beforeEach(async () => {
    // Set up testing environment
    browser = await puppeteer.launch({
      headless: HEADLESS_ENABLED,
      devtools: DEVTOOLS_ENABLED,
      slowMo: SLOW_DOWN_FACTOR,
    })
    page = await browser.newPage()

    //Navigate to login screen
    await page.goto(CLIENT_URL)
    await page.waitForSelector('.MuiFormControl-root')
  })

  afterEach(async () => {
    await browser.close()
  })

  it('Can submit login user with correct credentials', async () => {
    await page.click(emailSelector)
    await page.keyboard.type('admin@test.se')
    await page.click(passwordSelector)
    await page.keyboard.type('password')
    await page.click(buttonSelector)
    await page.waitForTimeout(4000)
    const AdminTitle = await page.$eval('.MuiTypography-root', (el) => el.textContent)
    expect(AdminTitle).toEqual('Startsida')
  }, 9000000)

  it('Shows correct error message when logging in user with incorrect credentials', async () => {
    await page.click(emailSelector)
    await page.keyboard.type('wrong@wrong.se')
    await page.click(passwordSelector)
    await page.keyboard.type('wrongPassword')
    await page.click(buttonSelector)
    await page.waitForTimeout(1000)
    const errorMessages = await page.$$eval('.MuiAlert-message > p', (elList) => elList.map((p) => p.textContent))
    // The error message is divided into two p elements
    const errorMessageRow1 = errorMessages[0]
    const errorMessageRow2 = errorMessages[1]
    expect(errorMessageRow1).toEqual('Någonting gick fel. Kontrollera')
    expect(errorMessageRow2).toEqual('dina användaruppgifter och försök igen')
  }, 9000000)

  it('Shows correct error message when email is in incorrect format', async () => {
    await page.click(emailSelector)
    await page.keyboard.type('email')
    await page.click(passwordSelector)
    await page.waitForTimeout(1000)
    const helperText = await page.$eval('.MuiFormHelperText-root', (el) => el.textContent)
    expect(helperText).toEqual('Email inte giltig')
  }, 9000000)

  it('Shows correct error message when password is too short (<6 chars)', async () => {
    await page.click(passwordSelector)
    await page.keyboard.type('short')
    await page.click(emailSelector)
    const helperText = await page.$eval('.MuiFormHelperText-root', (el) => el.textContent)
    expect(helperText).toEqual('Lösenord måste vara minst 6 tecken')
  }, 9000000)
})
