# Stage 1: Build
FROM maven:3.8.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# We add -Dmaven.test.skip=true to skip both running AND compiling tests
RUN mvn clean package -Dmaven.test.skip=true

# Stage 2: Runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# server.port=10000 is required for Render free tier compatibility
ENTRYPOINT ["java", "-Dserver.port=10000", "-jar", "app.jar"]