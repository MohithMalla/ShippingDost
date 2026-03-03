# Stage 1: Build
FROM maven:3.8.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# server.port=10000 is required for Render free tier compatibility
ENTRYPOINT ["java", "-Dserver.port=10000", "-jar", "app.jar"]