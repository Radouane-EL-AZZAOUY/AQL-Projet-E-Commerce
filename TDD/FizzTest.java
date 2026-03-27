package tdd;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class FizzTest {

    @Test
    void returnsNumberWhenNotMultipleOf3Or5() {
        assertEquals("1", Fizz.fizzBuzz(1));
        assertEquals("2", Fizz.fizzBuzz(2));
        assertEquals("4", Fizz.fizzBuzz(4));
    }

    @Test
    void returnsFizzForMultiplesOf3Only() {
        assertEquals("Fizz", Fizz.fizzBuzz(3));
        assertEquals("Fizz", Fizz.fizzBuzz(6));
        assertEquals("Fizz", Fizz.fizzBuzz(9));
    }

    @Test
    void returnsBuzzForMultiplesOf5Only() {
        assertEquals("Buzz", Fizz.fizzBuzz(5));
        assertEquals("Buzz", Fizz.fizzBuzz(10));
    }

    @Test
    void returnsFizzBuzzForMultiplesOf3And5() {
        assertEquals("FizzBuzz", Fizz.fizzBuzz(15));
        assertEquals("FizzBuzz", Fizz.fizzBuzz(30));
    }
}
