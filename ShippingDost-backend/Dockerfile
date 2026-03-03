# Stage 1: Build
FROM maven:3.8.4-eclipse-temurin-17 AS build
WORKDIR /app
# We only copy the backend files because Render is already inside this folder
COPY . .
# RUN mvn clean package -DskipTests ensures Lombok & Maven align
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Find the jar regardless of the specific version name
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Force standard port for Render
ENTRYPOINT ["java", "-Dserver.port=10000", "-jar", "app.jar"]