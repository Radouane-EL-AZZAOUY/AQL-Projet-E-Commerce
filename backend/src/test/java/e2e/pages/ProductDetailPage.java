package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProductDetailPage extends BasePage {

    private final By pageTitle = By.cssSelector("[data-testid='product-title'], h1");
    private final By quantityInput = By.cssSelector("[data-testid='product-qty'], #product-qty");
    private final By addToCartButton = By.cssSelector("[data-testid='add-to-cart']");
    private final By addToCartButtonFallback = By.xpath("//button[contains(@class,'btn-primary') and normalize-space()='Ajouter au panier']");
    private final By cartSuccessAlert = By.cssSelector(".alert.alert-success");

    public ProductDetailPage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public ProductDetailPage waitUntilLoaded() {
        waitForUrlOrHashContains("/products/");
        findVisible(pageTitle);
        return this;
    }

    public ProductDetailPage setQuantity(int quantity) {
        type(quantityInput, String.valueOf(Math.max(1, quantity)));
        return this;
    }

    public ProductDetailPage addToCart() {
        if (!driver.findElements(addToCartButton).isEmpty()) {
            click(addToCartButton);
        } else {
            click(addToCartButtonFallback);
        }
        // Do not assert on toast visibility: async fetch + React render is flaky in Selenium;
        // checkout flow asserts cart contents on the cart page instead.
        return this;
    }

    public ProductDetailPage addToCart(int quantity) {
        return setQuantity(quantity).addToCart();
    }

    public boolean hasAddToCartSuccessMessage() {
        waitForText(cartSuccessAlert, "Produit ajouté au panier.");
        return true;
    }
}
