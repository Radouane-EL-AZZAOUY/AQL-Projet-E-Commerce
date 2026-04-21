package e2e.utils;

import org.openqa.selenium.By;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.TimeoutException;

import java.time.Duration;
import java.util.function.Function;

public class WaitUtils {

    private static final int DEFAULT_RETRY_ATTEMPTS = 3;

    private final WebDriver driver;
    private final Duration timeout;
    private final int retryAttempts;

    public WaitUtils(WebDriver driver, Duration timeout) {
        this(driver, timeout, DEFAULT_RETRY_ATTEMPTS);
    }

    public WaitUtils(WebDriver driver, Duration timeout, int retryAttempts) {
        this.driver = driver;
        this.timeout = timeout;
        this.retryAttempts = Math.max(1, retryAttempts);
    }

    /**
     * Explicitly waits until element is visible and returns it.
     */
    public WebElement waitForElement(By locator) {
        return withRetry(wait -> wait.until(ExpectedConditions.visibilityOfElementLocated(locator)));
    }

    /**
     * Explicitly waits until element is clickable, then performs click.
     */
    public void waitForClick(By locator) {
        withRetry(wait -> {
            wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
            return true;
        });
    }

    /**
     * Explicitly waits until the given text appears inside the element.
     */
    public boolean waitForText(By locator, String value) {
        return withRetry(wait -> wait.until(ExpectedConditions.textToBePresentInElementLocated(locator, value)));
    }

    public WebElement visible(By locator) {
        return waitForElement(locator);
    }

    public WebElement clickable(By locator) {
        return withRetry(wait -> wait.until(ExpectedConditions.elementToBeClickable(locator)));
    }

    public WebElement present(By locator) {
        return withRetry(wait -> wait.until(ExpectedConditions.presenceOfElementLocated(locator)));
    }

    public boolean urlContains(String value) {
        return withRetry(wait -> wait.until(ExpectedConditions.urlContains(value)));
    }

    /**
     * HashRouter SPAs put routes in {@code window.location.hash} (e.g. {@code #/products/1}).
     * Some WebDriver implementations expose {@link WebDriver#getCurrentUrl()} without the fragment,
     * so {@link ExpectedConditions#urlContains(String)} never matches. This waits on both full URL
     * and {@code location.hash}.
     */
    public boolean urlOrHashContains(String substring) {
        return withRetry(wait -> wait.until(driver -> {
            String url = driver.getCurrentUrl();
            if (url != null && url.contains(substring)) {
                return true;
            }
            Object hashObj = ((JavascriptExecutor) driver).executeScript("return window.location.hash || '';");
            String hash = hashObj == null ? "" : hashObj.toString();
            return hash.contains(substring);
        }));
    }

    public boolean textPresent(By locator, String value) {
        return waitForText(locator, value);
    }

    /**
     * Waits until at least one element matches (e.g. cart table rows after async add).
     */
    public void untilElementsNonEmpty(By locator) {
        withRetry(w -> w.until(d -> !d.findElements(locator).isEmpty()));
    }

    private <T> T withRetry(Function<WebDriverWait, T> action) {
        RuntimeException lastError = null;
        for (int attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeout);
                wait.ignoring(NoSuchElementException.class)
                        .ignoring(StaleElementReferenceException.class)
                        .ignoring(ElementClickInterceptedException.class);
                return action.apply(wait);
            } catch (TimeoutException | NoSuchElementException | StaleElementReferenceException | ElementClickInterceptedException ex) {
                lastError = ex;
            }
        }
        throw lastError != null ? lastError : new TimeoutException("Timed out waiting for Selenium condition.");
    }
}
