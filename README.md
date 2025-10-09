# Purchase Data Entry and Reporting Portal

## Objective

Design and implement a web portal with three types of users who can perform different actions related to purchase data entry and report generation.

## User Roles & Permissions


| User | Username | Password | Permissions |
|---|---|---|---|
| User1 | `user1` | `pass1` | Can enter and edit data |
| User2 | `user2` | `pass2` | Can enter data only |
| User3 | `user3` | `pass3` | Can view reports only |

## Features to Implement

### Data Entry (for User1 and User2)

- **Fields to be entered:**
  - **Date**: Purchase date
  - **Product Name**: Dropdown list with fixed options (`product1`, `product2`, `product3`)
  - **Amount**: Numeric
  - **Count**: Numeric
  - **Company Name**: Text (with on-the-fly creation)
- **Editing**: Only `User1` can edit existing data entries.

### Reporting (for User3)

- **Monthly Report:**
  - **Input**: Month (e.g., `"2025-10"`)
  - **Output**: A list of all purchases made in that month with all details.
- **Company Report:**
  - **Input**: Company name (text)
  - **Output**: A list of all purchases made by that company.
