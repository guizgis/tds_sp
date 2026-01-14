package com.tds.contract.model;

public enum PolicyType {
    PERMISSION("permission"),
    PROHIBITION("prohibition"),
    OBLIGATION("obligation");

    private final String value;

    PolicyType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
