import { Given, When, Then } from '@wdio/cucumber-framework';
import Page from '../pageobjects/launchPage.js';
import Calculate from '../pageobjects/calculatePage.js';
import defaultValues from '../pageobjects/adjustDefaultValuesPage.js';

Given(/^navigate to the calculator page$/, async () => {
    await Page.launch();
});

Given(/^fill the age details with ([^"]*) ([^"]*)$/, async function (testCaseName, sheetName) {        
    await Calculate.fillAgeDetails(testCaseName, sheetName);
});

Given(/^fill income-savings details ([^"]*) ([^"]*)$/, async function (testCaseName, sheetName) {
    await Calculate.fillIncomeDetails(testCaseName, sheetName);
});

Given(/^select inclusion of social security income benefits ([^"]*) ([^"]*)$/, async function (testCaseName, sheetName) {
    await Calculate.fillSocialSecurityDetails(testCaseName, sheetName);
});

Given(/^adjust the default values ([^"]*) ([^"]*)$/, async function (testCaseName, sheetName) {
    await defaultValues.fillDefaultValuesDetails(testCaseName, sheetName);
});

When(/^close the cookie banner$/, async () => {
    await Page.closeCookiesPopUp();
});

When(/^I click on ([^"]*) button$/, async (button) => {
await Calculate.clickButton(button);
});

Then(/^validate home page details$/, async (table) => {
let details = (await table.raw())[0];
await Page.validateHomePageDetails(details);
});   

Then(/^I should see the retirement savings details$/, async () => {
    await Calculate.validateResultSection();
});

Then(/^validate the error messages for ([^"]*) ([^"]*)$/, async (testCaseName, sheetName) => {     
    await Calculate.validateErrorMessages(testCaseName, sheetName);
});

Then(/^validate the form is cleared$/, async () => {
    await Calculate.validateFormCleared();
});
