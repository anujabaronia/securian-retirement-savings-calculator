import utils from '../utils/utils';
import logger from '../utils/logger';

class calculatePage {

    get currentAge() { return $('//*[@id="current-age"]') };
    get retirementAge() { return $('//*[@id="retirement-age"]') };
    get annualIncome() { return $('//*[@id="current-income"]') };
    get spouseIncome() { return $('//*[@id="spouse-income"]') };
    get currentTotalSavings() { return $('//*[@id="current-total-savings"]') };
    get currentAnnualSavings() { return $('//*[@id="current-annual-savings"]') };
    get savingsIncreaseRate() { return $('//*[@id="savings-increase-rate"]') };
    get yesIncludeSocialSecurity() { return $('//label[@for="yes-social-benefits"]') };
    get noIncludeSocialSecurity() { return $('//label[@for="no-social-benefits"]') };
    get maritalStatusFields() { return $('//*[@class="row social-security-field"]') };
    get maritalStatusMarried() { return $('//label[@for="married"]') };
    get maritalStatusSingle() { return $('//label[@for="single"]') };
    get socialSecurityOverrideAmt() { return $('//*[@id="social-security-override"]') };
    get calculateButton() { return $('//*[@data-tag-id="submit"]') };
    get resultSection() { return $('//*[@id="calculator-results-section"]') };
    get resultMessage() { return $('//*[@id="result-message"]') };
    get resultChart() { return $('//*[@id="results-chart"]') };
    get resultTable() { return $('//table[@class="dsg-featured-data-stacked-table"]') };
    get emailResultBtn() { return $('//*[@data-bs-target="#calc-email-modal"]') };
    get editInfoButton() { return $('//button[@onclick="navigateToRetirementForm();"]') };
    get fullResultsButton() { return $('//button[@onclick="showFullResults();"]') };
    get invalidCurrentAge() { return $('//*[@id="invalid-current-age-error"]') };
    get invalidRetirementAge() { return $('//*[@id="invalid-retirement-age-error"]') };
    get invalidCurrentIncome() { return $('//*[@id="invalid-current-income-error"]') };
    get invalidCurrentTotalSaving() { return $('//*[@id="invalid-current-total-savings-error"]') };
    get invalidCurrentAnnualSaving() { return $('//*[@id="invalid-current-annual-savings-error"]') };
    get invalidSavingIncRate() { return $('//*[@id="invalid-savings-increase-rate-error"]') };
    get clearFormButton() { return $('//*[@onclick="clearRetirementForm();"]') };




    /* Filling the details */
    async fillRequiredDetails(testCaseName) {
        try {
            await this.fillAgeDetails(testCaseName);
            await this.fillIncomeDetails(testCaseName);
            await this.fillSocialSecurityDetails(testCaseName);
        }
        catch (error) {
            logger.error("Error filling required details:", error);
            throw error;
        }
    }

    /*Fill the age details*/
    async fillAgeDetails(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        await utils.elementAction(this.currentAge, 'setValue', data.currentAge, 'Current Age');
        await utils.elementAction(this.retirementAge, 'setValue', data.retirementAge, 'Retirement Age');
    }

    /*Fill Income/Savings Details*/
    async fillIncomeDetails(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        await utils.elementAction(this.annualIncome, 'setValue', data.annualIncome, 'Current Annual Income');
        await utils.elementAction(this.spouseIncome, 'setValue', data.spouseIncome, 'Spouse Annual Income');
        await utils.elementAction(this.currentTotalSavings, 'setValue', data.currentTotalSavings, 'Current Retirement Savings');
        await utils.elementAction(this.currentAnnualSavings, 'setValue', data.currentAnnualSavings, 'Current Annual Savings');
        await utils.elementAction(this.savingsIncreaseRate, 'setValue', data.savingsIncreaseRate, 'Current Annual Rate of increase in savings');
    }

