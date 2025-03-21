import { browser } from '@wdio/globals'
import xlsx from 'xlsx';

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


    getTestData(testCaseName, sheetName) {
        const workbook = xlsx.readFile('./test/data/testData.xlsx');
        if (!workbook.Sheets[sheetName]) {
            throw new Error(`Sheet "${sheetName}" not found in the Excel file.`);
        }
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const testData = sheetData.find(row => row.testCaseName === testCaseName);

        return testData;
    }

    async fillAgeDetails(testCaseName, sheetName) {
        const data = this.getTestData(testCaseName, sheetName);
        await this.currentAge.click();
        await this.currentAge.setValue(data.currentAge);
        console.log('Current Age:', data.currentAge);

        await this.retirementAge.click();
        await this.retirementAge.setValue(data.retirementAge);
        console.log('Retirement Age:', data.retirementAge);

    }

    async fillIncomeDetails(testCaseName, sheetName) {
        const data = this.getTestData(testCaseName, sheetName);
        await this.annualIncome.click();
        await this.annualIncome.setValue(data.annualIncome);
        console.log('Annual Income:', data.annualIncome);

        await this.spouseIncome.click();
        await this.spouseIncome.setValue(data.spouseIncome);
        console.log('spouse-income:', data.spouseIncome);

        await this.currentTotalSavings.click();
        await this.currentTotalSavings.setValue(data.currentTotalSavings);
        console.log('current-total-savings:', data.currentTotalSavings);

        await this.currentAnnualSavings.click();
        await this.currentAnnualSavings.setValue(data.currentAnnualSavings);
        console.log('current-annual-savings:', data.currentAnnualSavings);

        await this.savingsIncreaseRate.click();
        await this.savingsIncreaseRate.setValue(data.savingsIncreaseRate);
        console.log('savings-increase-rate:', data.savingsIncreaseRate);        
    }

    async fillSocialSecurityDetails(testCaseName, sheetName) {
        const data = this.getTestData(testCaseName, sheetName);

        if (data.includeSocialSecurity === 'No') {

            await this.noIncludeSocialSecurity.click();
            console.log('IncludeSocialSecurity:', data.includeSocialSecurity);
        }
        else {
            await this.yesIncludeSocialSecurity.click();
            console.log('IncludeSocialSecurity:', data.includeSocialSecurity);
            await this.maritalStatusFields.waitForDisplayed({ timeout: 10000 });
            if (data.maritalStatus === 'Married') {
                await this.maritalStatusMarried.click();
            }
            else {
                await this.maritalStatusSingle.click();
            }
            console.log('Marital Status:', data.maritalStatus);

            await this.socialSecurityOverrideAmt.click();
            await this.socialSecurityOverrideAmt.setValue(data.socialSecurityOverrideAmt);
            console.log('Social Security Override Amount:', data.socialSecurityOverrideAmt);
        }

    }
    async clickButton(button) {
        switch (button) {
            case 'Calculate':
                await this.calculateButton.click();
                console.log('Clicked on Calculate Button');
                break;
            case 'Clear-Form':
                await this.clearFormButton.click();
                console.log('Clicked on Clear Form Button');
                break;           
            default:
                throw new Error(`Button "${button}" not recognized`);
        }
    }
    async validateResultSection() {
        await browser.pause(5000);
        const displayValue = await this.resultSection.getCSSProperty('display');
        if (displayValue.value === 'none') {
            console.log('Result Section is not displayed');
            throw new Error('Result Section is not displayed');
        } else {
            const isResultSectionDisplayed = await this.resultSection.isDisplayed();
            console.log('Result Section is displayed:', isResultSectionDisplayed);

            const isResultMessageDisplayed = await this.resultMessage.isDisplayed();
            console.log('Result Message is displayed:', isResultMessageDisplayed);

            const isResultChartDisplayed = await this.resultChart.isDisplayed();
            console.log('Result Chart is displayed:', isResultChartDisplayed);

            const isResultTableDisplayed = await this.resultTable.isDisplayed();
            console.log('Result Table is displayed:', isResultTableDisplayed);

            const isEmailResultBtnClickable = await this.emailResultBtn.isClickable();
            console.log('Email Result Button is clickable:', isEmailResultBtnClickable);

            const isEditInfoButtonClickable = await this.editInfoButton.isClickable();
            console.log('Edit Info Button is clickable:', isEditInfoButtonClickable);

            const isFullResultsButtonClickable = await this.fullResultsButton.isClickable();
            console.log('Full Results Button is clickable:', isFullResultsButtonClickable);
        }
    }
    async validateErrorMessages(testCaseName, sheetName) {
        switch (testCaseName) {
            case 'noCurrentAge':
                await this.validateInvalidCurrentAge(testCaseName, sheetName);
                break;
            case 'noRetirementAge':
                await this.validateInvalidRetirementAge(testCaseName, sheetName);
                break;
            case 'noCurrentIncome':
                await this.validateInvalidCurrentIncome(testCaseName, sheetName);
                break;
            case 'noCurrentTotalSavings':
                await this.validateInvalidCurrentTotalSavings(testCaseName, sheetName);
                break;
            case 'noCurrentAnnualSavings':
                await this.validateInvalidCurrentAnnualSavings(testCaseName, sheetName);
                break;
            case 'noSavingsIncreaseRate':
                await this.validateInvalidSavingsIncreaseRate(testCaseName, sheetName);
                break;
            case 'currAgeGrtThanRetAge':
                await this.validateInvalidRetirementAge(testCaseName, sheetName);
                break;
            case 'currentAgeMaxVal':
                await this.validateInvalidCurrentAge(testCaseName, sheetName);
                break;
            case 'retirementAgeMaxVal':
                await this.validateInvalidRetirementAge(testCaseName, sheetName);
                break;
            default:
                throw new Error('Invalid Test Case Name: ', testCaseName);
        }

    }

    async validateInvalidCurrentAge(testCaseName, sheetName) {
        await this.invalidCurrentAge.isDisplayed();
        const data = this.getTestData(testCaseName, sheetName);
        expect(await this.invalidCurrentAge).toHaveText(data.errorMessage);
        console.log('Invalid Current Age error message is displayed: ' + data.errorMessage);
    }
    async validateInvalidRetirementAge(testCaseName, sheetName) {
        await this.invalidRetirementAge.isDisplayed();
        const data = this.getTestData(testCaseName, sheetName);
        expect(await this.invalidRetirementAge).toHaveText(data.errorMessage);
        console.log('Invalid Retirement Age error message is displayed: ' + data.errorMessage);
    }
    async validateInvalidCurrentIncome(testCaseName, sheetName) {
        await this.invalidCurrentIncome.isDisplayed();
        const data = this.getTestData(testCaseName, sheetName);
        expect(await this.invalidCurrentIncome).toHaveText(data.errorMessage);
        console.log('Invalid Current Income error message is displayed: ' + data.errorMessage);
    }
    async validateInvalidCurrentTotalSavings(testCaseName, sheetName) {
        await this.invalidCurrentTotalSaving.waitForDisplayed({ timeout: 10000 });
        const data = this.getTestData(testCaseName, sheetName);
        expect(await this.invalidCurrentTotalSaving).toHaveText(data.errorMessage);
        console.log('Invalid Current Total Savings error message is displayed: ' + data.errorMessage);
    }
    async validateInvalidCurrentAnnualSavings(testCaseName, sheetName) {
        await this.invalidCurrentAnnualSaving.isDisplayed();
        const data = this.getTestData(testCaseName, sheetName);
        expect(await this.invalidCurrentAnnualSaving).toHaveText(data.errorMessage);
        console.log('Invalid Current Annual Savings error message is displayed: ' + data.errorMessage);
    }
    async validateInvalidSavingsIncreaseRate(testCaseName, sheetName) {
        await this.invalidSavingIncRate.isDisplayed();
        const data = this.getTestData(testCaseName, sheetName);
        expect(await this.invalidSavingIncRate).toHaveText(data.errorMessage);
        console.log('Invalid Savings Increase Rate error message is displayed: ' + data.errorMessage);
    }
    async validateFormCleared() {       
        expect(await this.currentAge).toHaveValue('');
        expect(await this.retirementAge).toHaveValue('');
        expect(await this.annualIncome).toHaveValue('');
        expect(await this.spouseIncome).toHaveValue('');
        expect(await this.currentTotalSavings).toHaveValue('');
        expect(await this.currentAnnualSavings).toHaveValue('');
        expect(await this.savingsIncreaseRate).toHaveValue('');
        expect(await this.noIncludeSocialSecurity).toBeSelected();
        console.log('All fields are cleared');
    }
}
export default new calculatePage();