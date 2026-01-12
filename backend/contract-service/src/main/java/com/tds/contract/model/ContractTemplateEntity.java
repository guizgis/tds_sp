package com.tds.contract.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contract_templates")
public class ContractTemplateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String templateName;
    
    @Column(columnDefinition = "TEXT")
    private String templateContent; // JSON string of standard strategy

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }
    public String getTemplateContent() { return templateContent; }
    public void setTemplateContent(String templateContent) { this.templateContent = templateContent; }
}