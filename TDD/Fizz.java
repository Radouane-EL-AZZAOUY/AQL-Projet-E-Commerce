package tdd;

public class Fizz {

    public static String fizzBuzz(int n) {
        if (n % 3 == 0 && n % 5 == 0) {
            return "FizzBuzz";
        }
        if (n % 3 == 0) {
            return "Fizz";
        }
        if (n % 5 == 0) {
            return "Buzz";
        }
        return String.valueOf(n);
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            System.out.println(fizzBuzz(i));
        }
    }
}
