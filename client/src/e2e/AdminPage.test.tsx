import puppeteer from 'puppeteer'
import { CLIENT_URL, DEVTOOLS_ENABLED, HEADLESS_ENABLED, SLOW_DOWN_FACTOR } from './TestingConstants'

describe('Admin page', () => {
  const userEmailSelector = '[data-testid="userEmail"]'
  const buttonSelector = '[data-testid="submit"]'
  const emailSelector = '[data-testid="email"]'
  const passwordSelector = '[data-testid="password"]'
  let browser: puppeteer.Browser
  let page: puppeteer.Page
  jest.setTimeout(10000)
  beforeEach(async () => {
    // Set up testing environment
    browser = await puppeteer.launch({
      headless: HEADLESS_ENABLED,
      devtools: DEVTOOLS_ENABLED,
      slowMo: SLOW_DOWN_FACTOR,
    })
    page = await browser.newPage()

    //Navigate to login screen and log in
    await page.goto(CLIENT_URL)
    await page.waitForSelector('.MuiFormControl-root')
    await page.click(emailSelector)
    await page.keyboard.type('admin@test.se')
    await page.click(passwordSelector)
    await page.keyboard.type('password')
    await page.click(buttonSelector)
    await page.waitForTimeout(2000)
  })

  afterEach(async () => {
    await browser.close()
  })

  it('Should show correct email on welcome screen', async () => {
    const AdminTitle = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText
    }, userEmailSelector)
    expect(AdminTitle).toEqual('Email: admin@test.se')
  }, 9000000)

  it('Should be able to add and remove region', async () => {
    const regionTabSelector = '[data-testid="Regioner"]'
    const regionTextFieldSelector = '[data-testid="regionTextField"]'
    const regionSubmitButton = '[data-testid="regionSubmitButton"]'
    const testRegionName = 'New region test'
    const testRegionSelector = `[data-testid="${testRegionName}"]`
    const removeRegionButtonSelector = '[data-testid="removeRegionButton"]'
    //Navigate to region tab

    await page.click(regionTabSelector)
    await page.waitForSelector('.MuiFormControl-root')

    //Make sure the test region isnt already in the list
    let regions = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(regions).not.toContain(testRegionName)

    //Add the test region to the list and make sure it's present
    await page.click(regionTextFieldSelector)
    await page.keyboard.type(testRegionName)
    await page.click(regionSubmitButton)
    await page.waitForTimeout(1000)
    regions = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(regions).toContain(testRegionName)

    //Remove the test region from the list and make sure it's gone
    await page.click(testRegionSelector)
    await page.click(removeRegionButtonSelector)
    await page.waitForTimeout(1000)
    regions = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(regions).not.toContain(testRegionName)
  }, 9000000)

  it('Should be able to add and remove a user', async () => {
    const userTabSelector = '[data-testid="Användare"]'
    const addUserButtonSelector = '[data-testid="addUserButton"]'
    const addUserEmailSelector = '[data-testid="addUserEmail"]'
    const addUserPasswordSelector = '[data-testid="addUserPassword"]'
    const addUserNameSelector = '[data-testid="addUserName"]'
    const userCitySelectSelector = '[data-testid="userCitySelect"]'
    const userRoleSelectSelector = '[data-testid="userRoleSelect"]'
    const addUserSubmitSelector = '[data-testid="addUserSubmit"]'
    const removeUserSelector = '[data-testid="removeUser"]'
    const accceptRemoveUserSelector = '[data-testid="acceptRemoveUser"]'

    const testUserEmail = 'NewUser@test.test'
    const testUserPassword = 'TestPassword'
    const testUserName = 'TestUserName'
    const testUserCity = 'Linköping'
    const testUserRole = 'Admin'

    const userCitySelector = `[data-testid="${testUserCity}"]`
    const userRoleSelector = `[data-testid="${testUserRole}"]`
    const moreSelector = `[data-testid="more-${testUserEmail}"]`

    //Navigate to user tab
    await page.click(userTabSelector)
    await page.waitForSelector(addUserButtonSelector)
    //Make sure the test user isnt already in the list
    let emails = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(emails).not.toContain(testUserEmail)

    //Add the test user to the list and make sure it's present
    await page.click(addUserButtonSelector)
    await page.click(addUserEmailSelector)
    await page.keyboard.type(testUserEmail)
    await page.click(addUserPasswordSelector)
    await page.keyboard.type(testUserPassword)
    await page.click(addUserNameSelector)
    await page.keyboard.type(testUserName)
    await page.click(userCitySelectSelector)
    await page.click(userCitySelector)
    await page.waitForTimeout(100)
    await page.click(userRoleSelectSelector)
    await page.waitForTimeout(100)
    await page.click(userRoleSelector)
    await page.waitForTimeout(100)
    await page.click(addUserSubmitSelector)
    await page.waitForTimeout(1000)
    emails = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(emails).toContain(testUserEmail)

    //Remove the test user from the list and make sure it's gone
    await page.click(moreSelector)
    await page.click(removeUserSelector)
    await page.click(accceptRemoveUserSelector)
    await page.waitForTimeout(1000)
    emails = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(emails).not.toContain(testUserEmail)
  }, 9000000)

  it('Should be able to add and remove competition', async () => {
    const competitionsTabSelector = '[data-testid="Tävlingshanterare"]'
    const addCompetitionsButtonSelector = '[data-testid="addCompetition"]'
    const competitionNameSelector = '[data-testid="competitionName"]'
    const competitionRegionSelectSelector = '[data-testid="competitionRegion"]'
    const acceptAddCompetition = '[data-testid="acceptCompetition"]'
    const removeCompetitionButtonSelector = '[data-testid="removeCompetitionButton"]'

    const testCompetitionName = 'New test competition'
    const testCompetitionRegion = 'Linköping'

    const testCompetitionRegionSelector = `[data-testid="${testCompetitionRegion}"]`
    const testCompetitionSelector = `[data-testid="${testCompetitionName}"]`
    //Navigate to competitionManager tab
    await page.click(competitionsTabSelector)
    await page.waitForSelector('.MuiFormControl-root')

    //Make sure the test region isnt already in the list
    let competitions = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(competitions).not.toContain(testCompetitionName)

    //Add the test region to the list and make sure it's present
    await page.click(addCompetitionsButtonSelector)
    await page.click(competitionNameSelector)
    await page.keyboard.type(testCompetitionName)
    await page.click(competitionRegionSelectSelector)
    await page.waitForTimeout(100)
    await page.click(testCompetitionRegionSelector)
    await page.waitForTimeout(100)
    await page.click(acceptAddCompetition)
    await page.waitForTimeout(1000)

    competitions = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(competitions).toContain(testCompetitionName)

    //Remove the test region from the list and make sure it's gone
    await page.click(testCompetitionSelector)
    await page.waitForTimeout(100)
    await page.click(removeCompetitionButtonSelector)
    await page.waitForTimeout(1000)
    competitions = await page.$$eval('.MuiTableRow-root > td', (elList) => elList.map((p) => p.textContent))
    expect(competitions).not.toContain(testCompetitionName)
  }, 9000000)
})
