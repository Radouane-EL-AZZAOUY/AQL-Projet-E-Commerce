package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private final By emailInput = By.cssSelector("[data-testid='login-email'], #login-username");
    private final By passwordInput = By.cssSelector("[data-testid='login-password'], #login-password");
    private final By loginButton = By.cssSelector("[data-testid='login-submit'], button[type='submit']");
    private final By errorAlert = By.cssSelector(".alert.alert-error");

    public LoginPage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public LoginPage open() {
        openRoute("/login");
        findVisible(emailInput);
        return this;
    }

    public LoginPage typeEmail(String email) {
        type(emailInput, email);
        return this;
    }

    public LoginPage typePassword(String password) {
        type(passwordInput, password);
        return this;
    }

    public HomePage submitValid() {
        click(loginButton);
        return new HomePage(driver, config);
    }

    public LoginPage submitInvalid() {
        click(loginButton);
        return this;
    }

    public HomePage login(String email, String password) {
        return typeEmail(email)
                .typePassword(password)
                .submitValid();
    }

    // Backward-compatible alias for existing tests that pass username values.
    public HomePage loginAs(String username, String password) {
        return login(username, password);
    }

    public String getErrorMessage() {
        return findVisible(errorAlert).getText();
    }
}