    /*Fill Social Security Income Details*/
    async fillSocialSecurityDetails(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        if (data.includeSocialSecurity === 'No') {

            await utils.elementAction(this.noIncludeSocialSecurity, 'click', null, 'Social Security Benefits Selection');
        }
        else {
            await utils.elementAction(this.yesIncludeSocialSecurity, 'click', null, `Social Security Benefits Selection as ` + data.includeSocialSecurity);
            await utils.elementAction(this.maritalStatusFields, 'isDisplayed', null, 'Marital Status Fields');
            if (data.maritalStatus === 'Married') {
                await utils.elementAction(this.maritalStatusMarried, 'click', null, 'Marital Status as ' + data.maritalStatus);
            }
            else {
                await utils.elementAction(this.maritalStatusSingle, 'click', null, 'Marital Status as ' + data.maritalStatus);
            }
            await utils.elementAction(this.socialSecurityOverrideAmt, 'setValue', data.socialSecurityOverrideAmt, 'Social Security override amount');
        }

    }

    /* Clicking the buttons */
    async clickButton(button) {
        try {
            switch (button) {
                case 'Calculate':
                    await this.calculateButton.click();
                    logger.info('Clicked on Calculate Button');
                    break;
                case 'Clear-Form':
                    await this.clearFormButton.click();
                    logger.info('Clicked on Clear Form Button');
                    break;
                default:
                    throw new Error(`Button "${button}" not recognized`);
            }
        } catch (error) {
            logger.error("Error clicking button:", error);
            throw error;

        }
    }

    /* Validate the result section */
    async validateResultSection() {
        try {
            await this.resultSection.waitForDisplayed({ timeout: 10000 });
            const displayValue = await this.resultSection.getCSSProperty('display');
            if (displayValue.value === 'none') {
                logger.info('Result Section is not displayed');
                throw new Error('Result Section is not displayed');
            } else {
                await utils.elementAction(this.resultSection, 'isDisplayed', null, 'Result Section');
                await utils.elementAction(this.resultMessage, 'isDisplayed', null, 'Result Message');
                await utils.elementAction(this.resultChart, 'isDisplayed', null, 'Result Chart');
                await utils.elementAction(this.resultTable, 'isDisplayed', null, 'Result Table');
                await utils.elementAction(this.emailResultBtn, 'isClickable', null, 'Email Result Button');
                await utils.elementAction(this.editInfoButton, 'isClickable', null, 'Edit Info Button');
                await utils.elementAction(this.fullResultsButton, 'isClickable', null, 'Full Results Button');
            }
        } catch (error) {
            logger.error("Error validating result section:", error);
            throw error;

        }
    }

    /* Validate the error messages in negative testing*/
    async validateErrorMessages(testCaseName) {
        try {
            switch (testCaseName) {
                case 'noCurrentAge':
                    await this.validateInvalidCurrentAge(testCaseName);
                    break;
                case 'noRetirementAge':
                    await this.validateInvalidRetirementAge(testCaseName);
                    break;
                case 'noCurrentIncome':
                    await this.validateInvalidCurrentIncome(testCaseName);
                    break;
                case 'noCurrentTotalSavings':
                    await this.validateInvalidCurrentTotalSavings(testCaseName);
                    break;
                case 'noCurrentAnnualSavings':
                    await this.validateInvalidCurrentAnnualSavings(testCaseName);
                    break;
                case 'noSavingsIncreaseRate':
                    await this.validateInvalidSavingsIncreaseRate(testCaseName);
                    break;
                case 'currAgeGrtThanRetAge':
                    await this.validateInvalidRetirementAge(testCaseName);
                    break;
                case 'currentAgeMaxVal':
                    await this.validateInvalidCurrentAge(testCaseName);
                    break;
                case 'retirementAgeMaxVal':
                    await this.validateInvalidRetirementAge(testCaseName);
                    break;
                default:
                    throw new Error('Invalid Test Case Name: ', testCaseName);
            }
        } catch (error) {
            logger.error("Error validating error messages:", error);
            throw error;

        }
    }

    /* Validate the error messages for current age */
    async validateInvalidCurrentAge(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        await utils.validateErrorMessage(this.invalidCurrentAge, data.errorMessage, 'Current Age');
    }

