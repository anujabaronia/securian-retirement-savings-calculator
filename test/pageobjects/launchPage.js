import { browser } from '@wdio/globals'
import searchData from '../data/testData-heading.json';

class launchPage {

    get acceptCookiesButton() { return $('//*[@id="onetrust-close-btn-container"]/button') };
    get heading() { return $('//*[@id="calculator-intro-section"]/h2') };
    get infoBanner() { return $('//*[@id="assumption-label"]') };    

    async launch() {
        await browser.reloadSession();
        await browser.url(process.env.BASE_URL);
        await browser.maximizeWindow();
    }

    async closeCookiesPopUp() {
        await this.acceptCookiesButton.click();
    }

    async validateHomePageDetails(details) {              
        const data = searchData[details[0]];
        const searchValues = details[1].split(',');
        if (searchValues.includes('heading')) {
            console.log(`Expected heading: ${data.heading}`);
            expect(await this.heading).toHaveText(data.heading);
        }
        if (searchValues.includes('infoBanner')) {
            console.log(`Expected infoBanner: ${data.infoBanner}`);
            expect(await this.infoBanner).toHaveText(data.infoBanner);
        }
    }  
}
export default new launchPage();