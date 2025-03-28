package com.kkovacstech.lagerverwaltung.model;

import jakarta.persistence.*;

@Entity
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String artikelnummer;
    private String beschreibung;
    private int menge;

    public Item() {
    }

    public Item(String name, String artikelnummer, String beschreibung, int menge) {
        this.name = name;
        this.artikelnummer = artikelnummer;
        this.beschreibung = beschreibung;
        this.menge = menge;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getArtikelnummer() {
        return artikelnummer;
    }

    public String getBeschreibung() {
        return beschreibung;
    }

    public int getMenge() {
        return menge;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setArtikelnummer(String artikelnummer) {
        this.artikelnummer = artikelnummer;
    }

    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }

    public void setMenge(int menge) {
        this.menge = menge;
    }

    @Column(nullable = false)
    private String lager;
   

    public String getLager() {
        return lager;
    }

    public void setLager(String lager) {
        this.lager = lager;
    }

}
