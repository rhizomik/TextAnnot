Feature: Manage Tags
  In order to manage tags
  As an administrator
  I want to list, add, view, edit and delete them

  Scenario: List all tags
    Given I'm on the home page and logged out
    And I sign in as "admin" with password "password"
    When I click submenu option "Tag" in menu "Administration"
    Then I see 0 tags

