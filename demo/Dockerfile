# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /demo

COPY pom.xml .
COPY src/ ./src

RUN mvn clean package -DskipTests --file pom.xml

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /demo
COPY --from=build /demo/target/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
