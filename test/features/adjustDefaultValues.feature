Feature: Retirement Savings Calculator home

    Background: Launch page
        Given navigate to the calculator page
        When close the cookie banner
        Then validate home page details
            | homePageDetails | heading,infoBanner |

    Scenario Outline: Fill details, adjust default values and calculate retirement savings - Positive - <testCaseName2>
        Given fill the age details with <testCaseName> <sheetName>
        And fill income-savings details <testCaseName> <sheetName>
        And select inclusion of social security income benefits <testCaseName> <sheetName>
        And adjust the default values <testCaseName2> <sheetName2>
        When I click on Calculate button
        Then I should see the retirement savings details
        Examples:
            | testCaseName                | sheetName          | testCaseName2        | sheetName2          |
            | verifyAllDetails            | calculate_positive | withExcludeInflation | adjustDefaultValues |
            | verifyWithSocialSecurityYes | calculate_positive | withIncludeInflation | adjustDefaultValues |
