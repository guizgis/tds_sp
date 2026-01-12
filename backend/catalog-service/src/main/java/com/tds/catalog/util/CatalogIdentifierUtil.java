package com.tds.catalog.util;

import java.util.Random;

/**
 * Utility for generating and validating Data Catalog Identifiers based on NDI-TR-2025-06 Section 8.1.
 * Format: FrontCode/BackCode
 */
public class CatalogIdentifierUtil {

    private static final String ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final Random RANDOM = new Random();

    /**
     * Generates a FrontCode: AreaCode (6 digits) + OrgCode
     */
    public static String generateFrontCode(String areaCode, String orgCode) {
        if (areaCode == null || areaCode.length() != 6) {
            throw new IllegalArgumentException("AreaCode must be 6 digits");
        }
        return areaCode + orgCode;
    }

    /**
     * Generates a BackCode: TypeID (1 char) + SerialNo (6 digits) + CheckCode (2 chars)
     */
    public static String generateBackCode(String typeId, long serialNo) {
        if (typeId == null || typeId.length() != 1) {
            throw new IllegalArgumentException("TypeID must be 1 character");
        }
        String serialStr = String.format("%06d", serialNo);
        String checkCode = generateCheckCode();
        return typeId + serialStr + checkCode;
    }

    /**
     * Generates a full identifier: FrontCode/BackCode
     */
    public static String generateIdentifier(String areaCode, String orgCode, String typeId, long serialNo) {
        return generateFrontCode(areaCode, orgCode) + "/" + generateBackCode(typeId, serialNo);
    }

    private static String generateCheckCode() {
        StringBuilder sb = new StringBuilder(2);
        for (int i = 0; i < 2; i++) {
            sb.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }
}
