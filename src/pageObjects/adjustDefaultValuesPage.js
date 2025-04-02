import utils from '../utils/utils';
import logger from '../utils/logger';

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


    /* Adjusting the default values */
    async fillDefaultValuesDetails(testCaseName) {
        try {
            await utils.elementAction(this.adjustDefaultValuesLink, 'click', null, 'Adjust default values link');
            await this.defaultValuesModal.waitForDisplayed({ timeout: 10000 });            
            const data = await utils.fetchDataFromJson(testCaseName);
            await utils.elementAction(this.additionalIncome, 'setValue', data.additionalIncome, 'Additional Income');
            await utils.elementAction(this.retirementDuration, 'setValue', data.retirementDuration, 'Retirement Duration');
            if (data.excludeInflation === 'yes') {
                await utils.elementAction(this.excludeInflation, 'click', null, 'Exclude Inflation');
            }
            else {
                await utils.elementAction(this.includeInflation, 'click', null, 'Include Inflation');
                await utils.elementAction(this.expectedInflationRate, 'setValue', data.expectedInflationRate, 'Expected Inflation Rate');
            }
            await utils.elementAction(this.retirementAnnualIncome, 'setValue', data.retirementAnnualIncome, 'Retirement Annual Income');
            await utils.elementAction(this.preRetirementReturn, 'setValue', data.preRetirementReturn, 'Pre Retirement Return');
            await utils.elementAction(this.postRetirementReturn, 'setValue', data.postRetirementReturn, 'Post Retirement Return');
            await this.saveChangesButton.click();
        } catch (error) {
            logger.error(`Error filling the default values: ${error}`);
            throw error;
        }

    }



}
export default new adjustDefaultValuesPage();