package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class CatalogPage extends BasePage {

    private final By pageTitle = By.cssSelector("[data-testid='catalog-title'], h1.page-title");
    private final By searchInput = By.cssSelector("[data-testid='catalog-search'], input[aria-label='Rechercher un produit']");
    private final By resultsCount = By.cssSelector(".catalog-count");
    private final By productCards = By.cssSelector(".product-grid .product-card");
    private final By productNames = By.cssSelector(".product-grid .product-name");
    private final By productGrid = By.cssSelector(".product-grid");
    private final By firstProductLink = By.cssSelector(".product-grid .product-card a.btn.btn-primary[href*='/products/']");

    public CatalogPage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public CatalogPage open() {
        openRoute("/catalog");
        return this;
    }

    public CatalogPage waitUntilLoaded() {
        findVisible(pageTitle);
        waitForText(pageTitle, "Catalogue");
        return this;
    }

    public boolean hasProducts() {
        return !driver.findElements(productCards).isEmpty();
    }

    public CatalogPage waitForProducts() {
        findPresent(productCards);
        return this;
    }

    public CatalogPage searchFor(String query) {
        type(searchInput, query);
        return this;
    }

    public CatalogPage waitForSearchResults() {
        findVisible(resultsCount);
        findPresent(productGrid);
        return this;
    }

    public boolean hasProductNamed(String productName) {
        try {
            waitForText(productGrid, productName);
            List<String> names = driver.findElements(productNames).stream()
                    .map(e -> e.getText().trim())
                    .toList();
            return names.stream().anyMatch(n -> n.equalsIgnoreCase(productName));
        } catch (TimeoutException ignored) {
            return false;
        }
    }

    public ProductDetailPage openFirstProduct() {
        WebElement firstLink = findVisible(firstProductLink);
        String href = firstLink.getDomAttribute("href");
        if (href != null && !href.isBlank()) {
            if (href.startsWith("http://") || href.startsWith("https://")) {
                driver.get(href);
            } else if (href.startsWith("#")) {
                driver.get(config.getBaseUrl() + "/" + href);
            } else {
                firstLink.click();
            }
        } else {
            firstLink.click();
        }
        return new ProductDetailPage(driver, config).waitUntilLoaded();
    }
}
