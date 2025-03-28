package com.kkovacstech.lagerverwaltung.model;

import jakarta.persistence.*;

@Entity
@Table(name = "`user`")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String benutzername;
    private String passwort;
    private String rolle; // "admin" oder "user"

    // Getter & Setter
    public Long getId() { return id; }
    public String getBenutzername() { return benutzername; }
    public void setBenutzername(String benutzername) { this.benutzername = benutzername; }

    public String getPasswort() { return passwort; }
    public void setPasswort(String passwort) { this.passwort = passwort; }

    public String getRolle() { return rolle; }
    public void setRolle(String rolle) { this.rolle = rolle; }
}
