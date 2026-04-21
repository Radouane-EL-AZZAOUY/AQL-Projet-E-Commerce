package e2e.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public final class E2eConfig {

    private static final String DEFAULT_BASE_URL = "http://localhost:5173";
    private static final boolean DEFAULT_HEADLESS = true;
    private static final long DEFAULT_TIMEOUT_SECONDS = 10;
    private static final long DEFAULT_IMPLICIT_WAIT_SECONDS = 1;
    private static final int DEFAULT_WINDOW_WIDTH = 1920;
    private static final int DEFAULT_WINDOW_HEIGHT = 1080;

    private final String baseUrl;
    private final boolean headless;
    private final long timeoutSeconds;
    private final long implicitWaitSeconds;
    private final int windowWidth;
    private final int windowHeight;

    private E2eConfig(
            String baseUrl,
            boolean headless,
            long timeoutSeconds,
            long implicitWaitSeconds,
            int windowWidth,
            int windowHeight
    ) {
        this.baseUrl = trimTrailingSlash(baseUrl);
        this.headless = headless;
        this.timeoutSeconds = timeoutSeconds;
        this.implicitWaitSeconds = implicitWaitSeconds;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
    }

    public static E2eConfig load() {
        Properties fileProps = loadFileProperties();

        String baseUrl = readString("e2e.base-url", "E2E_BASE_URL", fileProps, DEFAULT_BASE_URL);
        boolean headless = readBoolean("e2e.headless", "E2E_HEADLESS", fileProps, DEFAULT_HEADLESS);
        long timeoutSeconds = readLong("e2e.timeout-seconds", "E2E_TIMEOUT_SECONDS", fileProps, DEFAULT_TIMEOUT_SECONDS);
        long implicitWaitSeconds = readLong(
                "e2e.implicit-wait-seconds",
                "E2E_IMPLICIT_WAIT_SECONDS",
                fileProps,
                DEFAULT_IMPLICIT_WAIT_SECONDS
        );
        int width = readInt("e2e.window-width", "E2E_WINDOW_WIDTH", fileProps, DEFAULT_WINDOW_WIDTH);
        int height = readInt("e2e.window-height", "E2E_WINDOW_HEIGHT", fileProps, DEFAULT_WINDOW_HEIGHT);

        return new E2eConfig(baseUrl, headless, timeoutSeconds, implicitWaitSeconds, width, height);
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public boolean isHeadless() {
        return headless;
    }

    public long getTimeoutSeconds() {
        return timeoutSeconds;
    }

    public long getImplicitWaitSeconds() {
        return implicitWaitSeconds;
    }

    public int getWindowWidth() {
        return windowWidth;
    }

    public int getWindowHeight() {
        return windowHeight;
    }

    private static Properties loadFileProperties() {
        Properties props = new Properties();
        try (InputStream input = E2eConfig.class.getClassLoader().getResourceAsStream("e2e.properties")) {
            if (input != null) {
                props.load(input);
            }
        } catch (IOException ignored) {
            // Keep defaults when no properties file is available.
        }
        return props;
    }

    private static String readString(String systemKey, String envKey, Properties fileProps, String defaultValue) {
        String value = System.getProperty(systemKey);
        if (isBlank(value)) {
            value = System.getenv(envKey);
        }
        if (isBlank(value)) {
            value = fileProps.getProperty(systemKey);
        }
        return isBlank(value) ? defaultValue : value.trim();
    }

    private static boolean readBoolean(String systemKey, String envKey, Properties fileProps, boolean defaultValue) {
        String value = readString(systemKey, envKey, fileProps, String.valueOf(defaultValue));
        return Boolean.parseBoolean(value);
    }

    private static long readLong(String systemKey, String envKey, Properties fileProps, long defaultValue) {
        String value = readString(systemKey, envKey, fileProps, String.valueOf(defaultValue));
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return defaultValue;
        }
    }

    private static int readInt(String systemKey, String envKey, Properties fileProps, int defaultValue) {
        String value = readString(systemKey, envKey, fileProps, String.valueOf(defaultValue));
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return defaultValue;
        }
    }

    private static String trimTrailingSlash(String input) {
        if (input.endsWith("/")) {
            return input.substring(0, input.length() - 1);
        }
        return input;
    }

    private static boolean isBlank(String input) {
        return input == null || input.trim().isEmpty();
    }
}
