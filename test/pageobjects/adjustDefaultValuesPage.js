import { browser } from '@wdio/globals'
import xlsx from 'xlsx';

class adjustDefaultValuesPage {

    get adjustDefaultValuesLink() { return $('//a[contains(text(), "Adjust default values")]') };
    get defaultValuesModal() { return $('//*[@id="default-values-modal"]') };
    get additionalIncome() { return $('//*[@id="additional-income"]') };
    get retirementDuration() { return $('//*[@id="retirement-duration"]') };
    get includeInflation() { return $('//label[@for="include-inflation"]') };
    get excludeInflation() { return $('//label[@for="exclude-inflation"]') };
    get expectedInflationRate() { return $('//*[@id="expected-inflation-rate"]') };
    get retirementAnnualIncome() { return $('//*[@id="retirement-annual-income"]') };
    get preRetirementReturn() { return $('//*[@id="pre-retirement-roi"]') };
    get postRetirementReturn() { return $('//*[@id="post-retirement-roi"]') };
    get saveChangesButton() { return $('//*[@onclick="savePersonalizedValues();"]') };

    getTestData(testCaseName, sheetName) {
        const workbook = xlsx.readFile('./test/data/testData.xlsx');
        if (!workbook.Sheets[sheetName]) {
            throw new Error(`Sheet "${sheetName}" not found in the Excel file.`);
        }
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const testData = sheetData.find(row => row.testCaseName === testCaseName);

        return testData;
    }

    async fillDefaultValuesDetails(testCaseName, sheetName) {
        await this.adjustDefaultValuesLink.click();
        await this.defaultValuesModal.waitForDisplayed({ timeout: 10000 });
        const testData = this.getTestData(testCaseName, sheetName);
        await this.additionalIncome.click();
        await this.additionalIncome.setValue(testData.additionalIncome);
        await this.retirementDuration.setValue(testData.retirementDuration);
        if (testData.excludeInflation === 'yes' && testData.includeInflation === 'no') {
            await this.excludeInflation.click();
        }
        else {
            await this.includeInflation.click();
            await this.expectedInflationRate.setValue(testData.expectedInflationRate);
        }

        await this.retirementAnnualIncome.setValue(testData.retirementAnnualIncome);
        await this.preRetirementReturn.setValue(testData.preRetirementReturn);
        await this.postRetirementReturn.setValue(testData.postRetirementReturn);
        await this.saveChangesButton.click();
    }



}
export default new adjustDefaultValuesPage();