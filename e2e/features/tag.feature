Feature: Manage Tags
  In order to manage tags
  As an administrator
  I want to list, add, view, edit and delete them

  Scenario: List all tags
    Given I'm on the home page and logged out
    And I sign in as "admin" with password "password"
    When I click submenu option "Tag" in menu "Administration"
    Then I see 0 tags


  Scenario: Create
    Given I'm on the home page and logged out
    And I sign in as "admin" with password "password"
    When I click submenu option "Tag Hierarchy" in menu "Administration"
    And I create a tag hierarchy with name "th"
    And I click the submit button
    And I click submenu option "Tag" in menu "Administration"
    And I create a tag with name "([^"]*)" and tag hierarchy "([^"]*)" and parent "([^"]*)"
    Then I see 1 tag
    And a tag with name "name" is present


  Scenario: Delete tag
    Given I'm on the home page and logged out
    And I sign in as "admin" with password "password"
    When I click submenu option "Tag" in menu "Administration"
    And I delete the tag with name "name"
    And I confirm the deletion
    Then I see 0 tags
