package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class HomePage extends BasePage {

    private final By homeTitle = By.cssSelector("[data-testid='home-title'], h1");
    private final By loggedInUser = By.cssSelector("[data-testid='nav-user'], .nav-user");

    public HomePage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public HomePage open() {
        openRoute("/");
        return this;
    }

    public boolean isLoaded() {
        String title = findVisible(homeTitle).getText();
        return title != null && title.contains("Bienvenue");
    }

    public String getLoggedInUser() {
        String text = findPresent(loggedInUser).getDomProperty("textContent");
        return text == null ? "" : text.trim();
    }
}
