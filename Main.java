public class Main {

    public static void main(String[] args) {

        try {
            int x = 10 / 0;
        }
        catch (ArithmeticException e) {
            System.out.println("Math");
        }
        catch (Exception e) {
            System.out.println("General");
        }
    }
}