    /* Validate the error messages for retirement age */
    async validateInvalidRetirementAge(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        await utils.validateErrorMessage(this.invalidRetirementAge, data.errorMessage, 'Retirement Age');
    }

    /* Validate the error messages for current income */
    async validateInvalidCurrentIncome(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        await utils.validateErrorMessage(this.invalidCurrentIncome, data.errorMessage, 'Current Income');
    }

    /* Validate the error messages for current total savings */
    async validateInvalidCurrentTotalSavings(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        await utils.validateErrorMessage(this.invalidCurrentTotalSaving, data.errorMessage, 'Current Total Savings');
    }

    /* Validate the error messages for current annual savings */
    async validateInvalidCurrentAnnualSavings(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        await utils.validateErrorMessage(this.invalidCurrentAnnualSaving, data.errorMessage, 'Current Annual Savings');
    }

    /* Validate the error messages for savings increase rate */
    async validateInvalidSavingsIncreaseRate(testCaseName) {
       
        const data = await utils.fetchDataFromJson(testCaseName);
        await utils.validateErrorMessage(this.invalidSavingIncRate, data.errorMessage, 'Savings Increase Rate');
    }

    /* Validate the social security details */
    async validateSocialSecurityDetails(testCaseName) {
        try {
           
            const data = await utils.fetchDataFromJson(testCaseName);
            if (data.includeSocialSecurity === 'No') {
                await utils.assertElementsAreSelected([
                    { element: this.noIncludeSocialSecurity, shouldBeSelected: true, elementName: 'socialSecurityBenefits' }
                ]);
                logger.info('Social Security Benefits is not included');
            }
            else {
                await utils.assertElementsAreSelected([
                    { element: this.yesIncludeSocialSecurity, shouldBeSelected: true, elementName: 'socialSecurityBenefits' }
                ]);
                logger.info('Social Security Benefits is included');
                await utils.elementAction(this.maritalStatusFields, 'isDisplayed', null, 'Marital Status Fields');
                if (data.maritalStatus === 'Married') {
                    await utils.assertElementsAreSelected([
                        { element: this.maritalStatusMarried, shouldBeSelected: true, elementName: 'maritalStatus' }
                    ]);
                    logger.info('Marital Status: Married');
                }
                else {
                    await utils.assertElementsAreSelected([
                        { element: this.maritalStatusSingle, shouldBeSelected: true, elementName: 'maritalStatus' }
                    ]);
                    logger.info('Marital Status: Single');
                }
                await utils.assertElementsHaveValues([
                    { element: this.socialSecurityOverrideAmt, expectedValue: data.socialSecurityOverrideAmt, elementName: 'socialSecurityOverrideAmt' }
                ]);
                logger.info('Social Security Override Amount:', data.socialSecurityOverrideAmt);
            }
        } catch (error) {
            logger.error("Error validating social security details:", error);
            throw error;
        }
    }

    /* Validate the form is cleared */
    async validateFormCleared() {
        try {
            await browser.pause(5000);
            await utils.assertElementsHaveValues([
                { element: this.currentAge, expectedValue: '', elementName: 'currentAge' },
                { element: this.retirementAge, expectedValue: '', elementName: 'retirementAge' },
                { element: this.annualIncome, expectedValue: '', elementName: 'annualIncome' },
                { element: this.spouseIncome, expectedValue: '', elementName: 'spouseIncome' },
                { element: this.currentTotalSavings, expectedValue: '', elementName: 'currentTotalSavings' },
                { element: this.currentAnnualSavings, expectedValue: '', elementName: 'currentAnnualSavings' },
                { element: this.savingsIncreaseRate, expectedValue: '', elementName: 'savingsIncreaseRate' },
            ]);
            await utils.assertElementsAreSelected([
                { element: this.noIncludeSocialSecurity, shouldBeSelected: true, elementName: 'socialSecurityBenefits' }
            ]);
            logger.info('All fields are cleared');
        } catch (error) {
            logger.error("Error validating form cleared:", error);
            throw error;

        }
    }
}
export default new calculatePage();