Feature: Making adjustments to the default values to refine the retirement savings calculations

    Scenario Outline: Fill details, modify default values and calculate retirement savings - of - <testCaseName>
        Given user navigates to the retirement calculator page
        And user fills the required details for <testCaseName>
        And user modifies the default values <testCaseName>
        When user clicks on Calculate button
        Then user should see the retirement savings details
        Examples:
            | testCaseName         |
            | withExcludeInflation |
            | withIncludeInflation |
