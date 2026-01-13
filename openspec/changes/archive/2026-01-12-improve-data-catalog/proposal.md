# Proposal: Improve Data Catalog Standards

## Goal
Refactor the Data Catalog module to strictly comply with **NDI-TR-2025-06** "Data Infrastructure - Data Catalog Description Requirements". This involves splitting the catalog into **Data Resources** and **Data Products**, enforcing standard metadata code tables, and implementing the standard identifier generation rule.

## Context
The current catalog implementation treats all items as generic "Catalogs". The new standard requires a clear distinction:
- **Data Resource**: Raw or semi-processed data (Table 2 sources).
- **Data Product**: Value-added data services or sets (Table 3 delivery modes).

Additionally, specific metadata fields (Topic, Industry, Update Frequency, etc.) must use the standardized domain codes (001, 002, etc.) defined in Tables 1-7 of the spec.

## Key Changes
1.  **Model Split**: Introduce `CatalogType` (Resource vs Product) and specialized metadata fields.
2.  **Standard Codes**: Implement validation and storage for all 7 standard code tables.
3.  **ID Generation**: Implement the `FrontCode/BackCode` identifier format (Section 8.1).
4.  **API & UI**: Update registration and management interfaces to reflect these standards.
