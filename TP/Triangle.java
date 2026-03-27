package org.example;

public class Triangle {

    public enum TypeTriangle {
        PAS_UN_TRIANGLE,
        SCALENE,
        ISOCELE,
        EQUILATERAL
    }

    public static TypeTriangle classifier(int a, int b, int c) {
        if (a <= 0 || b <= 0 || c <= 0) {
            return TypeTriangle.PAS_UN_TRIANGLE;
        }
        if (a + b <= c || a + c <= b || b + c <= a) {
            return TypeTriangle.PAS_UN_TRIANGLE;
        }
        if (a == b && b == c) {
            return TypeTriangle.EQUILATERAL;
        } else if (a == b || b == c || a == c) {
            return TypeTriangle.ISOCELE;
        } else {
            return TypeTriangle.SCALENE;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Triangle Classifier ===\n");

        int[][] tests = {
                {9,3,5},
                {3, 4, 5},
                {5, 5, 5},
                {5, 5, 3},
                {3, 5, 5},
                {5, 3, 5},
                {10, 3, 4},
                {7, 3, 4},
                {0, 5, 5},
                {-1, 5, 5}
        };

        System.out.printf("%-6s %-6s %-6s %-20s%n", "a", "b", "c", "Résultat");
        System.out.println("-".repeat(42));

        for (int[] t : tests) {
            TypeTriangle result = classifier(t[0], t[1], t[2]);
            System.out.printf("%-6d %-6d %-6d %-20s%n", t[0], t[1], t[2], result);
        }
    }
}