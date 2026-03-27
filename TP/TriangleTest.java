package org.example;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TriangleTest {

    @Test
    void pasUnTriangleCases() {
        assertEquals(Triangle.TypeTriangle.PAS_UN_TRIANGLE, Triangle.classifier(10, 3, 4));
        assertEquals(Triangle.TypeTriangle.PAS_UN_TRIANGLE, Triangle.classifier(7, 3, 4));
        assertEquals(Triangle.TypeTriangle.PAS_UN_TRIANGLE, Triangle.classifier(0, 5, 5));
        assertEquals(Triangle.TypeTriangle.PAS_UN_TRIANGLE, Triangle.classifier(-1, 5, 5));
    }

    @Test
    void equilateralCases() {
        assertEquals(Triangle.TypeTriangle.EQUILATERAL, Triangle.classifier(5, 5, 5));
        assertEquals(Triangle.TypeTriangle.EQUILATERAL, Triangle.classifier(1, 1, 1));
    }

    @Test
    void isoscelesCases() {
        assertEquals(Triangle.TypeTriangle.ISOCELE, Triangle.classifier(5, 5, 3));
        assertEquals(Triangle.TypeTriangle.ISOCELE, Triangle.classifier(3, 5, 5));
        assertEquals(Triangle.TypeTriangle.ISOCELE, Triangle.classifier(5, 3, 5));
    }

    @Test
    void scaleneCases() {
        assertEquals(Triangle.TypeTriangle.SCALENE, Triangle.classifier(3, 4, 5));
        assertEquals(Triangle.TypeTriangle.SCALENE, Triangle.classifier(100, 200, 250));
        assertEquals(Triangle.TypeTriangle.SCALENE, Triangle.classifier(3, 4, 6));
    }
}
