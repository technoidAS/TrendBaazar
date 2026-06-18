# Stage 1: Build the application using .NET 10 SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-env
WORKDIR /app

# Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the remaining source code and publish the release build
COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Build the runtime container image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# Copy the compiled output from the build stage
COPY --from=build-env /app/out .

# Expose port (Render/Railway will bind to the PORT env variable at runtime)
EXPOSE 5108

# Start the application
ENTRYPOINT ["dotnet", "ecommerce-backend.dll"]
