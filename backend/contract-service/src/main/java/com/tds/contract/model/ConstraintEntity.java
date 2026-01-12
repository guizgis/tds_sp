package com.tds.contract.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contract_constraints")
public class ConstraintEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String constraintName;
    private String constraintOperator; // 01-12
    private String constraintValue;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getConstraintName() { return constraintName; }
    public void setConstraintName(String constraintName) { this.constraintName = constraintName; }
    public String getConstraintOperator() { return constraintOperator; }
    public void setConstraintOperator(String constraintOperator) { this.constraintOperator = constraintOperator; }
    public String getConstraintValue() { return constraintValue; }
    public void setConstraintValue(String constraintValue) { this.constraintValue = constraintValue; }
}