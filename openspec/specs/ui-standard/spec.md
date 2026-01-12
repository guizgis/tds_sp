# UI/UX Standard Specification

## Overview
This specification defines the visual and interactive standards for the Trusted Data Space Service Platform (TDS-SP). All modules SHALL adhere to these rules to ensure an enterprise-grade, secure, and consistent user experience.

## 1. Visual Identity (Theme)

### Requirement: Standard Color Palette
The system SHALL use a "Trust Blue" primary color scheme to convey security and authority.
- **Primary Color**: `#0050b3` (Deep Blue)
- **Success Color**: `#52c41a` (Green)
- **Warning Color**: `#faad14` (Orange)
- **Error Color**: `#f5222d` (Red)

#### Scenario: Apply theme
- **WHEN** the application loads
- **THEN** it MUST use the Deep Blue theme for primary actions, selections, and progress indicators.

### Requirement: Typography and Spacing
The system SHALL use standardized fonts and spacing to ensure readability.
- **Font**: Inter or system default sans-serif.
- **Border Radius**: Consistent `6px` for all components.
- **Grid Gaps**: Standardized `16px` or `24px` for layouts.

## 2. Layout Structure

### Requirement: Standard Page Layout
Every module page SHALL use a consistent layout structure consisting of a Sidebar, Header, PageContainer, and Footer.

#### Scenario: Page Navigation
- **WHEN** a user navigates between modules
- **THEN** the sidebar selection MUST persist, and the `PageContainer` MUST provide consistent breadcrumbs and title area.

## 3. Standardized Components

### Requirement: High-level Table Pattern (ProTable)
Data listings SHALL use the `ProTable` component to provide standardized search, filtering, and operation capabilities.

#### Scenario: Table Interaction
- **WHEN** a table is rendered
- **THEN** it MUST include standard toolbars (search, reload, density settings).

### Requirement: High-level Form Pattern (ProForm)
Form-based interactions SHALL use `ProForm` or `StepsForm` for complex inputs, ensuring consistent validation and layout.

#### Scenario: Submit Form
- **WHEN** a user fills out a registration form
- **THEN** the system MUST provide real-time validation feedback and a standardized success message after submission.

## 4. Interaction Patterns

### Requirement: State Encoding
The system SHALL use consistent color and status coding for business entities.
- **PENDING**: Processing / Orange
- **ACTIVE / SUCCESS**: Success / Green
- **CANCELLED / REJECTED**: Error / Red

#### Scenario: Display Status
- **WHEN** a resource status is displayed
- **THEN** it MUST use the corresponding `Badge` or `Tag` color defined in this standard.
