package com.kkovacstech.lagerverwaltung.controller;

import com.kkovacstech.lagerverwaltung.model.Item;
import com.kkovacstech.lagerverwaltung.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistik")
@CrossOrigin
public class StatistikController {

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping
    public Map<String, Object> getStatistiken() {
        List<Item> items = itemRepository.findAll();

        int gesamtProdukte = items.size();
        int gesamtMenge = items.stream().mapToInt(Item::getMenge).sum();

        String topProdukt = items.stream()
                .max((a, b) -> Integer.compare(a.getMenge(), b.getMenge()))
                .map(Item::getName)
                .orElse("Keine Produkte");

        Map<String, Object> stats = new HashMap<>();
        stats.put("gesamtProdukte", gesamtProdukte);
        stats.put("gesamtMenge", gesamtMenge);
        stats.put("topProdukt", topProdukt);

        return stats;
    }
}

