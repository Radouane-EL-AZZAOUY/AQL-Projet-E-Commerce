package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;

public class AdminProductsPage extends BasePage {

    public record NewProductData(String name, String description, String imageUrl, String price, String stock) {
    }

    private final By pageTitle = By.cssSelector("[data-testid='admin-products-title'], h1.page-title");
    private final By createButton = By.xpath("//button[normalize-space()='Nouveau produit']");
    private final By modalTitle = By.cssSelector(".modal .modal-title");
    private final By nameInput = By.cssSelector("[data-testid='product-name'], #product-name");
    private final By descriptionInput = By.cssSelector("[data-testid='product-desc'], #product-desc");
    private final By imageInput = By.cssSelector("[data-testid='product-image'], #product-image");
    private final By priceInput = By.cssSelector("[data-testid='product-price'], #product-price");
    private final By stockInput = By.cssSelector("[data-testid='product-stock'], #product-stock");
    private final By saveButton = By.xpath("//div[contains(@class,'modal')]//button[normalize-space()='Enregistrer']");
    private final By successAlert = By.cssSelector(".alert.alert-success");
    private final By tableRows = By.cssSelector("table.table tbody tr");

    public AdminProductsPage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public AdminProductsPage open() {
        openRoute("/admin/products");
        return this;
    }

    public AdminProductsPage waitUntilLoaded() {
        findVisible(pageTitle);
        waitForText(pageTitle, "Admin — Produits");
        return this;
    }

    public AdminProductsPage createProduct(NewProductData product) {
        click(createButton);
        findVisible(modalTitle);
        waitForText(modalTitle, "Nouveau produit");

        type(nameInput, product.name());
        type(descriptionInput, product.description());
        type(imageInput, product.imageUrl());
        type(priceInput, product.price());
        type(stockInput, product.stock());
        click(saveButton);

        findVisible(successAlert);
        waitForText(successAlert, "Produit créé.");
        return this;
    }

    public boolean hasProductInTable(String productName) {
        try {
            findPresent(tableRows);
            By nameInTable = By.xpath("//table//tbody//tr//td//strong[normalize-space()=\"" + productName + "\"]");
            findPresent(nameInTable);
            return true;
        } catch (TimeoutException ignored) {
            return false;
        }
    }
}
