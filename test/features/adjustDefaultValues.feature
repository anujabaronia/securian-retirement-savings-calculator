Feature: Retirement Savings Calculator home

    Scenario Outline: Fill details, adjust default values and calculate retirement savings - Positive - <testCaseName2>
        Given navigate to the calculator page
        And close the cookie banner
        And fill the required details for <testCaseName> <sheetName>
        And adjust the default values <testCaseName2> <sheetName2>
        When I click on Calculate button
        Then I should see the retirement savings details
        Examples:
            | testCaseName                | sheetName          | testCaseName2        | sheetName2          |
            | verifyAllDetails            | calculate_positive | withExcludeInflation | adjustDefaultValues |
            | verifyWithSocialSecurityYes | calculate_positive | withIncludeInflation | adjustDefaultValues |
