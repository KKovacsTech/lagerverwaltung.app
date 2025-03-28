package com.kkovacstech.lagerverwaltung.controller;

import com.kkovacstech.lagerverwaltung.model.Item;
import com.kkovacstech.lagerverwaltung.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    // 🔹 Összes termék lekérése
    @GetMapping
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    // 🔹 Új termék hozzáadása
    @PostMapping
    public Item createItem(@RequestBody Item item) {
        return itemRepository.save(item);
    }

    // 🔹 Termék frissítése (Bearbeiten)
    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody Item item) {
        Optional<Item> optionalItem = itemRepository.findById(id);
        if (optionalItem.isEmpty()) {
            throw new RuntimeException("Item mit ID " + id + " nicht gefunden.");
        }

        Item bestehendesItem = optionalItem.get();
        bestehendesItem.setName(item.getName());
        bestehendesItem.setArtikelnummer(item.getArtikelnummer());
        bestehendesItem.setBeschreibung(item.getBeschreibung());
        bestehendesItem.setMenge(item.getMenge());
        bestehendesItem.setLager(item.getLager()); // 🔁 fontos

        return itemRepository.save(bestehendesItem);
    }

    // 🔹 Termék törlése
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemRepository.deleteById(id);
    }

    // 🔹 Zugang: +1 mennyiség
    @PutMapping("/{id}/zugang")
    public void zugang(@PathVariable Long id) {
        Item item = itemRepository.findById(id).orElseThrow();
        item.setMenge(item.getMenge() + 1);
        itemRepository.save(item);
    }

    // 🔹 Abgang: -1 mennyiség
    @PutMapping("/{id}/abgang")
    public void abgang(@PathVariable Long id) {
        Item item = itemRepository.findById(id).orElseThrow();
        if (item.getMenge() > 0) {
            item.setMenge(item.getMenge() - 1);
            itemRepository.save(item);
        }
    }
}
