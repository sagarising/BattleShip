rm -rf out/*.class
javac -cp "src:lib/junit-4.12.jar" -d out test/GameTest.java
javac -cp "src:lib/junit-4.12.jar" -d out test/PlayerTest.java
javac -cp "src:lib/junit-4.12.jar" -d out test/ShipTest.java
