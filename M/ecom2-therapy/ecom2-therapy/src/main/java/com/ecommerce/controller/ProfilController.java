package com.ecommerce.controller;
import com.ecommerce.service.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller @RequestMapping("/profil")
public class ProfilController {
    private final UtilisateurService utilisateurService;
    public ProfilController(UtilisateurService u) { this.utilisateurService = u; }

    @GetMapping
    public String profil(Authentication auth, Model model) {
        model.addAttribute("utilisateur", utilisateurService.trouverParEmail(auth.getName()));
        return "profil/profil";
    }

    @PostMapping("/modifier")
    public String modifier(@RequestParam String nom, @RequestParam String prenom,
                           @RequestParam(required=false) String telephone,
                           @RequestParam(required=false) String adresse,
                           Authentication auth, RedirectAttributes ra) {
        var u = utilisateurService.trouverParEmail(auth.getName());
        utilisateurService.mettreAJourProfil(u.getId(), nom, prenom, telephone, adresse);
        ra.addFlashAttribute("success", "Profil mis à jour !");
        return "redirect:/profil";
    }
}
