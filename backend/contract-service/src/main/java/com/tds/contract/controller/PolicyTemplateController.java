package com.tds.contract.controller;

import com.tds.contract.model.PolicyTemplateEntity;
import com.tds.contract.repository.PolicyTemplateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/policy-templates")
public class PolicyTemplateController {

    private final PolicyTemplateRepository repository;

    public PolicyTemplateController(PolicyTemplateRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<PolicyTemplateEntity> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyTemplateEntity> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PolicyTemplateEntity create(@RequestBody PolicyTemplateEntity template) {
        return repository.save(template);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PolicyTemplateEntity> update(@PathVariable Long id, @RequestBody PolicyTemplateEntity template) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(template.getName());
                    existing.setDescription(template.getDescription());
                    existing.setPolicyConfig(template.getPolicyConfig());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
