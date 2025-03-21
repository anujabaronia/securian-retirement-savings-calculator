Feature: Retirement Savings Calculator home

    Background: Launch page
        Given navigate to the calculator page
        When close the cookie banner
        Then validate home page details
            | homePageDetails | heading,infoBanner |

    Scenario Outline: Fill details and calculate retirement savings - Positive - <testCaseName>
        Given fill the age details with <testCaseName> <sheetName>
        And fill income-savings details <testCaseName> <sheetName>
        And select inclusion of social security income benefits <testCaseName> <sheetName>
        When I click on Calculate button
        Then I should see the retirement savings details
        Examples:
            | testCaseName                   | sheetName          |
            | verifyAllDetails               | calculate_positive |
            | verifyWithSocialSecurityYes    | calculate_positive |
            | verifyWtihMaritalStatusMarried | calculate_positive |


    Scenario Outline: Fill details and calculate retirement savings - Negative - <testCaseName>
        Given fill the age details with <testCaseName> <sheetName>
        And fill income-savings details <testCaseName> <sheetName>
        And select inclusion of social security income benefits <testCaseName> <sheetName>
        When I click on Calculate button
        Then validate the error messages for <testCaseName> <sheetName>
        Examples:
            | testCaseName           | sheetName          |
            | noCurrentAge           | calculate_negative |
            | noRetirementAge        | calculate_negative |
            | noCurrentIncome        | calculate_negative |
            | noCurrentTotalSavings  | calculate_negative |
            | noCurrentAnnualSavings | calculate_negative |
            | noSavingsIncreaseRate  | calculate_negative |
            | currAgeGrtThanRetAge   | calculate_negative |
            | currentAgeMaxVal       | calculate_negative |
            | retirementAgeMaxVal    | calculate_negative |

    Scenario Outline: Fill details and clear form
        Given fill the age details with <testCaseName> <sheetName>
        And fill income-savings details <testCaseName> <sheetName>
        And select inclusion of social security income benefits <testCaseName> <sheetName>
        When I click on Clear-Form button
        Then validate the form is cleared
        Examples:
            | testCaseName     | sheetName          |
            | verifyAllDetails | calculate_positive |

