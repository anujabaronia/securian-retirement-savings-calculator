import { Given, When, Then } from '@wdio/cucumber-framework';
import Page from '../pageObjects/launchPage.js';
import Calculate from '../pageObjects/calculatePage.js';
import defaultValues from '../pageObjects/adjustDefaultValuesPage.js';

Given(/^user navigates to the retirement calculator page$/, async () => {
    await Page.launch();
});

Given(/^user fills the required details for ([^"]*)$/, async function (testCaseName) {        
    await Calculate.fillRequiredDetails(testCaseName);
});

Given(/^user modifies the default values ([^"]*)$/, async function (testCaseName) {
    await defaultValues.fillDefaultValuesDetails(testCaseName);
});

When(/^user clicks on ([^"]*) button$/, async (button) => {
await Calculate.clickButton(button);
}); 

Then(/^user should see the retirement savings details$/, async () => {
    await Calculate.validateResultSection();
});

Then(/^user should see the error messages for ([^"]*)$/, async (testCaseName) => {     
    await Calculate.validateErrorMessages(testCaseName);
});

Then(/^user should see the Social Security details for ([^"]*)$/, async (testCaseName) => {
    await Calculate.validateSocialSecurityDetails(testCaseName);
});
