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
            await this.closeCookiesPopUp();
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
}
export default new launchPage();