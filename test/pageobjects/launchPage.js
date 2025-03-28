import { browser } from '@wdio/globals'
import utils from '../utils/utils';
import logger from '../utils/logger';

class launchPage {

    get acceptCookiesButton() { return $('//*[@id="onetrust-close-btn-container"]/button') };
    get heading() { return $('//*[@id="calculator-intro-section"]/h2') };
    get infoBanner() { return $('//*[@id="assumption-label"]') };

    /* Launch the application */
    async launch() {
        try {
            await browser.reloadSession();
            await browser.url(process.env.BASE_URL);
            await browser.maximizeWindow();
        } catch (error) {
            logger.error(`Error launching the application: ${error}`);
            throw error;
        }
    }

    /* Close the cookies pop up */
    async closeCookiesPopUp() {
        try {
            await utils.elementAction(this.acceptCookiesButton, 'click', null, 'Accept Cookies Button');
        } catch (error) {
            logger.error(`Error closing the cookies pop up: ${error}`);
            throw error;
        }
    }

    /* Validate the home page heading and info banner */
    async validateHomePageDetails(details) {
        try {
            const data = utils.fetchDataFromJson('./test/data/testData-heading.json', details[0]);
            const searchValues = details[1].split(',');
            if (searchValues.includes('heading')) {
                logger.info(`Expected heading: ${data.heading}`);
                await utils.assertElementsHaveValues([
                    { element: this.heading, expectedValue: data.heading, elementName: 'heading' }
                ]);
            }
            if (searchValues.includes('infoBanner')) {
                logger.info(`Expected infoBanner: ${data.infoBanner}`);
                await utils.assertElementsHaveValues([
                    { element: this.infoBanner, expectedValue: data.infoBanner, elementName: 'infoBanner' }
                ]);
            }
        } catch (error) {
            logger.error(`Error validating the home page details: ${error}`);
            throw error;
        }

    }
}
export default new launchPage();