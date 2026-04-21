package e2e.config;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public final class WebDriverFactory {

    private WebDriverFactory() {
    }

    public static WebDriver createChromeDriver(E2eConfig config) {
        WebDriverManager.chromedriver().setup();

        boolean headless = resolveHeadlessMode(config);
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        if (headless) {
            options.addArguments("--headless=new");
            options.addArguments("--window-size=" + config.getWindowWidth() + "," + config.getWindowHeight());
        }

        WebDriver driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(config.getImplicitWaitSeconds()));

        if (!headless) {
            driver.manage().window().maximize();
        }

        return driver;
    }

    public static WebDriverWait createExplicitWait(WebDriver driver, E2eConfig config) {
        return new WebDriverWait(driver, Duration.ofSeconds(config.getTimeoutSeconds()));
    }

    private static boolean resolveHeadlessMode(E2eConfig config) {
        String override = System.getProperty("headless");
        if (override == null || override.isBlank()) {
            return config.isHeadless();
        }
        return Boolean.parseBoolean(override.trim());
    }
}
