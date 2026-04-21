package e2e.tests;

import e2e.config.E2eConfig;
import e2e.config.WebDriverFactory;
import e2e.pages.HomePage;
import e2e.pages.LoginPage;
import e2e.utils.AuthSession;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInfo;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.HttpURLConnection;
import java.net.URL;

public abstract class BaseTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(BaseTest.class);

    protected WebDriver driver;
    protected WebDriverWait explicitWait;
    protected E2eConfig config;

    @BeforeEach
    void setUpDriver(TestInfo testInfo) {
        LOGGER.info("Starting Selenium test: {}", testInfo.getDisplayName());
        config = E2eConfig.load();
        LOGGER.info(
                "WebDriver config -> baseUrl={}, headless={}, implicitWait={}s, explicitWait={}s",
                config.getBaseUrl(),
                resolveHeadlessFlag(),
                config.getImplicitWaitSeconds(),
                config.getTimeoutSeconds()
        );

        driver = WebDriverFactory.createChromeDriver(config);
        explicitWait = WebDriverFactory.createExplicitWait(driver, config);

        resetBrowserState();
        LOGGER.info("WebDriver initialized for {}", testInfo.getDisplayName());
    }

    @AfterEach
    void tearDownDriver(TestInfo testInfo) {
        if (driver != null) {
            LOGGER.info("Closing WebDriver for {}", testInfo.getDisplayName());
            driver.quit();
        }
        driver = null;
        explicitWait = null;
        LOGGER.info("Finished Selenium test: {}", testInfo.getDisplayName());
    }

    /**
     * Option 1 (preferred): authenticate through the real UI flow.
     * Use this when frontend and backend are both available in test environment.
     */
    protected HomePage loginViaUi(String email, String password) {
        LOGGER.info("Authenticating via UI for user '{}'", email);
        return new LoginPage(driver, config)
                .open()
                .login(email, password);
    }

    /**
     * Option 2: inject auth values directly in localStorage, then reload page.
     * Useful for fast and deterministic route-guard tests.
     */
    protected HomePage loginViaLocalStorage(AuthSession session) {
        LOGGER.info(
                "Authenticating via localStorage for user '{}', role '{}'",
                session.username(),
                session.role()
        );
        setAuthInLocalStorage(session);
        driver.navigate().refresh();
        return new HomePage(driver, config);
    }

    /**
     * Backward-compatible alias used by existing tests.
     */
    protected void seedSession(AuthSession session) {
        loginViaLocalStorage(session);
    }

    protected void setAuthInLocalStorage(AuthSession session) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript(
                "window.localStorage.setItem('token', arguments[0]);" +
                        "window.localStorage.setItem('user', JSON.stringify({" +
                        "username: arguments[1], role: arguments[2], userId: arguments[3]" +
                        "}));",
                session.token(),
                session.username(),
                session.role(),
                session.userId()
        );
    }

    protected String getLocalStorageItem(String key) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Object value = js.executeScript("return window.localStorage.getItem(arguments[0]);", key);
        return value == null ? null : value.toString();
    }

    protected String getJwtTokenFromStorage() {
        return getLocalStorageItem("token");
    }

    protected String waitForJwtToken() {
        return explicitWait.until(driver -> {
            String token = getJwtTokenFromStorage();
            return (token == null || token.isBlank()) ? null : token;
        });
    }

    protected void reloadCurrentPage() {
        driver.navigate().refresh();
    }

    protected void requireBackendAvailable() {
        boolean available = isHttpOk(config.getBaseUrl().replace("5173", "8081") + "/api/v3/api-docs");
        Assumptions.assumeTrue(
                available,
                "Backend API is not reachable on http://localhost:8081/api. Start backend before running Selenium E2E."
        );
    }

    protected WebDriver getDriver() {
        return driver;
    }

    protected WebDriverWait getExplicitWait() {
        return explicitWait;
    }

    protected E2eConfig getConfig() {
        return config;
    }

    private void resetBrowserState() {
        // Reset browser state between test methods for deterministic E2E runs.
        driver.get(config.getBaseUrl());
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("window.localStorage.clear();");
        js.executeScript("window.sessionStorage.clear();");
        driver.navigate().refresh();
    }

    private boolean resolveHeadlessFlag() {
        String override = System.getProperty("headless");
        return (override == null || override.isBlank())
                ? config.isHeadless()
                : Boolean.parseBoolean(override.trim());
    }

    private boolean isHttpOk(String url) {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(3000);
            connection.setReadTimeout(3000);
            int code = connection.getResponseCode();
            return code >= 200 && code < 400;
        } catch (Exception ignored) {
            return false;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }
}
