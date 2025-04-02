import logger from './logger';
import fs from 'fs';
import path from 'path';

class utilsClass {

    /* To Fetch Data from JSON */
    fetchDataFromJson(key) {
        try {
            const filePath = ('./src/testData/testData.json');
            const absolutePath = path.resolve(filePath);
            if (!fs.existsSync(absolutePath)) {
                throw new Error(`JSON file not found at path: ${absolutePath}`);
            }

            const jsonData = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
            if (key) {
                if (!jsonData[key]) {
                    throw new Error(`Key "${key}" not found in JSON file: ${absolutePath}`);
                }
                return jsonData[key];
            }
            return jsonData;
        } catch (error) {
            logger.error(`Error fetching data from JSON file: ${error.message}`);
            throw error;
        }
    }

    /* All the element actions like - displayed, click, setvalue)*/
    async elementAction(element, action, value = null, elementName = null) {
        try {
            const resolvedElement = await element;
            switch (action) {
                case 'click':
                    await resolvedElement.waitForClickable({ timeout: 6000 });
                    await resolvedElement.click();
                    logger.info(`Clicked on element: ${elementName}`);
                    break;
                case 'setValue':
                    await resolvedElement.waitForClickable({ timeout: 6000 });
                    await resolvedElement.click();
                    await resolvedElement.setValue(value);
                    logger.info(`Set value "${value}" on element: ${elementName}`);
                    break;
                case 'getText':
                    await resolvedElement.waitForDisplayed({ timeout: 6000 });
                    const text = await resolvedElement.getText();
                    logger.info(`Text of element "${elementName}" is: ${text}`);
                    return text;
                case 'isDisplayed':
                    const isDisplayed = await resolvedElement.isDisplayed();
                    logger.info(`Element "${elementName}" is displayed: ${isDisplayed}`);
                    return isDisplayed;
                case 'isClickable':
                    const isClickable = await resolvedElement.isClickable();
                    logger.info(`Element "${elementName}" is clickable: ${isClickable}`);
                    return isClickable;
                default:
                    throw new Error(`Unsupported action: ${action}`);
            }

        } catch (error) {
            logger.error(`Error performing action "${action}" on element "${elementName}":`, error);
            throw error;
        }
    }

    /* Validate error messages for elements */
    async validateErrorMessage(element, expectedMessage, elementName) {
        try {
            await element.waitForDisplayed({ timeout: 6000 });
            const actualMessage = await element.getText();
            logger.info(`Validating error message for "${elementName}". Expected: "${expectedMessage}", Actual: "${actualMessage}"`);
            if (actualMessage !== expectedMessage) {
                throw new Error(`Validation failed for "${elementName}". Expected: "${expectedMessage}", but got: "${actualMessage}"`);
            }
            logger.info(`Error message validation passed for "${elementName}".`);
        } catch (error) {
            logger.error(`Error validating message for "${elementName}":`, error);
            throw error;
        }
    }

    /* Validate the expected and actual values */
    async assertElementsHaveValues(elementsWithValues) {
        try {
            for (const { element, expectedValue, elementName } of elementsWithValues) {
                const tagName = await element.getTagName();
                let actualValue;

                if (["input", "textarea", "select"].includes(tagName)) {
                    actualValue = await element.getValue();
                    actualValue = actualValue.replace(/[$,]/g, "");
                    if (!isNaN(expectedValue) && actualValue !== "") {
                        actualValue = Number(actualValue);
                    }

                    await expect(actualValue).toEqual(expectedValue);
                    logger.info(`${elementName} has expected value: ${expectedValue}`);
                } else {
                    actualValue = await element.getText();
                    await expect(actualValue).toEqual(expectedValue);
                    logger.info(`${elementName} has expected text: ${expectedValue}`);
                }
            }
        } catch (error) {
            logger.error(`Error in assertElementsHaveValues: ${error.message}`);
            throw error;
        }
    }

    async assertElementsAreSelected(elementsWithSelection) {
        try {
            for (const { element, shouldBeSelected, elementName } of elementsWithSelection) {
                let inputElement;

                const tagName = await element.getTagName();
                if (tagName === 'label') {
                    const forAttribute = await element.getAttribute('for');
                    if (forAttribute) {
                        inputElement = await $(`#${forAttribute}`); 
                    } else {
                        inputElement = await element.$('input'); 
                    }
                } else {
                    inputElement = element; 
                }

                if (!inputElement || !(await inputElement.isExisting())) {
                    throw new Error(`No associated <input> found for label ${elementName}.`);
                }

                if (!(await inputElement.isDisplayed())) {
                    logger.info(`Clicking label ${elementName} to trigger selection.`);
                    await element.click(); 
                }

                if (shouldBeSelected) {
                    await expect(await inputElement).toBeSelected();
                    logger.info(`${elementName} is selected as expected.`);
                } else {
                    await expect(await inputElement).not.toBeSelected();
                    logger.info(`${elementName} is NOT selected as expected.`);
                }
            }
        } catch (error) {
            logger.error(`Error in assertElementsAreSelected: ${error.message}`);
            throw error;
        }
    }
}
export default new utilsClass();