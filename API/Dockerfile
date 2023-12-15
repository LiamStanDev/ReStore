FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app
EXPOSE 8080

# copy csporj and restore as distinct layer
COPY *.csproj ./ 
RUN dotnet restore

# copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# build runtime image because we don't need full sdk
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out ./
ENTRYPOINT [ "dotnet", "API.dll" ]
